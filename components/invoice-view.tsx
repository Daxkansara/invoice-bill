"use client"

import { useState, useEffect } from "react"
import { Download, CheckCircle, Clock, Trash2, Edit, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { generatePDF } from "@/utils/generate-pdf"
import type { Invoice, Product, Utensil, LineItem } from "@/types"
import { Combobox } from "@/components/ui/combobox"

interface InvoiceViewProps {
  invoice: Invoice
  onClose: () => void
  onStatusChange: (id: string, newStatus: "paid" | "pending") => void
  onDelete: (id: string) => void
  onEdit: (updatedInvoice: Invoice) => void
}

export function InvoiceView({ invoice: initialInvoice, onClose, onStatusChange, onDelete, onEdit }: InvoiceViewProps) {
  const [invoice, setInvoice] = useState(initialInvoice)
  const [products, setProducts] = useState<Product[]>([])
  const [utensils, setUtensils] = useState<Utensil[]>([])
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const storedProducts = localStorage.getItem("products")
    const storedUtensils = localStorage.getItem("utensils")
    if (storedProducts) setProducts(JSON.parse(storedProducts))
    if (storedUtensils) setUtensils(JSON.parse(storedUtensils))
  }, [])

  const handleDownload = async () => {
    try {
      setIsGeneratingPDF(true)
      await generatePDF("invoice-printable", `invoice-${invoice.id}`)
    } catch (error) {
      console.error("Error downloading PDF:", error)
    } finally {
      setIsGeneratingPDF(false)
    }
  }

  const handleSave = () => {
    onEdit(invoice)
    setIsEditing(false)
    onClose() // Close the invoice view after saving
  }

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
    setInvoice((prevInvoice) => {
      const newLineItems = [...prevInvoice.lineItems]
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

      return {
        ...prevInvoice,
        lineItems: newLineItems,
        totalBill: newTotalBill,
      }
    })
  }

  const removeLineItem = (index: number) => {
    const newLineItems = invoice.lineItems.filter((_, i) => i !== index)
    const newTotalBill = newLineItems.reduce((sum, item) => sum + item.totalPrice, 0)
    setInvoice({ ...invoice, lineItems: newLineItems, totalBill: newTotalBill })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 overflow-y-auto">
      <Card className="w-full max-w-3xl">
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-4">
            <h2 className="text-xl font-bold">મનમોહન - ઇનવોઇસ #{invoice.id}</h2>
            <Badge variant={invoice.status === "paid" ? "success" : "warning"} className="capitalize">
              {invoice.status === "paid" ? "ચૂકવેલ" : invoice.status === "pending" ? "બાકી" : "ડ્રાફ્ટ"}
            </Badge>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleDownload} className="bg-[#7C5DFA] hover:bg-[#9277FF]" disabled={isGeneratingPDF}>
              <Download className="mr-2 h-4 w-4" />
              {isGeneratingPDF ? "જનરેટ થઈ રહ્યું છે..." : "ડાઉનલોડ"}
            </Button>
            <Button
              onClick={() => onStatusChange(invoice.id, invoice.status === "paid" ? "pending" : "paid")}
              className={invoice.status === "paid" ? "bg-[#FF8F00]" : "bg-[#33D69F]"}
            >
              {invoice.status === "paid" ? (
                <>
                  <Clock className="mr-2 h-4 w-4" />
                  બાકી તરીકે માર્ક કરો
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  ચૂકવેલ તરીકે માર્ક કરો
                </>
              )}
            </Button>
            {isEditing ? (
              <Button onClick={handleSave} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Edit className="mr-2 h-4 w-4" />
                સાચવો
              </Button>
            ) : (
              <Button onClick={() => setIsEditing(true)} className="bg-blue-500 hover:bg-blue-600 text-white">
                <Edit className="mr-2 h-4 w-4" />
                સંપાદિત કરો
              </Button>
            )}
            <Button
              onClick={() => {
                onDelete(invoice.id)
                onClose()
              }}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              ઇનવોઇસ કાઢી નાખો
            </Button>
            <Button variant="outline" onClick={onClose}>
              બંધ કરો
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-white p-8 rounded-lg mb-4">
            <div className="flex justify-between mb-8">
              <div>
                <h3 className="font-bold text-2xl mb-1">ઇનવોઇસ</h3>
                <p className="text-sm text-muted-foreground">#{invoice.id}</p>
              </div>
              <div className="text-right">
                <p className="font-bold">{invoice.customerName}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p className="text-sm text-muted-foreground mb-1">ઇનવોઇસ તારીખ</p>
                <p className="font-bold">{invoice.date}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">ચુકવણી તારીખ</p>
                <p className="font-bold">{invoice.dueDate}</p>
              </div>
            </div>

            <div className="bg-[#F8F8FB] rounded-lg p-6 mb-8">
              <table className="w-full">
                <thead>
                  <tr className="text-sm text-muted-foreground">
                    <th className="text-left pb-4">આઇટમ</th>
                    <th className="text-center pb-4">વાસણ</th>
                    <th className="text-center pb-4">કુલ વજન</th>
                    <th className="text-center pb-4">વાસણ વજન</th>
                    <th className="text-center pb-4">ચોખ્ખું વજન</th>
                    <th className="text-right pb-4">કિંમત</th>
                    <th className="text-right pb-4">કુલ</th>
                    {isEditing && <th className="text-right pb-4">ક્રિયાઓ</th>}
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item, index) => (
                    <tr key={item.id} className="font-bold">
                      <td className="py-2">
                        {isEditing ? (
                          <Combobox
                            items={products.map((p) => ({ label: p.name, value: p.name }))}
                            value={item.productName}
                            onChange={(value) => updateLineItem(index, "productName", value)}
                            placeholder="ઉત્પાદન પસંદ કરો"
                          />
                        ) : (
                          item.productName
                        )}
                      </td>
                      <td className="text-center py-2">
                        {isEditing ? (
                          <Combobox
                            items={utensils.map((u) => ({ label: u.name, value: u.name }))}
                            value={item.utensilName}
                            onChange={(value) => updateLineItem(index, "utensilName", value)}
                            placeholder="વાસણ પસંદ કરો"
                          />
                        ) : (
                          item.utensilName
                        )}
                      </td>
                      <td className="text-center py-2">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.totalWeight}
                            onChange={(e) => updateLineItem(index, "totalWeight", Number(e.target.value))}
                            className="w-20 text-center"
                          />
                        ) : (
                          item.totalWeight.toFixed(2)
                        )}
                      </td>
                      <td className="text-center py-2">
                        {isEditing ? (
                          <Input
                            type="number"
                            value={item.utensilWeight}
                            onChange={(e) => updateLineItem(index, "utensilWeight", Number(e.target.value))}
                            className="w-20 text-center"
                          />
                        ) : (
                          item.utensilWeight.toFixed(2)
                        )}
                      </td>
                      <td className="text-center py-2">{item.netWeight.toFixed(2)}</td>
                      <td className="text-right py-2">₹{item.productPrice.toFixed(2)}</td>
                      <td className="text-right py-2">₹{item.totalPrice.toFixed(2)}</td>
                      {isEditing && (
                        <td className="text-right py-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
              {isEditing && (
                <Button onClick={addLineItem} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  નવી આઇટમ ઉમેરો
                </Button>
              )}
            </div>

            <div className="bg-[#373B53] text-white rounded-lg p-6">
              <div className="flex justify-between items-center">
                <span>કુલ બિલ</span>
                <span className="text-2xl font-bold">₹{invoice.totalBill.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Printable view (hidden) */}
          <div id="invoice-printable" className="hidden">
            <div className="bg-white p-8">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">મનમોહન ઇનવોઇસ</h1>
                <p className="text-xl">#{invoice.id}</p>
              </div>

              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h2 className="font-bold mb-2">ગ્રાહક:</h2>
                  <p>{invoice.customerName}</p>
                </div>
                <div className="text-right">
                  <p>
                    <strong>ઇનવોઇસ તારીખ:</strong> {invoice.date}
                  </p>
                  <p>
                    <strong>ચુકવણી તારીખ:</strong> {invoice.dueDate}
                  </p>
                </div>
              </div>

              <table className="w-full mb-8" style={{ borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #000" }}>
                    <th style={{ textAlign: "left", padding: "8px" }}>આઇટમ</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>વાસણ</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>કુલ વજન</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>વાસણ વજન</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>ચોખ્ખું વજન</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>કિંમત</th>
                    <th style={{ textAlign: "right", padding: "8px" }}>કુલ</th>
                  </tr>
                </thead>
                <tbody>
                  {invoice.lineItems.map((item) => (
                    <tr key={item.id} style={{ borderBottom: "1px solid #ddd" }}>
                      <td style={{ padding: "8px" }}>{item.productName}</td>
                      <td style={{ padding: "8px" }}>{item.utensilName}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>{item.totalWeight.toFixed(2)}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>{item.utensilWeight.toFixed(2)}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>{item.netWeight.toFixed(2)}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>₹{item.productPrice.toFixed(2)}</td>
                      <td style={{ textAlign: "right", padding: "8px" }}>₹{item.totalPrice.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div
                style={{
                  backgroundColor: "#373B53",
                  color: "white",
                  padding: "16px",
                  borderRadius: "8px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>કુલ બિલ</span>
                <span style={{ fontSize: "24px", fontWeight: "bold" }}>₹{invoice.totalBill.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

