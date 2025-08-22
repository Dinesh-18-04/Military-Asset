import { useState, useEffect } from 'react';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function ResourceManagement() {
  const [tab, setTab] = useState('users');
  const [users, setUsers] = useState([]);
  const [equipment, setEquipment] = useState([]);
  const [bases, setBases] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [userForm, setUserForm] = useState({ username: '', password: '', role: 'Commander', base: '' });
  const [equipmentForm, setEquipmentForm] = useState({ name: '', type: '', price: '' });
  const [baseForm, setBaseForm] = useState({ name: '', location: '' });

  const token = localStorage.getItem('token');

  useEffect(() => {
    async function loadAll() {
      const resUsers = await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } });
      if (resUsers.ok) setUsers(await resUsers.json());
      const resEquip = await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } });
      if (resEquip.ok) setEquipment(await resEquip.json());
      const resBases = await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } });
      if (resBases.ok) setBases(await resBases.json());
    }
    loadAll();
  }, [token]);

  function handleUserChange(e) { setUserForm({ ...userForm, [e.target.name]: e.target.value }); }
  function handleEquipmentChange(e) { setEquipmentForm({ ...equipmentForm, [e.target.name]: e.target.value }); }
  function handleBaseChange(e) { setBaseForm({ ...baseForm, [e.target.name]: e.target.value }); }

  async function addUser(e) {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${API_BASE_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(userForm)
    });
    if (res.ok) {
      setUsers(await (await fetch(`${API_BASE_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setUserForm({ username: '', password: '', role: 'Commander', base: '' });
    } else {
      alert('Error creating user');
    }
    setIsLoading(false);
  }

  async function addEquipment(e) {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${API_BASE_URL}/equipments`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...equipmentForm, price: Number(equipmentForm.price) })
    });
    if (res.ok) {
      setEquipment(await (await fetch(`${API_BASE_URL}/equipments`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setEquipmentForm({ name: '', type: '', price: '' });
    } else {
      alert('Error adding equipment');
    }
    setIsLoading(false);
  }

  async function addBase(e) {
    e.preventDefault();
    setIsLoading(true);
    const res = await fetch(`${API_BASE_URL}/bases`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(baseForm)
    });
    if (res.ok) {
      setBases(await (await fetch(`${API_BASE_URL}/bases`, { headers: { Authorization: `Bearer ${token}` } })).json());
      setBaseForm({ name: '', location: '' });
    } else {
      alert('Error adding base');
    }
    setIsLoading(false);
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'Admin': return 'bg-red-100 text-red-800';
      case 'Commander': return 'bg-purple-100 text-purple-800';
      case 'Logistics': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const TabButton = ({ label, t, icon }) => (
    <button
      className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center space-x-2 ${
        tab === t 
          ? 'bg-emerald-600 text-white shadow-md transform scale-105' 
          : 'bg-white text-gray-700 hover:bg-emerald-50 border border-gray-200'
      }`}
      onClick={() => setTab(t)}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">⚙️ Resource Management</h1>
          <p className="text-gray-600">Manage users, equipment, and military bases</p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center space-x-4 mb-8">
          <TabButton label="Users" t="users" icon="👥" />
          <TabButton label="Equipment" t="equipment" icon="🔧" />
          <TabButton label="Bases" t="bases" icon="🏭" />
        </div>

        {/* Users Tab */}
        {tab === 'users' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">👤</span>
                Add New User
              </h2>
              
              <form onSubmit={addUser} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={userForm.username}
                    onChange={handleUserChange}
                    placeholder="Enter username"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={userForm.password}
                    onChange={handleUserChange}
                    placeholder="Enter password"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                  <select
                    name="role"
                    value={userForm.role}
                    onChange={handleUserChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                    required
                  >
                    <option value="Admin">Admin</option>
                    <option value="Commander">Commander</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Base</label>
                  <input
                    type="text"
                    name="base"
                    value={userForm.base}
                    onChange={handleUserChange}
                    placeholder="Enter base name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-70 transition-all"
                  >
                    {isLoading ? '⏳ Adding User...' : '+ Add User'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Users List ({users.length})</h3>
              <div className="grid gap-3">
                {users.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">👥</div>
                    <p>No users added yet</p>
                  </div>
                ) : (
                  users.map((u, i) => (
                    <div key={u._id || i} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                          <span className="text-emerald-600 font-medium">{u.username?.charAt(0)?.toUpperCase()}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{u.username}</p>
                          <p className="text-sm text-gray-600">{u.base}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getRoleColor(u.role)}`}>
                        {u.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Equipment Tab */}
        {tab === 'equipment' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🔧</span>
                Add New Equipment
              </h2>
              
              <form onSubmit={addEquipment} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={equipmentForm.name}
                    onChange={handleEquipmentChange}
                    placeholder="Equipment name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <input
                    type="text"
                    name="type"
                    value={equipmentForm.type}
                    onChange={handleEquipmentChange}
                    placeholder="Equipment type"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                  <input
                    type="number"
                    name="price"
                    value={equipmentForm.price}
                    onChange={handleEquipmentChange}
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div className="md:col-span-3">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-70 transition-all"
                  >
                    {isLoading ? '⏳ Adding Equipment...' : '+ Add Equipment'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Equipment List ({equipment.length})</h3>
              <div className="grid gap-3">
                {equipment.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🔧</div>
                    <p>No equipment added yet</p>
                  </div>
                ) : (
                  equipment.map((eq, i) => (
                    <div key={eq._id || i} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-800">{eq.name}</p>
                        <p className="text-sm text-gray-600">Type: {eq.type}</p>
                      </div>
                      <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                        ₹{eq.price?.toLocaleString()}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}

        {/* Bases Tab */}
        {tab === 'bases' && (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                <span className="mr-2">🏭</span>
                Add New Base
              </h2>
              
              <form onSubmit={addBase} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={baseForm.name}
                    onChange={handleBaseChange}
                    placeholder="Base name"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={baseForm.location}
                    onChange={handleBaseChange}
                    placeholder="Base location"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none transition"
                  />
                </div>

                <div className="md:col-span-2">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-70 transition-all"
                  >
                    {isLoading ? '⏳ Adding Base...' : '+ Add Base'}
                  </button>
                </div>
              </form>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Bases List ({bases.length})</h3>
              <div className="grid gap-3">
                {bases.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <div className="text-4xl mb-2">🏭</div>
                    <p>No bases added yet</p>
                  </div>
                ) : (
                  bases.map((b, i) => (
                    <div key={b._id || i} className="bg-gray-50 p-4 rounded-lg flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 text-lg">🏭</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{b.name}</p>
                          <p className="text-sm text-gray-600">📍 {b.location}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
