import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Layout/Navbar";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Product from "./pages/Product";
import Profile from "./components/Home/Profile";
import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import ProtectedRoute from "./components/Admin/ProtectedRoute";

const UserLayout = () => {
  return (
    <>
      <Navbar />
      {/* Outlet renders the matched child route below the Navbar */}
      <Outlet /> 
    </>
  );
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<UserLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/product/:id" element={<Product />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/adminpage" element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;