import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Invoice, LineItem } from "../types"

interface InvoiceFormProps {
  onSubmit: (invoice: Invoice) => void
  onCancel: () => void
}

export function InvoiceForm({ onSubmit, onCancel }: InvoiceFormProps) {
  const [invoice, setInvoice] = useState<Invoice>({
    customerName: "",
    date: "",
    dueDate: "",
    lineItems: [],
  })

  const addLineItem = () => {
    setInvoice({
      ...invoice,
      lineItems: [...invoice.lineItems, { description: "", quantity: 0, price: 0 }],
    })
  }

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const newLineItems = [...invoice.lineItems]
    newLineItems[index] = { ...newLineItems[index], [field]: value }
    setInvoice({ ...invoice, lineItems: newLineItems })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(invoice)
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Create New Invoice</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={invoice.customerName}
                onChange={(e) => setInvoice({ ...invoice, customerName: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={invoice.date}
                onChange={(e) => setInvoice({ ...invoice, date: e.target.value })}
              />
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={invoice.dueDate}
                onChange={(e) => setInvoice({ ...invoice, dueDate: e.target.value })}
              />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Line Items</h3>
            {invoice.lineItems.map((item, index) => (
              <div key={index} className="grid grid-cols-3 gap-2 mb-2">
                <Input
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => updateLineItem(index, "description", e.target.value)}
                />
                <Input
                  type="number"
                  placeholder="Quantity"
                  value={item.quantity}
                  onChange={(e) => updateLineItem(index, "quantity", Number.parseInt(e.target.value))}
                />
                <Input
                  type="number"
                  placeholder="Price"
                  value={item.price}
                  onChange={(e) => updateLineItem(index, "price", Number.parseFloat(e.target.value))}
                />
              </div>
            ))}
            <Button type="button" onClick={addLineItem} className="mt-2">
              Add Line Item
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Create Invoice</Button>
      </CardFooter>
    </Card>
  )
}

