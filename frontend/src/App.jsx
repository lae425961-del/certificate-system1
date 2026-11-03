import { Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header'; import Landing from './pages/Landing'; import Login from './pages/Login'; import Admin from './pages/Admin'; import AdminAccounts from './pages/AdminAccounts';
const Private = ({ children }) => (localStorage.getItem('token') ? children : <Navigate to="/login" replace />);
export default function App() {
  return (<><Header /><Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login />} />
    <Route path="/admin" element={<Private><Admin /></Private>} /><Route path="/admin/accounts" element={<Private><AdminAccounts /></Private>} /><Route path="*" element={<Navigate to="/" />} />
  </Routes></>);
}
