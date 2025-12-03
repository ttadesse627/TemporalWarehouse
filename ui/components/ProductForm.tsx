"use client";

import { Product, warehouseApi } from "../lib/warehouseApi";
import React, { useState } from "react";
import toast from "react-hot-toast";

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
    <form className="space-y-4" onSubmit={submit}>
      <h2 className="text-xl font-semibold">
        {initial ? "Edit Product" : "Create Product"}
      </h2>

      <div>
        <label className="block mb-1">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">SKU</label>
        <input
          value={sku}
          onChange={(e) => setSku(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      <div>
        <label className="block mb-1">Price</label>
        <input
          type="number"
          step="0.01"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border px-3 py-2 rounded-md"
        />
      </div>

      {!initial && (
        <div>
          <label className="block mb-1">Initial Quantity</label>
          <input
            type="number"
            value={initialQty}
            onChange={(e) => setInitialQty(e.target.value)}
            className="w-full border px-3 py-2 rounded-md"
          />
        </div>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </form>
  );
}