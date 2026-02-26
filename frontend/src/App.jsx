import React from "react";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import VehicleDetails from './pages/VehicleDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/AdminDashboard';
import AdminVehicles from './pages/AdminVehicles';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';

function App() {
    return (
        <Router>
            <div className="content">
                <Routes>
                    <Route path="/" element={<><Navbar /><Home /></>} />
                    <Route path="/vehicle/:id" element={<><Navbar /><VehicleDetails /></>} />
                    <Route path="/login" element={<><Navbar /><Login /></>} />
                    <Route path="/signup" element={<><Navbar /><Signup /></>} />
                    <Route path="/dashboard" element={<><Navbar /><Dashboard /></>} />

                    {/* Admin Routes with Layout */}
                    <Route path="/admin" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="vehicles" element={<AdminVehicles />} />
                        <Route path="bookings" element={<AdminBookings />} />
                        <Route path="users" element={<AdminUsers />} />
                    </Route>
                </Routes>
            </div>
        </Router>
    );
}

export default App;
