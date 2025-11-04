import { Routes, Route, Navigate } from 'react-router-dom'
import AuthLayout from './layouts/AuthLayout.jsx'
import DashboardLayout from './layouts/DashboardLayout.jsx'
import { PrivateRoute, PublicOnly, RoleRoute } from './router/guards.jsx'
import Login from './pages/auth/Login.jsx'
import Register from './pages/auth/Register.jsx'
import Forgot from './pages/auth/Forgot.jsx'
import Reset from './pages/auth/Reset.jsx'
import Home from './pages/dashboard/Home.jsx'
import Cars from './pages/dashboard/Cars.jsx'
import Rentals from './pages/dashboard/Rentals.jsx'
import Profile from './pages/dashboard/Profile.jsx'

function App() {
  return (
    <Routes>
      <Route element={<PublicOnly />}> 
        <Route path="/auth" element={<AuthLayout> <Login /> </AuthLayout>} />
        <Route path="/auth/login" element={<AuthLayout> <Login /> </AuthLayout>} />
        <Route path="/auth/register" element={<AuthLayout> <Register /> </AuthLayout>} />
        <Route path="/auth/forgot" element={<AuthLayout> <Forgot /> </AuthLayout>} />
        <Route path="/auth/reset" element={<AuthLayout> <Reset /> </AuthLayout>} />
      </Route>

      <Route element={<PrivateRoute />}> 
        <Route element={<DashboardLayout />}> 
          <Route path="/dashboard" element={<Home />} />
          <Route path="/dashboard/cars" element={<Cars />} />
          {/* Rentals solo para admin */}
          <Route element={<RoleRoute allow={["admin"]} />}> 
            <Route path="/dashboard/rentals" element={<Rentals />} />
          </Route>
          <Route path="/dashboard/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  )
}

export default App
