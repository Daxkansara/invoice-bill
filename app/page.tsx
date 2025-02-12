"use client"
import { useState, useMemo, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { EmptyState } from "@/components/empty-state"
import { InvoiceForm } from "@/components/invoice-form"
import { InvoiceView } from "@/components/invoice-view"
import { ManageData } from "@/components/manage-data"
import { ErrorBoundary } from "@/components/error-boundary"
import type { Invoice } from "@/types"

export default function Home() {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isAddingInvoice, setIsAddingInvoice] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null)
  const [filter, setFilter] = useState("all")
  const [customerFilter, setCustomerFilter] = useState("all")
  const [showHistory, setShowHistory] = useState(false)
  const [showManageData, setShowManageData] = useState(false)

  useEffect(() => {
    const storedInvoices = localStorage.getItem("invoices")
    if (storedInvoices) {
      setInvoices(JSON.parse(storedInvoices))
    }
  }, [])

  const addInvoice = (invoice: Invoice) => {
    const updatedInvoices = [...invoices, invoice]
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
    setIsAddingInvoice(false)
  }

  const updateInvoice = (updatedInvoice: Invoice) => {
    setInvoices((prevInvoices) => {
      const updatedInvoices = prevInvoices.map((inv) => (inv.id === updatedInvoice.id ? updatedInvoice : inv))
      localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
      return updatedInvoices
    })
  }

  const handleStatusChange = (id: string, newStatus: "paid" | "pending") => {
    const updatedInvoices = invoices.map((invoice) => (invoice.id === id ? { ...invoice, status: newStatus } : invoice))
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const handleDeleteInvoice = (id: string) => {
    const updatedInvoices = invoices.filter((invoice) => invoice.id !== id)
    setInvoices(updatedInvoices)
    localStorage.setItem("invoices", JSON.stringify(updatedInvoices))
  }

  const filteredInvoices = useMemo(() => {
    return invoices.filter(
      (invoice) =>
        (filter === "all" || invoice.status === filter) &&
        (customerFilter === "all" || invoice.customerId === customerFilter),
    )
  }, [invoices, filter, customerFilter])

  const customerBills = useMemo(() => {
    const bills: { [key: string]: number } = {}
    filteredInvoices.forEach((invoice) => {
      if (bills[invoice.customerId]) {
        bills[invoice.customerId] += invoice.totalBill
      } else {
        bills[invoice.customerId] = invoice.totalBill
      }
    })
    return bills
  }, [filteredInvoices])

  const billHistory = useMemo(() => {
    const history: { [key: string]: number } = {}
    invoices.forEach((invoice) => {
      if (history[invoice.date]) {
        history[invoice.date] += invoice.totalBill
      } else {
        history[invoice.date] = invoice.totalBill
      }
    })
    return Object.entries(history).sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
  }, [invoices])

  return (
    <ErrorBoundary>
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between mb-16">
          <div>
            <h1 className="text-4xl font-bold mb-1">મનમોહન ઇનવોઇસ</h1>
            <p className="text-[#888EB0]">
              {filteredInvoices.length > 0 ? `કુલ ${filteredInvoices.length} ઇનવોઇસ` : "કોઈ ઇનવોઇસ નથી"}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <Select defaultValue="all" onValueChange={(value) => setFilter(value)}>
              <SelectTrigger className="w-40 border-0 font-bold">
                <SelectValue placeholder="સ્થિતિ દ્વારા ફિલ્ટર કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">બધા</SelectItem>
                <SelectItem value="paid">ચૂકવેલ</SelectItem>
                <SelectItem value="pending">બાકી</SelectItem>
                <SelectItem value="draft">ડ્રાફ્ટ</SelectItem>
              </SelectContent>
            </Select>
            <Select defaultValue="all" onValueChange={(value) => setCustomerFilter(value)}>
              <SelectTrigger className="w-40 border-0 font-bold">
                <SelectValue placeholder="ગ્રાહક દ્વારા ફિલ્ટર કરો" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">બધા ગ્રાહકો</SelectItem>
                {Array.from(new Set(invoices.map((inv) => inv.customerId))).map((customerId) => {
                  const customer = invoices.find((inv) => inv.customerId === customerId)?.customerName
                  return (
                    <SelectItem key={customerId} value={customerId}>
                      {customer || "અજ્ઞાત ગ્રાહક"}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>
            <Button variant="outline" onClick={() => setShowManageData(!showManageData)} className="mr-2">
              {showManageData ? "ઇનવોઇસ બતાવો" : "ડેટા મેનેજ કરો"}
            </Button>
            <Button variant="outline" onClick={() => setShowHistory(!showHistory)} className="mr-2">
              {showHistory ? "ઇનવોઇસ બતાવો" : "ઇતિહાસ બતાવો"}
            </Button>
            <Button
              className="bg-[#7C5DFA] hover:bg-[#9277FF] rounded-full h-12 px-4 gap-2"
              onClick={() => setIsAddingInvoice(true)}
            >
              <div className="flex items-center justify-center bg-white w-8 h-8 rounded-full">
                <Plus className="h-4 w-4 text-[#7C5DFA]" />
              </div>
              <span>નવું ઇનવોઇસ</span>
            </Button>
          </div>
        </header>
        {showManageData ? (
          <ManageData />
        ) : showHistory ? (
          <div className="space-y-4 mt-8">
            <h2 className="text-2xl font-bold mb-4">બિલ ઇતિહાસ</h2>
            {billHistory.map(([date, total]) => (
              <div
                key={date}
                className="bg-white dark:bg-[#1E2139] rounded-lg shadow p-6 flex items-center justify-between"
              >
                <div>
                  <span className="font-bold">{new Date(date).toLocaleDateString("gu-IN")}</span>
                </div>
                <div>
                  <span className="font-bold text-xl">₹{total.toFixed(2)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : filteredInvoices.length > 0 ? (
          <div className="space-y-4">
            {filteredInvoices.map((invoice) => (
              <div
                key={invoice.id}
                className="bg-white dark:bg-[#1E2139] rounded-lg shadow p-6 flex items-center justify-between cursor-pointer"
                onClick={() => setViewingInvoice(invoice)}
              >
                <div className="flex items-center gap-6">
                  <span className="font-bold">#{invoice.id}</span>
                  <span className="text-[#888EB0]">ચુકવણી તારીખ {invoice.dueDate}</span>
                  <span>{invoice.customerName}</span>
                </div>
                <div className="flex items-center gap-6">
                  <span className="font-bold text-xl">₹{invoice.totalBill.toFixed(2)}</span>
                  <div
                    className={`px-4 py-2 rounded-md font-bold capitalize ${
                      invoice.status === "paid"
                        ? "bg-[#33D69F]/10 text-[#33D69F]"
                        : invoice.status === "pending"
                          ? "bg-[#FF8F00]/10 text-[#FF8F00]"
                          : "bg-[#DFE3FA] text-[#373B53] dark:bg-[#DFE3FA]/10 dark:text-[#DFE3FA]"
                    }`}
                  >
                    {invoice.status === "paid" ? "ચૂકવેલ" : invoice.status === "pending" ? "બાકી" : "ડ્રાફ્ટ"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
        {customerFilter !== "all" && (
          <div className="mt-8">
            <h2 className="text-2xl font-bold mb-4">ગ્રાહક બિલ</h2>
            <div className="bg-white dark:bg-[#1E2139] rounded-lg shadow p-6 flex items-center justify-between">
              <span className="font-bold">
                {invoices.find((inv) => inv.customerId === customerFilter)?.customerName || "અજ્ઞાત ગ્રાહક"}
              </span>
              <span className="font-bold text-xl">₹{customerBills[customerFilter]?.toFixed(2) || "0.00"}</span>
            </div>
          </div>
        )}
        {isAddingInvoice && <InvoiceForm onSubmit={addInvoice} onCancel={() => setIsAddingInvoice(false)} />}
        {editingInvoice && (
          <InvoiceForm
            onSubmit={updateInvoice}
            onCancel={() => setEditingInvoice(null)}
            editingInvoice={editingInvoice}
          />
        )}
        {viewingInvoice && (
          <InvoiceView
            invoice={viewingInvoice}
            onClose={() => setViewingInvoice(null)}
            onStatusChange={handleStatusChange}
            onDelete={handleDeleteInvoice}
            onEdit={updateInvoice}
          />
        )}
      </div>
    </ErrorBoundary>
  )
}

