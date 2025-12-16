"use client";

import { useState, useEffect } from "react";
import { Product, warehouseApi } from "../lib/warehouseApi";
import toast from "react-hot-toast";
import { 
  History, 
  Calendar, 
  Clock, 
  TrendingUp, 
  X, 
  Search, 
  Package,
  Loader2
} from "lucide-react";

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
  const [loading, setLoading] = useState(false);
  const [recentDates, setRecentDates] = useState<Date[]>([
    new Date(now.getTime() - 24 * 60 * 60 * 1000), // 1 day ago
    new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000), // 1 week ago
    new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000), // 1 month ago
  ]);

  async function submit() {
    setLoading(true);
    try {
      // Parse the local datetime input as local time
      const localDate = new Date(at);
      // Convert to UTC ISO string before sending to backend
      const utcIso = new Date(
        localDate.getTime() - localDate.getTimezoneOffset() * 60000
      ).toISOString();

      const data = await warehouseApi.getStockAt(product.id, utcIso);
      setResult(data.quantity);
      toast.success("Historical stock loaded");
    } catch {
      toast.error("Failed to load historical data");
    } finally {
      setLoading(false);
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <History className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Stock History</h2>
              <div className="flex items-center gap-2 mt-1">
                <Package className="h-4 w-4 text-gray-500" />
                <p className="text-gray-600">{product.name}</p>
                <span className="text-sm text-gray-500">•</span>
                <p className="text-sm text-gray-500 font-mono">{product.sku}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Current Stock Info */}
      <div className="mb-6 p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600 mb-1">Current Stock</p>
            <p className="text-3xl font-bold text-gray-800">{product.currentQuantity}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">As of now</p>
            <p className="text-sm text-gray-500">{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
        </div>
      </div>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Select Date & Time
          </div>
        </label>
        
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Clock className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="datetime-local"
            value={at}
            onChange={(e) => setAt(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
            max={new Date().toISOString().slice(0, 16)}
          />
        </div>
        
        {/* Quick Date Options */}
        <div className="mt-3">
          <p className="text-sm text-gray-600 mb-2">Quick select:</p>
          <div className="flex flex-wrap gap-2">
            {recentDates.map((date, index) => {
              const formatted = date.toISOString().slice(0, 16);
              const label = index === 0 ? "Yesterday" : index === 1 ? "Last Week" : "Last Month";
              return (
                <button
                  key={index}
                  onClick={() => setAt(formatted)}
                  className="px-3 py-1.5 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors border border-gray-200"
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={submit}
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-purple-600 to-purple-700 text-white rounded-lg hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg mb-6"
      >
        {loading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Loading History...
          </>
        ) : (
          <>
            <Search className="h-5 w-5" />
            Check Stock at Selected Time
          </>
        )}
      </button>

      {/* Results Section */}
      {result !== null && (
        <div className="mt-6 p-6 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Historical Stock Result</h3>
            <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">
              Past Record
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="p-4 bg-white rounded-lg border border-gray-100">
              <p className="text-sm text-gray-600 mb-1">Selected Date & Time</p>
              <p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-500" />
                {new Date(at).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            
            <div className="p-4 bg-linear-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Stock Quantity</p>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-4xl font-bold text-purple-700">{result}</p>
                  <p className="text-sm text-gray-600 mt-1">units in stock</p>
                </div>
                
                {/* Comparison Indicator */}
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {result > product.currentQuantity ? (
                      <>
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium text-green-600">
                          ↑ {(result - product.currentQuantity)} more than current
                        </span>
                      </>
                    ) : result < product.currentQuantity ? (
                      <>
                        <TrendingUp className="h-4 w-4 rotate-180 text-red-500" />
                        <span className="text-sm font-medium text-red-600">
                          ↓ {(product.currentQuantity - result)} less than current
                        </span>
                      </>
                    ) : (
                      <span className="text-sm font-medium text-gray-600">
                        Same as current stock
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Note */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          <strong>Note:</strong> Historical stock data shows the exact quantity available at the selected date and time. The system records stock changes with timestamps for accurate tracking.
        </p>
      </div>
    </div>
  );
}