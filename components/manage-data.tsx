"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import type { Customer, Product, Utensil } from "@/types"
import { Trash2, Edit } from "lucide-react"

export function ManageData() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [utensils, setUtensils] = useState<Utensil[]>([])
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  useEffect(() => {
    const storedCustomers = localStorage.getItem("customers")
    const storedProducts = localStorage.getItem("products")
    const storedUtensils = localStorage.getItem("utensils")

    if (storedCustomers) setCustomers(JSON.parse(storedCustomers))
    if (storedProducts) setProducts(JSON.parse(storedProducts))
    if (storedUtensils) setUtensils(JSON.parse(storedUtensils))
  }, [])

  const deleteCustomer = (id: string) => {
    const updatedCustomers = customers.filter((c) => c.id !== id)
    setCustomers(updatedCustomers)
    localStorage.setItem("customers", JSON.stringify(updatedCustomers))
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((p) => p.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))
  }

  const updateProductPrice = () => {
    if (editingProduct) {
      const updatedProducts = products.map((p) => (p.id === editingProduct.id ? editingProduct : p))
      setProducts(updatedProducts)
      localStorage.setItem("products", JSON.stringify(updatedProducts))
      setEditingProduct(null)
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Manage Customers</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {customers.map((customer) => (
              <li key={customer.id} className="flex justify-between items-center">
                <span>{customer.name}</span>
                <Button variant="destructive" size="sm" onClick={() => deleteCustomer(customer.id)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Manage Products</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {products.map((product) => (
              <li key={product.id} className="flex justify-between items-center">
                <span>
                  {product.name} - ₹{product.price.toFixed(2)}
                </span>
                <div className="space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Change Product Price</DialogTitle>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <Label htmlFor="price">New Price</Label>
                          <Input
                            id="price"
                            type="number"
                            value={editingProduct?.price || 0}
                            onChange={(e) =>
                              setEditingProduct((prev) => (prev ? { ...prev, price: Number(e.target.value) } : null))
                            }
                          />
                        </div>
                      </div>
                      <Button onClick={updateProductPrice}>Update Price</Button>
                    </DialogContent>
                  </Dialog>
                  <Button variant="destructive" size="sm" onClick={() => deleteProduct(product.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}

