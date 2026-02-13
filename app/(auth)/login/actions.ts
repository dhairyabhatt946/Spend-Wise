"use server";

import { prisma } from "@/app/lib/prisma";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import z, { email } from "zod";

const LoginSchema = z.object({
    email: z.string().email("Invalid email address"),
    password: z.string().min(1, "Password is required"),
});

export async function loginAction(prevState: any, formData: FormData) {
    const validatedFields = LoginSchema.safeParse({
        email: formData.get('email'),
        password: formData.get('password'),
    });

    if(!validatedFields.success) {
        return {error: "Invalid input fields"};
    }

    const {email, password} = validatedFields.data;

    try {
        const user = await prisma.user.findUnique({
            where: {email}
        });

        if(!user || !(await bcrypt.compare(password, user.password))) {
            return {error: "Invalid email or password."};
        }

        if(user.status === 'PENDING') {
            return {error: "Your account is pending approval from the admin."};
        }

        if(user.status === 'REJECTED') {
            return {error: "Your access request was rejected. Contact admin."};
        }

        const sessionData = {
            id: user.id,
            role: user.role,
            orgId: user.orgId,
            name: user.name,
        }

         ;(await cookies()).set('session', JSON.stringify(sessionData), {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24,
        });
    } catch (error) {
        return {error: "Something went wrong. Please try again."};
    }

    redirect('/dashboard');
}