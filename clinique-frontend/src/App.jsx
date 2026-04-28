import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import MedecinDashboard from './pages/dashboards/MedecinDashboard';
import InfirmierDashboard from './pages/dashboards/InfirmierDashboard';
import ReceptionDashboard from './pages/dashboards/ReceptionDashboard';
import CaissierDashboard from './pages/dashboards/CaissierDashboard';
import ComptableDashboard from './pages/dashboards/ComptableDashboard';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route path="/dashboard/admin" element={
            <ProtectedRoute roles={['admin']}><AdminDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/medecin" element={
            <ProtectedRoute roles={['medecin', 'admin']}><MedecinDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/infirmier" element={
            <ProtectedRoute roles={['infirmier', 'admin']}><InfirmierDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/reception" element={
            <ProtectedRoute roles={['receptionniste', 'admin']}><ReceptionDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/caissier" element={
            <ProtectedRoute roles={['caissier', 'admin']}><CaissierDashboard /></ProtectedRoute>
          } />
          <Route path="/dashboard/comptable" element={
            <ProtectedRoute roles={['comptable', 'admin']}><ComptableDashboard /></ProtectedRoute>
          } />

          <Route path="/unauthorized" element={<div>Accès non autorisé</div>} />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
