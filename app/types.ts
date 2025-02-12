export interface LineItem {
  description: string
  quantity: number
  price: number
}

export interface Invoice {
  id?: string
  customerName: string
  date: string
  dueDate: string
  lineItems: LineItem[]
}

