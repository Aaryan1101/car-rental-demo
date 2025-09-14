import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import Cars from '../pages/Cars';
import CarDetails from '../pages/CarDetails';
import MyBookings from '../pages/MyBookings';
import OwnerLayout from '../pages/owner/Layout';
import AddCar from '../pages/owner/AddCar';
import Dashboard from '../pages/owner/Dashboard';
import ManageBookings from '../pages/owner/ManageBookings';
import ManageCars from '../pages/owner/ManageCars';
import ProtectedRoute from '../components/ProtectedRoute';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/cars" element={<Cars />} />
      <Route path="/car/:id" element={<CarDetails />} />
      
      {/* Protected User Routes */}
      <Route path="/my-bookings" element={
        <ProtectedRoute>
          <MyBookings />
        </ProtectedRoute>
      } />

      {/* Protected Owner Routes */}
      <Route path="/owner" element={
        <ProtectedRoute ownerRequired>
          <OwnerLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="add-car" element={<AddCar />} />
        <Route path="manage-cars" element={<ManageCars />} />
        <Route path="manage-bookings" element={<ManageBookings />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;