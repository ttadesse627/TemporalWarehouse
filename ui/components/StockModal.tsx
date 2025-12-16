"use client";

import { useState, useEffect } from "react";
import { Product, warehouseApi } from "../lib/warehouseApi";
import toast from "react-hot-toast";
import { 
  Plus, 
  Minus, 
  Package, 
  ArrowLeft, 
  Check, 
  AlertCircle,
  Zap,
  TrendingUp,
  TrendingDown,
  Loader2,
  X,
  Calculator,
  ArrowRight
} from "lucide-react";

export default function StockModal({
  product,
  mode,
  onClose,
}: {
  product: Product;
  mode: "add" | "remove";
  onClose(): void;
}) {
  const [quantity, setQuantity] = useState("");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: quantity, 2: review
  const [quickOptions] = useState([5, 10, 25, 50, 100]);
  const [customReason, setCustomReason] = useState("");
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [notes, setNotes] = useState("");

  const reasons = {
    add: [
      { id: "restock", label: "Regular Restock", icon: "📦" },
      { id: "purchase", label: "New Purchase", icon: "🛒" },
      { id: "return", label: "Customer Return", icon: "↩️" },
      { id: "adjustment", label: "Stock Adjustment", icon: "📝" },
    ],
    remove: [
      { id: "sale", label: "Customer Sale", icon: "💰" },
      { id: "damage", label: "Damaged Goods", icon: "⚠️" },
      { id: "expired", label: "Expired Items", icon: "📅" },
      { id: "transfer", label: "Transfer Out", icon: "🚚" },
    ]
  };

  useEffect(() => {
    // Set default reason
    if (!selectedReason && reasons[mode].length > 0) {
      setSelectedReason(reasons[mode][0].id);
    }
  }, [mode]);

  const handleQuickSelect = (value: number) => {
    setQuantity(value.toString());
  };

  const handleQuantityChange = (value: string) => {
    const numValue = parseInt(value);
    if (value === "" || (!isNaN(numValue) && numValue > 0)) {
      setQuantity(value);
    }
  };

  const handleIncrement = () => {
    const current = parseInt(quantity) || 0;
    setQuantity((current + 1).toString());
  };

  const handleDecrement = () => {
    const current = parseInt(quantity) || 1;
    if (current > 1) {
      setQuantity((current - 1).toString());
    }
  };

  const validateStep1 = () => {
    const qty = parseInt(quantity);
    if (!qty || qty <= 0) {
      toast.error("Please enter a valid quantity");
      return false;
    }
    
    if (mode === "remove" && qty > product.currentQuantity) {
      toast.error(`Cannot remove more than ${product.currentQuantity} units (current stock)`);
      return false;
    }
    
    return true;
  };

  const proceedToReview = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const backToQuantity = () => {
    setStep(1);
  };

  const calculateNewStock = () => {
    const current = product.currentQuantity;
    const change = parseInt(quantity) || 0;
    return mode === "add" ? current + change : current - change;
  };

  async function submit() {
    if (!validateStep1()) return;
    
    setLoading(true);
    try {
      if (mode === "add") {
        await warehouseApi.addStock(product.id, Number(quantity));
        toast.success(`Successfully added ${quantity} units`);
      } else {
        await warehouseApi.removeStock(product.id, Number(quantity));
        toast.success(`Successfully removed ${quantity} units`);
      }
      onClose();
    } catch (err: any) {
      toast.error(err?.response?.data || "Operation failed");
    } finally {
      setLoading(false);
    }
  }

  const isAddMode = mode === "add";
  const currentStock = product.currentQuantity;
  const newStock = calculateNewStock();
  const changePercent = ((Math.abs(newStock - currentStock) / currentStock) * 100).toFixed(1);

  return (
    <div className="w-full max-w-lg">
      {/* Header */}
      <div className="mb-6 pb-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-xl ${isAddMode ? 'bg-green-100' : 'bg-orange-100'}`}>
              {isAddMode ? (
                <Plus className="h-6 w-6 text-green-600" />
              ) : (
                <Minus className="h-6 w-6 text-orange-600" />
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">
                {isAddMode ? "Add Stock" : "Remove Stock"}
              </h2>
              <div className="flex items-center gap-2 text-gray-600">
                <Package className="h-4 w-4" />
                <span>{product.name}</span>
                <span className="text-gr  ay-400">•</span>
                <span className="font-medium">SKU: {product.sku}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between mb-8 relative">
        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -translate-y-1/2 -z-10"></div>
        <div className="absolute top-1/2 left-0 h-0.5 bg-linear-to-r from-blue-500 to-purple-500 -translate-y-1/2 -z-10"
             style={{ width: step === 1 ? '0%' : '50%' }}></div>
        
        <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            step >= 1 ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow-md' : 'bg-gray-200'
          }`}>
            1
          </div>
          <span className="text-sm font-medium">Quantity</span>
        </div>
        
        <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
            step >= 2 ? 'bg-linear-to-r from-purple-500 to-purple-600 text-white shadow-md' : 'bg-gray-200'
          }`}>
            2
          </div>
          <span className="text-sm font-medium">Review</span>
        </div>
      </div>

      {/* Step 1: Quantity Selection */}
      {step === 1 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Current Stock Display */}
          <div className="p-4 bg-linear-to-r from-gray-50 to-white rounded-xl border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Current Stock</div>
                <div className="text-3xl font-bold text-gray-800">{currentStock}</div>
                <div className="text-sm text-gray-500">units available</div>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-600 mb-1">After {isAddMode ? 'Addition' : 'Removal'}</div>
                <div className="text-3xl font-bold text-gray-800">
                  {quantity ? newStock : currentStock}
                </div>
                <div className="text-sm text-gray-500">
                  {quantity ? `${isAddMode ? '+' : '-'}${quantity} units` : 'No change'}
                </div>
              </div>
            </div>
          </div>

          {/* Quantity Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Enter Quantity to {isAddMode ? 'Add' : 'Remove'}
            </label>
            
            {/* Quick Select Buttons */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Quick Select</div>
              <div className="flex flex-wrap gap-2">
                {quickOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => handleQuickSelect(option)}
                    className={`px-4 py-2 rounded-lg transition-all ${
                      quantity === option.toString()
                        ? 'bg-linear-to-r from-blue-500 to-blue-600 text-white shadow'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {option} units
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Input */}
            <div className="mb-4">
              <div className="text-sm text-gray-600 mb-2">Custom Quantity</div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleDecrement}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                  disabled={parseInt(quantity) <= 1}
                >
                  <Minus className="h-5 w-5 text-gray-600" />
                </button>
                
                <div className="relative flex-1">
                  <input
                    type="number"
                    min="1"
                    max={mode === "remove" ? product.currentQuantity : undefined}
                    value={quantity}
                    onChange={(e) => handleQuantityChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-2xl font-bold"
                    placeholder="0"
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
                    units
                  </div>
                </div>
                
                <button
                  onClick={handleIncrement}
                  className="p-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                >
                  <Plus className="h-5 w-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Validation Message */}
            {mode === "remove" && quantity && parseInt(quantity) > product.currentQuantity && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div className="text-sm text-red-700">
                  Cannot remove more than {product.currentQuantity} units (current stock)
                </div>
              </div>
            )}
          </div>

          {/* Next Button */}
          <button
            onClick={proceedToReview}
            disabled={!quantity || parseInt(quantity) <= 0}
            className="w-full flex items-center justify-center gap-2 py-3 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
          >
            Continue to Review
            <ArrowRight className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Step 2: Review & Reason */}
      {step === 2 && (
        <div className="space-y-6 animate-fadeIn">
          {/* Summary Card */}
          <div className="p-5 bg-linear-to-br from-gray-50 to-white rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-medium text-gray-700 mb-4">Transaction Summary</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-500 mb-1">Current Stock</div>
                <div className="text-2xl font-bold text-gray-800">{currentStock}</div>
              </div>
              <div className="p-3 bg-white rounded-lg border">
                <div className="text-sm text-gray-500 mb-1">Quantity</div>
                <div className="text-2xl font-bold text-gray-800">{quantity}</div>
              </div>
            </div>

            <div className="p-4 bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
              <div className="flex items-center justify-between mb-2">
                <div className="text-sm font-medium text-gray-700">New Stock Level</div>
                <div className={`flex items-center gap-1 ${
                  isAddMode ? 'text-green-600' : 'text-orange-600'
                }`}>
                  {isAddMode ? (
                    <>
                      <TrendingUp className="h-4 w-4" />
                      <span className="text-sm">+{changePercent}%</span>
                    </>
                  ) : (
                    <>
                      <TrendingDown className="h-4 w-4" />
                      <span className="text-sm">-{changePercent}%</span>
                    </>
                  )}
                </div>
              </div>
              <div className="flex items-center justify-between">
                <div className="text-3xl font-bold text-gray-800">{newStock}</div>
                <div className="px-3 py-1 bg-white rounded-full border border-blue-200">
                  <span className="text-sm font-medium text-blue-600">
                    {isAddMode ? 'INCREASE' : 'DECREASE'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Reason Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Reason
            </label>
            <div className="grid grid-cols-2 gap-3">
              {reasons[mode].map((reason) => (
                <button
                  key={reason.id}
                  onClick={() => setSelectedReason(reason.id)}
                  className={`p-4 rounded-xl border transition-all text-left ${
                    selectedReason === reason.id
                      ? 'border-blue-500 bg-blue-50 shadow-sm'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="text-2xl">{reason.icon}</div>
                    <div>
                      <div className="font-medium text-gray-800">{reason.label}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {selectedReason === reason.id ? "Selected" : "Click to select"}
                      </div>
                    </div>
                    {selectedReason === reason.id && (
                      <div className="ml-auto">
                        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                          <Check className="h-4 w-4 text-white" />
                        </div>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes (Optional)
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Add any notes about this transaction..."
              rows={3}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={backToQuantity}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 hover:border-gray-400 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button
              onClick={submit}
              disabled={loading || !selectedReason}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-linear-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-5 w-5" />
                  Confirm {isAddMode ? 'Addition' : 'Removal'}
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Info Footer */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-start gap-2 text-sm text-gray-600">
          <AlertCircle className="h-4 w-4 text-gray-400 mt-0.5" />
          <div>
            <p className="font-medium mb-1">Important</p>
            <p>
              {isAddMode 
                ? "Adding stock will increase inventory levels. This action is logged and cannot be undone automatically."
                : "Removing stock decreases inventory. Ensure this is intentional as it affects available stock for sales."
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}