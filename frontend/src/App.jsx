import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ProtectedRoute from "./components/ProtectedRoute";
import CartSidebar from "./components/CartSidebar";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import AdminDashboard from "./pages/AdminDashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProductDetails from "./pages/ProductDetails";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";


function App() {
    return (
        <BrowserRouter>
            <>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout><Home /></Layout>
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/products/:id" element={<Layout><ProductDetails /></Layout>} />
                    <Route path="/shop" element={<Layout><Shop /></Layout>} />
                    <Route path="/cart" element={<Layout><Cart /></Layout>} />
                </Routes>

                <CartSidebar />

                <ToastContainer
                    position="top-right"
                    autoClose={2000}
                    closeOnClick
                    pauseOnHover
                    draggable
                    theme="light"
                />
            </>
        </BrowserRouter>
    );
}

export default App;