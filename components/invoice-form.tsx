"use client"

import { useState, useEffect } from "react"
import { Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Combobox } from "@/components/ui/combobox"
import type { Invoice, LineItem, Customer, Product, Utensil } from "@/types"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void
  onCancel: () => void
  editingInvoice?: Invoice
}

export function InvoiceForm({ onSubmit, onCancel, editingInvoice }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Omit<Invoice, "id">>({
    customerId: "",
    customerName: "",
    date: "",
    dueDate: "",
    status: "pending",
    lineItems: [],
    year: new Date().getFullYear(),
    totalBill: 0,
  })

  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [utensils, setUtensils] = useState<Utensil[]>([])

  const [newCustomerName, setNewCustomerName] = useState("")
  const [newProductName, setNewProductName] = useState("")
  const [newProductPrice, setNewProductPrice] = useState("")
  const [newUtensilName, setNewUtensilName] = useState("")
  const [newUtensilWeight, setNewUtensilWeight] = useState("")

  useEffect(() => {
    // Load data from localStorage
    const storedCustomers = localStorage.getItem("customers")
    const storedProducts = localStorage.getItem("products")
    const storedUtensils = localStorage.getItem("utensils")

    if (storedCustomers) setCustomers(JSON.parse(storedCustomers))
    if (storedProducts) setProducts(JSON.parse(storedProducts))
    if (storedUtensils) setUtensils(JSON.parse(storedUtensils))

    // If editing an existing invoice, populate the form
    if (editingInvoice) {
      setInvoice(editingInvoice)
    }
  }, [editingInvoice])

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      lineItems: [
        ...invoice.lineItems,
        {
          id: Date.now().toString(),
          productName: "",
          utensilName: "",
          totalWeight: 0,
          utensilWeight: 0,
          netWeight: 0,
          productPrice: 0,
          totalPrice: 0,
        },
      ],
    })
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newLineItems = [...invoice.lineItems]
    newLineItems[index] = { ...newLineItems[index], [field]: value }

    // If product is changed, update the price
    if (field === "productName") {
      const product = products.find((p) => p.name === value)
      if (product) {
        newLineItems[index].productPrice = product.price
      }
    }

    // Recalculate netWeight and totalPrice
    newLineItems[index].netWeight = newLineItems[index].totalWeight - newLineItems[index].utensilWeight
    newLineItems[index].totalPrice = newLineItems[index].netWeight * newLineItems[index].productPrice

    const newTotalBill = newLineItems.reduce((sum, item) => sum + item.totalPrice, 0)

    setInvoice({ ...invoice, lineItems: newLineItems, totalBill: newTotalBill })
  }

  const removeLineItem = (index: number) => {
    const newLineItems = invoice.lineItems.filter((_, i) => i !== index)
    const newTotalBill = newLineItems.reduce((sum, item) => sum + item.totalPrice, 0)
    setInvoice({ ...invoice, lineItems: newLineItems, totalBill: newTotalBill })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...invoice, id: editingInvoice?.id || Date.now().toString() } as Invoice)
  }

  const addNewCustomer = () => {
    if (newCustomerName.trim()) {
      const newCustomer = {
        id: `c${Date.now()}`,
        name: newCustomerName,
        email: "",
        address: "",
      }
      const updatedCustomers = [...customers, newCustomer]
      setCustomers(updatedCustomers)
      localStorage.setItem("customers", JSON.stringify(updatedCustomers))
      setInvoice({ ...invoice, customerId: newCustomer.id, customerName: newCustomer.name })
      setNewCustomerName("")
    }
  }

  const addNewProduct = () => {
    if (newProductName.trim() && newProductPrice.trim()) {
      const newProduct = {
        id: `p${Date.now()}`,
        name: newProductName,
        price: Number.parseFloat(newProductPrice),
      }
      const updatedProducts = [...products, newProduct]
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      setNewProductName("")
      setNewProductPrice("")
    }
  }

  const addNewUtensil = () => {
    if (newUtensilName.trim() && newUtensilWeight.trim()) {
      const newUtensil = {
        id: `u${Date.now()}`,
        name: newUtensilName,
        weight: Number.parseFloat(newUtensilWeight),
      }
      const updatedUtensils = [...utensils, newUtensil]
      setUtensils(updatedUtensils)
      localStorage.setItem("utensils", JSON.stringify(updatedUtensils))
      setNewUtensilName("")
      setNewUtensilWeight("")
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>{editingInvoice ? "મનમોહન - ઇનવોઇસ સંપાદિત કરો" : "મનમોહન - નવું ઇનવોઇસ"}</CardTitle>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="customerId">ગ્રાહક</Label>
              <div className="flex gap-2">
                <Select
                  value={invoice.customerId}
                  onValueChange={(value) => {
                    const selectedCustomer = customers.find((c) => c.id === value)
                    setInvoice({ ...invoice, customerId: value, customerName: selectedCustomer?.name || "" })
                  }}
                >
                  <SelectTrigger className="flex-grow">
                    <SelectValue placeholder="ગ્રાહક પસંદ કરો" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">નવું ઉમેરો</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>નવો ગ્રાહક ઉમેરો</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid gap-2">
                        <Label htmlFor="newCustomerName">નામ</Label>
                        <Input
                          id="newCustomerName"
                          value={newCustomerName}
                          onChange={(e) => setNewCustomerName(e.target.value)}
                        />
                      </div>
                    </div>
                    <Button onClick={addNewCustomer}>ગ્રાહક ઉમેરો</Button>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">ઇનવોઇસ તારીખ</Label>
                <Input
                  id="date"
                  type="date"
                  value={invoice.date}
                  onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="dueDate">ચુકવણી તારીખ</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={invoice.dueDate}
                  onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="status">સ્થિતિ</Label>
              <Select
                value={invoice.status}
                onValueChange={(value) => setInvoice({ ...invoice, status: value as "paid" | "pending" | "draft" })}
              >
                <SelectTrigger id="status">
                  <SelectValue placeholder="સ્થિતિ પસંદ કરો" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="paid">ચૂકવેલ</SelectItem>
                  <SelectItem value="pending">બાકી</SelectItem>
                  <SelectItem value="draft">ડ્રાફ્ટ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>લાઇન આઇટમ્સ</Label>
              {invoice.lineItems.map((item, index) => (
                <div key={item.id} className="flex flex-wrap items-end gap-2 mt-2">
                  <div className="flex-grow">
                    <Label>ઉત્પાદન નામ</Label>
                    <Combobox
                      items={products.map((p) => ({ label: p.name, value: p.name }))}
                      value={item.productName}
                      onChange={(value) => updateLineItem(index, "productName", value)}
                      placeholder="ઉત્પાદન પસંદ કરો અથવા ટાઇપ કરો"
                    />
                  </div>
                  <div className="flex-grow">
                    <Label>વાસણ નામ</Label>
                    <Combobox
                      items={utensils.map((u) => ({ label: u.name, value: u.name }))}
                      value={item.utensilName}
                      onChange={(value) => updateLineItem(index, "utensilName", value)}
                      placeholder="વાસણ પસંદ કરો અથવા ટાઇપ કરો"
                    />
                  </div>
                  <div className="w-24">
                    <Label>કુલ વજન</Label>
                    <Input
                      type="number"
                      placeholder="કુલ વજન"
                      value={item.totalWeight}
                      onChange={(e) => updateLineItem(index, "totalWeight", Number(e.target.value))}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="w-24">
                    <Label>વાસણ વજન</Label>
                    <Input
                      type="number"
                      placeholder="વાસણ વજન"
                      value={item.utensilWeight}
                      onChange={(e) => updateLineItem(index, "utensilWeight", Number(e.target.value))}
                      required
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="w-24">
                    <Label>ચોખ્ખું વજન</Label>
                    <Input type="number" value={item.netWeight.toFixed(2)} readOnly />
                  </div>
                  <div className="w-24">
                    <Label>ઉત્પાદન કિંમત</Label>
                    <Input type="number" value={item.productPrice.toFixed(2)} readOnly />
                  </div>
                  <div className="w-24">
                    <Label>કુલ કિંમત</Label>
                    <Input type="number" value={item.totalPrice.toFixed(2)} readOnly />
                  </div>
                  <Button type="button" variant="ghost" size="icon" onClick={() => removeLineItem(index)}>
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button type="button" variant="outline" onClick={addLineItem} className="mt-2">
                <Plus className="h-4 w-4 mr-2" /> આઇટમ ઉમેરો
              </Button>
            </div>
            <div className="flex gap-2">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">નવું ઉત્પાદન ઉમેરો</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>નવું ઉત્પાદન ઉમેરો</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newProductName">નામ</Label>
                      <Input
                        id="newProductName"
                        value={newProductName}
                        onChange={(e) => setNewProductName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newProductPrice">કિંમત</Label>
                      <Input
                        id="newProductPrice"
                        type="number"
                        value={newProductPrice}
                        onChange={(e) => setNewProductPrice(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={addNewProduct}>ઉત્પાદન ઉમેરો</Button>
                </DialogContent>
              </Dialog>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">નવું વાસણ ઉમેરો</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>નવું વાસણ ઉમેરો</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                      <Label htmlFor="newUtensilName">નામ</Label>
                      <Input
                        id="newUtensilName"
                        value={newUtensilName}
                        onChange={(e) => setNewUtensilName(e.target.value)}
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="newUtensilWeight">વજન (કિલોગ્રામ)</Label>
                      <Input
                        id="newUtensilWeight"
                        type="number"
                        value={newUtensilWeight}
                        onChange={(e) => setNewUtensilWeight(e.target.value)}
                      />
                    </div>
                  </div>
                  <Button onClick={addNewUtensil}>વાસણ ઉમેરો</Button>
                </DialogContent>
              </Dialog>
            </div>
            <div className="mt-4">
              <Label>કુલ બિલ</Label>
              <div className="text-2xl font-bold">₹{invoice.totalBill.toFixed(2)}</div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button type="button" variant="ghost" onClick={onCancel}>
              રદ કરો
            </Button>
            <Button type="submit" className="bg-[#7C5DFA] hover:bg-[#9277FF]">
              {editingInvoice ? "ઇનવોઇસ અપડેટ કરો" : "ઇનવોઇસ સાચવો"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

