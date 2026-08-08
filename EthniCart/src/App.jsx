import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import Navbar from "./components/Layout/Navbar";

import Home from "./pages/Home";
import Shop from "./pages/Shop";
import Cart from "./pages/Cart";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import OrderSuccess from "./pages/OrderSuccess";

import Profile from "./components/Home/Profile";

import AdminLogin from "./components/Admin/AdminLogin";
import AdminLayout from "./components/Admin/AdminLayout";
import AdminProtectedRoute from "./components/Admin/ProtectedRoute";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Checkout from "./pages/Checkout";


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

          {/* PUBLIC ROUTES */}

          <Route
            path="/"
            element={<Home />}
          />

          <Route
            path="/login"
            element={<Login />}
          />

          <Route
            path="/register"
            element={<Register />}
          />


          {/* ================= PROTECTED ROUTES ================= */}

          <Route
            path="/shop"
            element={
              <ProtectedRoute>
                <Shop />
              </ProtectedRoute>
            }
          />

          <Route
            path="/product/:id"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />

          <Route
            path="/wishlist"
            element={
              <ProtectedRoute>
                <Wishlist />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          <Route
            path="/order-success"
            element={
              <ProtectedRoute>
                <OrderSuccess />
              </ProtectedRoute>
            }
          />
          <Route
             path="/checkout"
             element={
             <ProtectedRoute>
              <Checkout />
             </ProtectedRoute>
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