export interface LineItem {
  id: string
  productName: string
  utensilName: string
  totalWeight: number
  utensilWeight: number
  netWeight: number
  productPrice: number
  totalPrice: number
}

export interface Invoice {
  id: string
  customerId: string
  customerName: string
  date: string
  dueDate: string
  status: "paid" | "pending" | "draft"
  lineItems: LineItem[]
  year: number
  totalBill: number
}

export interface Customer {
  id: string
  name: string
  email: string
  address: string
}

export interface Product {
  id: string
  name: string
  price: number
}

export interface Utensil {
  id: string
  name: string
  weight: number
}

