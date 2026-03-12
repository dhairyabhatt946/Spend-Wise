'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createCategoryAction(orgId: number, formData: FormData) {
  const name = formData.get('name') as string
  const type = formData.get('type') as string

  if (!name) return { error: "Category name is required" }

  try {
    await prisma.category.create({
      data: {
        name,
        isExpense: type === 'expense',
        isIncome: type === 'income',
        orgId: orgId
      }
    })
    revalidatePath('/dashboard/admin/masters')
    return { success: true }
  } catch (error) {
    return { error: "Failed to create category" }
  }
}

export async function createProjectAction(orgId: number, formData: FormData) {
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  if (!name) return { error: "Project name is required" }

  try {
    await prisma.project.create({
      data: {
        name,
        description,
        orgId: orgId
      }
    })
    revalidatePath('/dashboard/admin/masters')
    return { success: true }
  } catch (error) {
    return { error: "Failed to create project" }
  }
}