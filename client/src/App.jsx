import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Purchases from './pages/Purchases.jsx';
import Transfers from './pages/Transfers.jsx';
import AssignmentsExpenditures from './pages/AssignmentsExpenditures.jsx';
import AuditLog from './pages/AuditLog.jsx';
import ResourceManagement from './pages/ResourceManagement.jsx';
import Navbar from './components/Navbar.jsx';

const RequireAuth = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

export default function App() {
  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth>} />
        <Route path="/purchases" element={<RequireAuth><Purchases /></RequireAuth>} />
        <Route path="/transfers" element={<RequireAuth><Transfers /></RequireAuth>} />
        <Route path="/assignments" element={<RequireAuth><AssignmentsExpenditures /></RequireAuth>} />
        <Route path="/auditlog" element={<RequireAuth><AuditLog /></RequireAuth>} />
        <Route path="/resource-management" element={<RequireAuth><ResourceManagement /></RequireAuth>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
