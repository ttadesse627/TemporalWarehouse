"use client";

import React, { useState } from "react";
import { Product, warehouseApi } from "../lib/warehouseApi";
import toast from "react-hot-toast";

export default function StockHistory({
  product,
  onClose,
}: {
  product: Product;
  onClose(): void;
}) {
  const [at, setAt] = useState(new Date().toISOString().slice(0, 16));
  const [result, setResult] = useState<number | null>(null);

  async function submit() {
    try {
      const iso = new Date(at).toISOString();
      const data = await warehouseApi.getStockAt(product.id, iso);
      setResult(data.quantity);
      toast.success("History loaded");
    } catch {
      toast.error("Failed to load history");
    }
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Historical Stock — {product.name}</h2>

      <input
        type="datetime-local"
        value={at}
        onChange={(e) => setAt(e.target.value)}
        className="w-full border px-3 py-2 rounded-md"
      />

      <button
        onClick={submit}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Get Stock
      </button>

      {result !== null && (
        <div className="p-4 bg-gray-100 rounded-md border">
          <div className="text-sm">
            Stock at <strong>{new Date(at).toLocaleString()}</strong>:
          </div>
          <div className="text-2xl font-bold">{result}</div>
        </div>
      )}

      <button onClick={onClose} className="btn-secondary">
        Close
      </button>
    </div>
  );
}