import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Transfers() {
  const [form, setForm] = useState({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
  const [transfers, setTransfers] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');
  const userBase = localStorage.getItem('base');

  useEffect(() => {
    async function loadData() {
      const [resTransfers, resBases, resEquipment] = await Promise.all([
        fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resTransfers.ok) setTransfers(await resTransfers.json());
      if (resBases.ok) setBases(await resBases.json());
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadData();
  }, [token]);

  useEffect(() => {
    if (userRole === 'Logistics' && userBase) {
      const baseObj = bases.find((b) => b.name === userBase);
      if (baseObj) {
        setForm(f => ({ ...f, fromBase: baseObj._id, toBase: '' }));
      }
    } else if (userRole === 'Admin') {
      setForm(f => ({ ...f, fromBase: '', toBase: '' }));
    }
  }, [bases, userBase, userRole]);

  function onChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (form.fromBase === form.toBase) {
      alert('From Base and To Base cannot be the same.');
      return;
    }
    setIsLoading(true);
    const res = await fetch(`${API_BASE_URL}/transfers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, quantity: Number(form.quantity) }),
    });
    if (res.ok) {
      setForm({ fromBase: '', toBase: '', equipment: '', quantity: '', transferDate: '' });
      const updatedTransfers = await (await fetch(`${API_BASE_URL}/transfers`, { headers: { Authorization: `Bearer ${token}` } })).json();
      setTransfers(updatedTransfers);
    } else {
      alert('Failed to record transfer');
    }
    setIsLoading(false);
  }

  const baseOptionsFrom = userRole === 'Admin' ? bases : bases.filter(b => b.name === userBase);
  const baseOptionsTo = bases;

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">🔄 Record Transfer</h1>
          <p className="text-gray-600">Transfer equipment between military bases</p>
        </div>

        {/* Transfer Form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">New Transfer Entry</h2>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">From Base</label>
              <select
                name="fromBase"
                value={form.fromBase}
                onChange={onChange}
                className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition ${
                  userRole === 'Logistics' ? 'bg-gray-100 cursor-not-allowed' : ''
                }`}
                required
                disabled={userRole === 'Logistics'}
              >
                <option value="">Select From Base</option>
                {baseOptionsFrom.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">To Base</label>
              <select
                name="toBase"
                value={form.toBase}
                onChange={onChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
              >
                <option value="">Select To Base</option>
                {baseOptionsTo.map((b) => (
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                required
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
                min={1}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Transfer Date</label>
              <input
                name="transferDate"
                type="date"
                value={form.transferDate}
                onChange={onChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Recording Transfer...</span>
                  </div>
                ) : (
                  '↔️ Record Transfer'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Transfer History */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📋</span>
            Transfer History ({transfers.length})
          </h2>
          
          <div className="max-h-96 overflow-y-auto">
            {transfers.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <div className="text-6xl mb-4">🔄</div>
                <h3 className="text-lg font-medium mb-2">No Transfers Yet</h3>
                <p>Equipment transfers will appear here once recorded</p>
              </div>
            ) : (
              <div className="space-y-4">
                {transfers.map((t) => (
                  <div key={t._id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-2">
                          {t.equipment?.name || t.equipment}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                              From: {t.fromBase?.name || t.fromBase}
                            </span>
                            <span>→</span>
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                              To: {t.toBase?.name || t.toBase}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                          Qty: {t.quantity}
                        </div>
                        <p className="text-sm text-gray-500">
                          {t.transferDate?.slice(0, 10)}
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
    </div>
  );
}
