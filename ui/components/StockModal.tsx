"use client";

import React, { useState } from "react";
import { Product, warehouseApi } from "../lib/warehouseApi";
import toast from "react-hot-toast";

export default function StockModal({
  product,
  mode,
  onClose,
}: {
  product: Product;
  mode: "add" | "remove";
  onClose(): void;
}) {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setLoading(true);
    try {
      if (mode === "add") {
        await warehouseApi.addStock(product.id, Number(amount));
        toast.success("Stock added");
      } else {
        await warehouseApi.removeStock(product.id, Number(amount));
        toast.success("Stock removed");
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data || "Operation failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">
        {mode === "add" ? "Add Stock" : "Remove Stock"} — {product.name}
      </h2>

      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
        placeholder="Enter quantity"
      />

      <div className="flex justify-end gap-2">
        <button onClick={onClose} className="btn-secondary">
          Cancel
        </button>
        <button
          onClick={submit}
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
        >
          {loading ? "Processing..." : "Confirm"}
        </button>
      </div>
    </div>
  );
}