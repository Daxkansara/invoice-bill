import type { Invoice } from "@/types"

export interface MonthlyBillData {
  month: string
  year: number
  totalAmount: number
  invoices: Invoice[]
}

export const monthlyBillData: MonthlyBillData[] = [
  {
    month: "જાન્યુઆરી",
    year: 2025,
    totalAmount: 15000,
    invoices: [],
  },
  {
    month: "ફેબ્રુઆરી",
    year: 2025,
    totalAmount: 18000,
    invoices: [],
  },
  {
    month: "માર્ચ",
    year: 2025,
    totalAmount: 20000,
    invoices: [],
  },
]

