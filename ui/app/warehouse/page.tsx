"use client";

type DashboardStats = {
  totalProducts: number;
  totalStockUnits: number;
  lowStockCount: number;
  outOfStockCount: number;
  todayAdjustments: number;
};

export default function WarehouseDashboard() {
  const stats: DashboardStats = {
    totalProducts: 120,
    totalStockUnits: 8450,
    lowStockCount: 8,
    outOfStockCount: 3,
    todayAdjustments: 42,
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8 text-gray-900">
      <h1 className="text-2xl sm:text-3xl font-bold">Temporal Warehouse Dashboard</h1>

      {/* ===== Summary Cards ===== */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <DashboardCard title="Total Products" value={stats.totalProducts} />
        <DashboardCard title="Total Stock Units" value={stats.totalStockUnits} />
        <DashboardCard title="Low Stock" value={stats.lowStockCount} />
        <DashboardCard title="Out of Stock" value={stats.outOfStockCount} />
        <DashboardCard title="Today Adjustments" value={stats.todayAdjustments} />
      </div>

      {/* ===== Alerts Section ===== */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-red-700">
          ⚠ Low Stock Alerts
        </h2>
        <ul className="space-y-2">
          <li className="flex justify-between">
            <span>Product A (SKU-001)</span>
            <span className="font-semibold text-red-600">3 left</span>
          </li>
          <li className="flex justify-between">
            <span>Product B (SKU-009)</span>
            <span className="font-semibold text-red-600">1 left</span>
          </li>
        </ul>
      </div>

      {/* ===== Recent Activity ===== */}
      <div className="bg-white shadow rounded-xl p-6 overflow-x-auto">
        <h2 className="text-xl font-semibold mb-4">
          Recent Stock Activity
        </h2>

        <table className="w-full min-w-[640px] text-left border-collapse">
          <thead>
            <tr className="border-b text-gray-600">
              <th className="py-2">Product</th>
              <th>Type</th>
              <th>Quantity</th>
              <th>New Total</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b">
              <td className="py-2">Product A</td>
              <td className="text-green-600 font-medium">Add</td>
              <td>+10</td>
              <td>120</td>
              <td>2026-02-12 08:30</td>
            </tr>
            <tr className="border-b">
              <td className="py-2">Product B</td>
              <td className="text-red-600 font-medium">Remove</td>
              <td>-5</td>
              <td>15</td>
              <td>2026-02-12 07:45</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ===== Quick Actions ===== */}
      <div className="flex flex-wrap gap-4">
        <ActionButton label="Add Product" />
        <ActionButton label="Add Stock" />
        <ActionButton label="Remove Stock" />
        <ActionButton label="View Historical Snapshot" />
      </div>
    </div>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white shadow rounded-xl p-5">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}

function ActionButton({ label }: { label: string }) {
  return (
    <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition">
      {label}
    </button>
  );
}
