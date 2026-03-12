'use server'

import { prisma } from '@/app/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createExpenseAction(userId: number, orgId: number, formData: FormData) {
  const amount = parseFloat(formData.get('amount') as string)
  const date = new Date(formData.get('date') as string)
  const description = formData.get('description') as string
  const categoryId = formData.get('categoryId') ? Number(formData.get('categoryId')) : null
  const projectId = formData.get('projectId') ? Number(formData.get('projectId')) : null

  if (!amount || isNaN(amount)) return { error: "Valid amount is required" }
  if (!date) return { error: "Date is required" }

  try {
    await prisma.expense.create({
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
    
    revalidatePath('/dashboard/expenses')
  } catch (error) {
    console.error("Expense Error:", error)
    return { error: "Failed to save expense" }
  }

  redirect('/dashboard/expenses')
}

export async function deleteExpenseAction(expenseId: number) {
  try {
    await prisma.expense.delete({
      where: { id: expenseId }
    })
    
    revalidatePath('/dashboard/expenses')
  } catch (error) {
    console.error("Delete Expense Error:", error)
    return { error: "Failed to delete expense" }
  }
}