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
  const now = new Date();
  // Format to YYYY-MM-DDThh:mm for datetime-local input (local timezone)
  const localDateTime = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);

  const [at, setAt] = useState(localDateTime);
  const [result, setResult] = useState<number | null>(null);

  async function submit() {
    try {
      // Parse the local datetime input as local time
      const localDate = new Date(at);
      // Convert to UTC ISO string before sending to backend
      const utcIso = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      ).toISOString();

      const data = await warehouseApi.getStockAt(product.id, utcIso);
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
        max={new Date().toISOString().slice(0, 16)}
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
