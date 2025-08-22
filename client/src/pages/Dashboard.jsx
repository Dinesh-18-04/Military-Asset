import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Dashboard() {
  const [filters, setFilters] = useState({ base: '', equipment: '', fromDate: '', toDate: '' });
  const [metrics, setMetrics] = useState({});
  const [equipmentList, setEquipmentList] = useState([]);
  const [baseName, setBaseName] = useState('');
  const [submittedFilters, setSubmittedFilters] = useState(null);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base');

  useEffect(() => {
    async function loadEquipment() {
      if (!token) return;
      const resEquipment = await fetch(`${API_BASE_URL}/equipments`, { 
        headers: { Authorization: `Bearer ${token}` } 
      });
      if (resEquipment.ok) setEquipmentList(await resEquipment.json());
    }
    loadEquipment();
  }, [token]);

  useEffect(() => {
    async function fetchBaseName() {
      if (userBase && token) {
        const res = await fetch(`${API_BASE_URL}/bases/${userBase}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const base = await res.json();
          setBaseName(base.name);
          setFilters(f => ({ ...f, base: userBase }));
        }
      }
    }
    fetchBaseName();
  }, [userBase, token]);

  useEffect(() => {
    async function loadMetrics() {
      if (!token || !submittedFilters) return;
      const qs = new URLSearchParams(submittedFilters).toString();
      const res = await fetch(`${API_BASE_URL}/dashboard?${qs}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setMetrics(data);
      } else {
        setMetrics({});
      }
    }
    loadMetrics();
  }, [submittedFilters, token]);

  function onClickNetMovement() {
    alert(
      `Purchases: ${metrics.purchases || 0}\nTransfers In: ${metrics.transfersIn || 0}\nTransfers Out: ${metrics.transfersOut || 0}`
    );
  }

  function onFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function onSubmit(e) {
    e.preventDefault();
    setSubmittedFilters({ ...filters, base: userBase || filters.base });
  }

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen">
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">📊 Dashboard</h1>
      
      {/* Filter Form */}
      <div className="bg-white p-6 rounded-lg shadow-md mb-8">
        <form onSubmit={onSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="date"
            name="fromDate"
            value={filters.fromDate}
            onChange={onFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="date"
            name="toDate"
            value={filters.toDate}
            onChange={onFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            name="base"
            value={baseName}
            readOnly
            className="px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
            placeholder="Base (fixed)"
          />
          <select
            name="equipment"
            value={filters.equipment}
            onChange={onFilterChange}
            className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          >
            <option value="">Select Equipment</option>
            {equipmentList.map((eq) => (
              <option key={eq._id} value={eq._id}>
                {eq.name}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            Apply Filters
          </button>
        </form>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">📊</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Opening Balance</h3>
          <p className="text-3xl font-bold text-blue-600">{metrics.openingBalance || 0}</p>
        </div>

        <div 
          onClick={onClickNetMovement}
          className="bg-white p-6 rounded-lg shadow-md text-center cursor-pointer hover:shadow-lg transition"
        >
          <div className="text-2xl mb-2">🔄</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Net Movement</h3>
          <p className="text-3xl font-bold text-green-600">{metrics.netMovement || 0}</p>
          <small className="text-gray-500">Click for details</small>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">💰</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Closing Balance</h3>
          <p className="text-3xl font-bold text-purple-600">{metrics.closingBalance || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">📋</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Assigned</h3>
          <p className="text-3xl font-bold text-orange-600">{metrics.assignments || 0}</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <div className="text-2xl mb-2">📉</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Expended</h3>
          <p className="text-3xl font-bold text-red-600">{metrics.expended || 0}</p>
        </div>
      </div>
    </div>
  );
}
