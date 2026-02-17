'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

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