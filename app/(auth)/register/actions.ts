"use server";

import { z } from 'zod';
import { prisma } from '@/app/lib/prisma';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { redirect } from 'next/navigation';

// Validation Schema
const RegisterSchema = z.object({
  orgName: z.string().min(2, "Company name is required"),
  ownerName: z.string().min(2, "Your name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  mobile: z.string().regex(/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit number"),
});

export async function registerOrgAction(prevState: any, formData: FormData) {
  // Validate Form Data
  const validatedFields = RegisterSchema.safeParse({
    orgName: formData.get('orgName'),
    ownerName: formData.get('ownerName'),
    email: formData.get('email'),
    password: formData.get('password'),
    mobile: formData.get('mobile'),
  });

  if (!validatedFields.success) {
    return { error: "Invalid input fields" };
  }

  const { orgName, ownerName, email, password, mobile } = validatedFields.data;

  try {
    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "Email already registered. Please login or use a different email." };
    }

    // Generate Unique Org Code (e.g., "TATA-X92")
    // We take first 3 chars of Org Name + random characters
    const shortCode = orgName.substring(0, 3).toUpperCase().replace(/\s/g, '');
    const uniqueSuffix = nanoid(4).toUpperCase();
    const orgCode = `${shortCode}-${uniqueSuffix}`;

    // Hash Password
    const hashedPawwsord = await bcrypt.hash(password, 10);

    // Transaction: Create Org + Create Owner User
    await prisma.$transaction(async (tx) => {
      // Create Organization
      const newOrg = await tx.organization.create({
        data: {
          name: orgName,
          code: orgCode,
        }
      });

      // Create Owner User linked to that Org
      await tx.user.create({
        data: {
          name: ownerName,
          email: email,
          password: hashedPawwsord,
          mobile: mobile,
          role: 'OWNER',
          status: 'ACTIVE',
          orgId: newOrg.id,
        }
      });
    });
  } catch (error) {
    return { error: "Something went wrong. Please try again." };
  }

  redirect('/login?registered=true');
}