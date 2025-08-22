import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Purchases() {
  const [form, setForm] = useState({ base: '', equipment: '', quantity: '', purchaseDate: '', supplier: '' });
  const [purchases, setPurchases] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    async function loadData() {
      const [resPurchases, resBases, resEquip] = await Promise.all([
        fetch(`${API_BASE_URL}/purchases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resPurchases.ok) setPurchases(await resPurchases.json());
      if (resBases.ok) setBases(await resBases.json());
      if (resEquip.ok) setEquipmentList(await resEquip.json());
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (userRole !== 'Admin' && userBase) {
      const baseObj = bases.find((b) => b._id === userBase);
      if (baseObj) setForm((f) => ({ ...f, base: baseObj._id }));
    } else if (userRole === 'Admin') {
      setForm((f) => ({ ...f, base: '' }));
    }
  }, [bases, userBase, userRole]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${API_BASE_URL}/purchases`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm((f) => ({ ...f, quantity: '', purchaseDate: '', supplier: '' }));
      const updatedPurchases = await (await fetch(`${API_BASE_URL}/purchases`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setPurchases(updatedPurchases);
    } else {
      alert('Failed to add purchase');
    }
    setIsLoading(false);
  }

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  return (
    <div className="max-w-5xl mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">🛒 Record Purchase</h1>
        <p className="text-gray-600">Add new equipment purchases to the system</p>
      </div>

      {/* Purchase Form */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">New Purchase Entry</h2>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
            <select
              name="base"
              value={form.base}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              disabled={userRole !== 'Admin' && !!userBase}
            >
              <option value="">Select Base</option>
              {bases.map((b) => (
                <option key={b._id} value={b._id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
            <select
              name="equipment"
              value={form.equipment}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            >
              <option value="">Select Equipment</option>
              {equipmentList.map((eq) => (
                <option key={eq._id} value={eq._id}>
                  {eq.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
            <input
              name="quantity"
              type="number"
              value={form.quantity}
              onChange={onChange}
              placeholder="Enter quantity"
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
              min={1}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Purchase Date</label>
            <input
              name="purchaseDate"
              type="date"
              value={form.purchaseDate}
              onChange={onChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">Supplier</label>
            <input
              name="supplier"
              value={form.supplier}
              onChange={onChange}
              placeholder="Enter supplier name (optional)"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition"
            />
          </div>

          <div className="md:col-span-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  <span>Adding Purchase...</span>
                </div>
              ) : (
                '+ Add Purchase'
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Purchase History */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">📋</span>
          Purchase History ({purchases.length})
        </h2>
        
        <div className="max-h-96 overflow-y-auto">
          {purchases.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <div className="text-4xl mb-4">📦</div>
              <p>No purchases recorded yet</p>
              <p className="text-sm">Add your first purchase using the form above</p>
            </div>
          ) : (
            <div className="space-y-3">
              {purchases.map((p) => (
                <div key={p._id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium text-gray-800">
                        {p.equipment?.name || p.equipment}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Base: {p.base?.name || p.base}
                      </p>
                      <p className="text-sm text-gray-600">
                        Supplier: {p.supplier || 'Not specified'}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full text-sm font-medium">
                        Qty: {p.quantity}
                      </div>
                      <p className="text-sm text-gray-500 mt-1">
                        {p.purchaseDate?.slice(0, 10)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
