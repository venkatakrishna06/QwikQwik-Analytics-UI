import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {Toaster} from 'sonner';
import {AuthProvider} from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/" element={
            <ProtectedRoute requiredRole="admin">
              <Layout>
                <Dashboard />
              </Layout>
            </ProtectedRoute>
          } />
          <Route path="*" element={<Login />} />
        </Routes>
        <Toaster 
          richColors 
          position="top-right"
          closeButton
          theme="system"
          duration={4000}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;
