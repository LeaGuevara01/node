import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store/store';
import Layout from './components/common/Layout';
import Dashboard from './pages/Dashboard';
import MachineList from './pages/machines/MachineList';
import MachineDetails from './pages/machines/MachineDetails';
import RepairOrderList from './pages/repairs/RepairOrderList';
import RepairOrderForm from './pages/repairs/RepairOrderForm';
import InventoryDashboard from './pages/inventory/InventoryDashboard';
import SupplierList from './pages/suppliers/SupplierList';
import PurchaseOrderList from './pages/purchases/PurchaseOrderList';
import './App.css';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/machines" element={<MachineList />} />
            <Route path="/machines/:id" element={<MachineDetails />} />
            <Route path="/repairs" element={<RepairOrderList />} />
            <Route path="/repairs/new" element={<RepairOrderForm />} />
            <Route path="/repairs/:id" element={<RepairOrderForm />} />
            <Route path="/inventory" element={<InventoryDashboard />} />
            <Route path="/suppliers" element={<SupplierList />} />
            <Route path="/purchase-orders" element={<PurchaseOrderList />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
