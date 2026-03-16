'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createIncomeAction(userId: number, orgId: number, formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  const date = new Date(formData.get('date') as string)
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : null
  const projectId = formData.get('projectId') ? Number(formData.get('projectId')) : null

  if (!amount || isNaN(amount)) return { error: "Valid amount is required" }
  if (!date) return { error: "Date is required" }

  try {
    await prisma.income.create({
      data: {
        amount,
        date,
        description,
        categoryId,
        projectId,
        userId,
        orgId
      }
    })
    
    revalidatePath('/dashboard/incomes')
  } catch (error) {
    console.error("Income Error:", error)
    return { error: "Failed to save income" }
  }

  redirect('/dashboard/incomes')
}

export async function deleteIncomeAction(formData: FormData) {
  try {
    const incomeId = Number(formData.get('incomeId'))
    
    await prisma.income.delete({
      where: { id: incomeId }
    })
    
    revalidatePath('/dashboard/incomes')
    return { success: true }
  } catch (error) {
    console.error("Delete Income Error:", error)
    return { error: "Failed to delete income" }
  }
}