import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Eye, Trash2 } from "lucide-react"
import type { Invoice } from "../types"

interface InvoiceListProps {
  invoices: Invoice[]
  onView: (invoice: Invoice) => void
  onDelete: (id: string) => void
}

export function InvoiceList({ invoices, onView, onDelete }: InvoiceListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Customer Name</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Due Date</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((invoice) => (
          <TableRow key={invoice.id}>
            <TableCell>{invoice.customerName}</TableCell>
            <TableCell>{invoice.date}</TableCell>
            <TableCell>{invoice.dueDate}</TableCell>
            <TableCell>
              ${invoice.lineItems.reduce((sum, item) => sum + item.quantity * item.price, 0).toFixed(2)}
            </TableCell>
            <TableCell>
              <Button variant="ghost" size="icon" onClick={() => onView(invoice)}>
                <Eye className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon" onClick={() => onDelete(invoice.id!)}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

