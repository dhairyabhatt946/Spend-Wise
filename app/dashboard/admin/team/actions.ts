'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import bcrypt from 'bcryptjs'

export async function approveUserAction(formData: FormData) {
    try {
        const userId = Number(formData.get('userId'))
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'ACTIVE' }
        })
        revalidatePath('/dashboard/admin/team')
    } catch (error) {
        console.error('Failed to approve user:', error)
    }
}

export async function rejectUserAction(formData: FormData) {
    try {
        const userId = Number(formData.get('userId'))
        await prisma.user.update({
            where: { id: userId },
            data: { status: 'REJECTED' }
        })
        revalidatePath('/dashboard/admin/team')
    } catch (error) {
        console.error('Failed to reject user:', error)
    }
}

export async function deleteUserAction(formData: FormData) {
  try {
    const userId = Number(formData.get('userId'))
    
    const user = await prisma.user.findUnique({ where: { id: userId } })
    if (user?.role === 'OWNER') {
      return { error: "Cannot delete the organization owner." }
    }

    await prisma.user.delete({
      where: { id: userId }
    })
    
    revalidatePath('/dashboard/admin/team')
    return { success: true }
  } catch (error) {
    console.error("Delete User Error:", error)
    return { error: "Failed to delete user" }
  }
}

export async function addUserDirectlyAction(orgId: number, formData: FormData) {
  const name = formData.get('name') as string
  const email = formData.get('email') as string
  const password = formData.get('password') as string // NEW: Get password
  const role = formData.get('role') as "ADMIN" | "EMPLOYEE"

  if (!name || !email || !password) return { error: "Name, Email, and Password are required" }

  try {
    const existingUser = await prisma.user.findUnique({ where: { email } })
    if (existingUser) {
      return { error: "A user with this email already exists." }
    }
    const hashedPassword = await bcrypt.hash(password, 10)

    await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role,
        status: 'ACTIVE',
        orgId: orgId
      }
    })

    revalidatePath('/dashboard/admin/team')
    return { success: true }
  } catch (error) {
    console.error("Add User Error:", error)
    return { error: "Failed to add user" }
  }
}