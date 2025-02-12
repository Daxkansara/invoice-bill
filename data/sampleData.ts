import type { Customer, Product, Utensil } from "@/types"

export const customers: Customer[] = [
  { id: "1", name: "જોન ડો", email: "john@example.com", address: "123 મુખ્ય રસ્તો, શહેર, દેશ" },
  { id: "2", name: "જેન સ્મિથ", email: "jane@example.com", address: "456 એલ્મ રસ્તો, નગર, દેશ" },
  { id: "3", name: "બોબ જોન્સન", email: "bob@example.com", address: "789 ઓક રસ્તો, ગામ, દેશ" },
]

export const products: Product[] = [
  { id: "1", name: "વેબ ડિઝાઇન", price: 500 },
  { id: "2", name: "લોગો ડિઝાઇન", price: 300 },
  { id: "3", name: "SEO સેવાઓ", price: 200 },
  { id: "4", name: "કન્ટેન્ટ લેખન", price: 100 },
  { id: "5", name: "સોશિયલ મીડિયા મેનેજમેન્ટ", price: 250 },
]

export const utensils: Utensil[] = [
  { id: "1", name: "કમ્પ્યુટર" },
  { id: "2", name: "પેન" },
  { id: "3", name: "નોટબુક" },
]

