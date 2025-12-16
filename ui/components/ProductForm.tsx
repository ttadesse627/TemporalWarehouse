"use client";

import { Product, warehouseApi } from "../lib/warehouseApi";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { Package, DollarSign, Hash, Plus, Save, X, Loader2 } from "lucide-react";

export default function ProductForm({
  initial,
  onSaved,
  onCancel,
}: {
  initial?: Product | null;
  onSaved(product: Product): void;
  onCancel(): void;
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [price, setPrice] = useState(initial ? String(initial.price) : "");
  const [initialQty, setInitialQty] = useState("0");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let product;

      if (initial) {
        product = await warehouseApi.updateProduct(initial.id, {
          name,
          sku,
          price: Number(price),
        });
      } else {
        product = await warehouseApi.createProduct({
          name,
          sku,
          price: Number(price),
          initialQuantity: Number(initialQty),
        });
      }

      onSaved(product);
    } catch (err: any) {
      toast.error(err?.response?.data || "Operation failed");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Package className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              {initial ? "Edit Product" : "Create New Product"}
            </h2>
            <p className="text-gray-600 text-sm">
              {initial ? "Update product details" : "Add a new product to your inventory"}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-6">
        {/* Form Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Product Name <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter product name"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            <p className="text-xs text-gray-500">Enter the full product name</p>
          </div>

          {/* SKU Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              SKU (Stock Keeping Unit) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hash className="h-5 w-5 text-gray-400" />
              </div>
              <input
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                required
                placeholder="e.g., PROD-001"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white font-mono"
              />
            </div>
            <p className="text-xs text-gray-500">Unique identifier for the product</p>
          </div>

          {/* Price Field */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                required
                placeholder="0.00"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
              />
            </div>
            <p className="text-xs text-gray-500">Enter price in USD</p>
          </div>

          {!initial && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Initial Quantity
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Plus className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="number"
                  min="0"
                  value={initialQty}
                  onChange={(e) => setInitialQty(e.target.value)}
                  placeholder="0"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                />
              </div>
              <p className="text-xs text-gray-500">Starting stock quantity (optional)</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Preview</h3>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600">
                <span className="font-medium">Name:</span> {name || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">SKU:</span> {sku || "Not set"}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Price:</span> ${price || "0.00"}
              </p>
              {!initial && (
                <p className="text-gray-600">
                  <span className="font-medium">Initial Stock:</span> {initialQty} units
                </p>
              )}
            </div>
            <div className="text-right">
              <div className="inline-block px-3 py-1 bg-white rounded-full border border-blue-200">
                <span className="text-sm font-semibold text-blue-600">
                  {initial ? "UPDATE" : "NEW"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onCancel}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
          >
            <X className="h-4 w-4" />
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving || !name || !sku || !price}
            className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {initial ? "Update Product" : "Create Product"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}