import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import OtpLogin from './pages/OtpLogin';
import Dashboard from './pages/Dashboard';
import Layout from './components/Layout';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Brands from './pages/Brands';
import Categories from './pages/Categories';
import Stores from './pages/Stores';
import Income from './pages/Income';
import Expense from './pages/Expense';
import Sales from './pages/Sales';
import Purchases from './pages/Purchases';
import FileUpload from './pages/FileUpload';

function App() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/otp-login" element={<OtpLogin />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        ) : (
          <>
            <Route
              element={
                <Layout>
                  <Dashboard />
                </Layout>
              }
              path="/"
            />
            <Route
              element={
                <Layout>
                  <Products />
                </Layout>
              }
              path="/products"
            />
            <Route
              element={
                <Layout>
                  <Orders />
                </Layout>
              }
              path="/orders"
            />
            <Route
              element={
                <Layout>
                  <Brands />
                </Layout>
              }
              path="/brands"
            />
            <Route
              element={
                <Layout>
                  <Categories />
                </Layout>
              }
              path="/categories"
            />
            <Route
              element={
                <Layout>
                  <Stores />
                </Layout>
              }
              path="/stores"
            />
            <Route
              element={
                <Layout>
                  <Income />
                </Layout>
              }
              path="/transactions/income"
            />
            <Route
              element={
                <Layout>
                  <Expense />
                </Layout>
              }
              path="/transactions/expense"
            />
            <Route
              element={
                <Layout>
                  <Sales />
                </Layout>
              }
              path="/transactions/sales"
            />
            <Route
              element={
                <Layout>
                  <Purchases />
                </Layout>
              }
              path="/transactions/purchases"
            />
            <Route
              element={
                <Layout>
                  <FileUpload />
                </Layout>
              }
              path="/upload"
            />
            <Route path="*" element={<Navigate to="/" />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

export default App;
