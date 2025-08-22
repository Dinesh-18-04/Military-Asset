import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function AssignmentsExpenditures() {
  const [assignForm, setAssignForm] = useState({ base: '', equipment: '', personnel: '', quantity: '', assignmentDate: '' });
  const [expForm, setExpForm] = useState({ base: '', equipment: '', quantity: '', expenditureDate: '', reason: '' });
  const [assignments, setAssignments] = useState([]);
  const [expenditures, setExpenditures] = useState([]);
  const [bases, setBases] = useState([]);
  const [equipmentList, setEquipmentList] = useState([]);
  const [isLoadingAssign, setIsLoadingAssign] = useState(false);
  const [isLoadingExp, setIsLoadingExp] = useState(false);
  const token = localStorage.getItem('token');
  const userBase = localStorage.getItem('base');
  const userRole = localStorage.getItem('role');

  useEffect(() => {
    async function loadOptions() {
      if (!token) return;
      const [resBases, resEquip] = await Promise.all([
        fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      if (resBases.ok) setBases(await resBases.json());
      if (resEquip.ok) setEquipmentList(await resEquip.json());
    }
    loadOptions();
  }, [token]);

  useEffect(() => {
    loadAssignments();
    loadExpenditures();
  }, []);

  async function loadAssignments() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/assignments`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setAssignments(await res.json());
  }

  async function loadExpenditures() {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/expenditures`, { headers: { Authorization: `Bearer ${token}` } });
    if (res.ok) setExpenditures(await res.json());
  }

  async function handleAssignSubmit(e) {
    e.preventDefault();
    setIsLoadingAssign(true);
    const token = localStorage.getItem('token');
    let baseToSend = assignForm.base;
    if (userRole !== 'Admin') baseToSend = userBase || assignForm.base;
    const body = { ...assignForm, quantity: Number(assignForm.quantity), base: baseToSend };
    const res = await fetch(`${API_BASE_URL}/assignments`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setAssignForm({ base: userRole !== 'Admin' ? userBase || '' : '', equipment: '', personnel: '', quantity: '', assignmentDate: '' });
      loadAssignments();
    } else alert('Failed to record assignment');
    setIsLoadingAssign(false);
  }

  async function handleExpSubmit(e) {
    e.preventDefault();
    setIsLoadingExp(true);
    const token = localStorage.getItem('token');
    let baseToSend = expForm.base;
    if (userRole !== 'Admin') baseToSend = userBase || expForm.base;
    const body = { ...expForm, quantity: Number(expForm.quantity), base: baseToSend };
    const res = await fetch(`${API_BASE_URL}/expenditures`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      setExpForm({ base: userRole !== 'Admin' ? userBase || '' : '', equipment: '', quantity: '', expenditureDate: '', reason: '' });
      loadExpenditures();
    } else alert('Failed to record expenditure');
    setIsLoadingExp(false);
  }

  function onAssignChange(e) {
    setAssignForm({ ...assignForm, [e.target.name]: e.target.value });
  }

  function onExpChange(e) {
    setExpForm({ ...expForm, [e.target.name]: e.target.value });
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">📋 Assignments & Expenditures</h1>
          <p className="text-gray-600">Manage asset assignments and track expenditures</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Assignment Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-green-700 mb-6 flex items-center">
              <span className="mr-2">✅</span>
              Asset Assignment
            </h2>
            
            <form onSubmit={handleAssignSubmit} className="space-y-4 mb-8">
              {userRole === 'Admin' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <select
                    name="base"
                    value={assignForm.base}
                    onChange={onAssignChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  >
                    <option value="">Select Base</option>
                    {bases.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <input
                    type="text"
                    name="base"
                    value={userBase || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                    placeholder="Base (fixed)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                <select
                  name="equipment"
                  value={assignForm.equipment}
                  onChange={onAssignChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
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
                <label className="block text-sm font-medium text-gray-700 mb-2">Personnel</label>
                <input
                  name="personnel"
                  value={assignForm.personnel}
                  onChange={onAssignChange}
                  placeholder="Enter personnel name"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                <input
                  name="quantity"
                  type="number"
                  value={assignForm.quantity}
                  onChange={onAssignChange}
                  placeholder="Enter quantity"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  min={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Assignment Date</label>
                <input
                  name="assignmentDate"
                  type="date"
                  value={assignForm.assignmentDate}
                  onChange={onAssignChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingAssign}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-green-700 focus:ring-4 focus:ring-green-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoadingAssign ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Recording...</span>
                  </div>
                ) : (
                  'Record Assignment'
                )}
              </button>
            </form>

            {/* Assignment History */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Assignment History ({assignments.length})</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {assignments.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-3xl mb-2">📋</div>
                  <p>No assignments recorded yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {assignments.map((a) => (
                    <div key={a._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{a.equipment}</p>
                          <p className="text-sm text-gray-600">Assigned to: {a.personnel}</p>
                          <p className="text-sm text-gray-600">Base: {a.base}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                            Qty: {a.quantity}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{a.assignmentDate?.slice(0, 10)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Expenditure Section */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold text-red-700 mb-6 flex items-center">
              <span className="mr-2">📉</span>
              Asset Expenditure
            </h2>
            
            <form onSubmit={handleExpSubmit} className="space-y-4 mb-8">
              {userRole === 'Admin' ? (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <select
                    name="base"
                    value={expForm.base}
                    onChange={onExpChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  >
                    <option value="">Select Base</option>
                    {bases.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
              ) : (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <input
                    type="text"
                    name="base"
                    value={userBase || ''}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed text-gray-600"
                    placeholder="Base (fixed)"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
                <select
                  name="equipment"
                  value={expForm.equipment}
                  onChange={onExpChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
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
                  value={expForm.quantity}
                  onChange={onExpChange}
                  placeholder="Enter quantity"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                  min={1}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Expenditure Date</label>
                <input
                  name="expenditureDate"
                  type="date"
                  value={expForm.expenditureDate}
                  onChange={onExpChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Reason</label>
                <input
                  name="reason"
                  value={expForm.reason}
                  onChange={onExpChange}
                  placeholder="Enter reason for expenditure"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoadingExp}
                className="w-full bg-red-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-red-700 focus:ring-4 focus:ring-red-500/30 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoadingExp ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Recording...</span>
                  </div>
                ) : (
                  'Record Expenditure'
                )}
              </button>
            </form>

            {/* Expenditure History */}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenditure History ({expenditures.length})</h3>
            <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-lg">
              {expenditures.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-3xl mb-2">📉</div>
                  <p>No expenditures recorded yet</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {expenditures.map((e) => (
                    <div key={e._id} className="p-4 hover:bg-gray-50">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{e.equipment}</p>
                          <p className="text-sm text-gray-600">Reason: {e.reason}</p>
                          <p className="text-sm text-gray-600">Base: {e.base}</p>
                        </div>
                        <div className="text-right">
                          <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
                            Qty: {e.quantity}
                          </span>
                          <p className="text-sm text-gray-500 mt-1">{e.expenditureDate?.slice(0, 10)}</p>
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
    </div>
  );
}
