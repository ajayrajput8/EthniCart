import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import Navbar from "./components/Layout/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";

import Profile from "./components/Home/Profile";

import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./components/Admin/ProtectedRoute";

import UserProtectedRoute from "./components/Auth/ProtectedRoute";


const UserLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
};


function App() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ================= USER ROUTES ================= */}

        <Route element={<UserLayout />}>

          {/* Public */}
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />

          <Route path="/register" element={<Register />} />


          {/* Protected */}

          <Route
            path="/shop"
            element={
              <UserProtectedRoute>
                <Shop />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <UserProtectedRoute>
                <Product />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <UserProtectedRoute>
                <Cart />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <UserProtectedRoute>
                <Wishlist />
              </UserProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <UserProtectedRoute>
                <Profile />
              </UserProtectedRoute>
            }
          />

        </Route>


        {/* ================= ADMIN ROUTES ================= */}

        <Route
          path="/admin"
          element={<AdminLogin />}
        />

        <Route
          path="/adminpage"
          element={
            <AdminProtectedRoute>
              <AdminLayout />
            </AdminProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}


export default App;