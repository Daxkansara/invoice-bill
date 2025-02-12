import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import type { Invoice } from "../types"

interface InvoiceViewProps {
  invoice: Invoice
  onClose: () => void
}

export function InvoiceView({ invoice, onClose }: InvoiceViewProps) {
  const total = invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Invoice Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="font-semibold">Customer Name:</p>
            <p>{invoice.customerName}</p>
          </div>
          <div>
            <p className="font-semibold">Date:</p>
            <p>{invoice.date}</p>
          </div>
          <div>
            <p className="font-semibold">Due Date:</p>
            <p>{invoice.dueDate}</p>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {invoice.lineItems.map((item, index) => (
              <TableRow key={index}>
                <TableCell>{item.description}</TableCell>
                <TableCell>{item.quantity}</TableCell>
                <TableCell>${item.price.toFixed(2)}</TableCell>
                <TableCell>${(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <div className="mt-4 text-right">
          <p className="font-semibold">Total: ${total.toFixed(2)}</p>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={onClose}>Close</Button>
      </CardFooter>
    </Card>
  )
}

