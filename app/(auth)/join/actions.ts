"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import z from "zod";

const joinSchema = z.object({
    fullName: z.string().min(2, "Name is required"),
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Password must be 6+ chars"),
    mobile: z.string().regex(/^[6-9]\d{9}$/, "Mobile must be a valid 10-digit number"),
    orgCode: z.string().min(1, "Organization code is required"),
    role: z.enum(["ADMIN", "EMPLOYEE"]),
});

export async function joinOrgAction(prevState: any, formData: FormData) {
    const validatedFields = joinSchema.safeParse({
        fullName: formData.get('fullName'),
        email: formData.get('email'),
        password: formData.get('password'),
        mobile: formData.get('mobile'),
        orgCode: formData.get('orgCode'),
        role: formData.get('role'),
    });

    if (!validatedFields.success) {
        return { error: "Invalid input fields." };
    }

    const { fullName, email, password, mobile, orgCode, role } = validatedFields.data;

    try {
        const org = await prisma.organization.findUnique({
            where: { code: orgCode.toUpperCase() },
        });

        if (!org) {
            return { error: "Invalid Organization Code. Please check with your manager." };
        }

        const existingUser = await prisma.user.findUnique({
            where: { email },
        });

        if (existingUser) {
            return { error: "Email already registered. Try logging in." };
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.create({
            data: {
                name: fullName,
                email: email,
                password: hashedPassword,
                mobile: mobile,
                role: role as 'ADMIN' | 'EMPLOYEE',
                status: 'PENDING',
                orgId: org.id,
            }
        });
    } catch (error) {
        return { error: "Something went wrong. Please try again." }
    }

    redirect('/login?joined=true');
}