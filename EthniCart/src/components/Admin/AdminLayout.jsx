import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// --- CONFIGURATION FOR CLOUDINARY ---
// Replace these with your actual Cloudinary details
const CLOUDINARY_CLOUD_NAME = "dz59agoyk"; 
const CLOUDINARY_UPLOAD_PRESET = "ethnicart";

const INITIAL_PRODUCTS = [
  { id: 101, name: "Oversized Cotton Hoodie", category: "Tops", price: 49.99, stock: 35, sales: 120, image: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=100&auto=format&fit=crop&q=60" },
  { id: 102, name: "Slim Fit Denim Jeans", category: "Bottoms", price: 59.99, stock: 18, sales: 85, image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=100&auto=format&fit=crop&q=60" },
  { id: 103, name: "Floral Summer Dress", category: "Dresses", price: 39.99, stock: 8, sales: 140, image: "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=100&auto=format&fit=crop&q=60" },
  { id: 104, name: "Classic Leather Jacket", category: "Outerwear", price: 129.99, stock: 12, sales: 45, image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&auto=format&fit=crop&q=60" },
];

const INITIAL_ORDERS = [
  { id: "ORD-9021", customer: "Sarah Jenkins", items: 2, total: 100.00, date: "2026-08-05", status: "Delivered" },
  { id: "ORD-9022", customer: "Michael Chang", items: 1, total: 50.00, date: "2026-08-06", status: "Processing" },
  { id: "ORD-9023", customer: "Emma Watson", items: 3, total: 150.00, date: "2026-08-07", status: "Pending" },
  { id: "ORD-9024", customer: "David Miller", items: 1, total: 130.00, date: "2026-08-07", status: "Shipped" },
];

const INITIAL_CUSTOMERS = [
  { id: 1, name: "Sarah Jenkins", phone: "123-456-7890", location: "New York", orders: 5, spent: "340.00", joined: "Jan 12, 2026" },
  { id: 2, name: "Michael Chang", phone: "098-765-4321", location: "Los Angeles", orders: 2, spent: "119.98", joined: "Mar 04, 2026" },
  { id: 3, name: "Emma Watson", phone: "555-123-4567", location: "Chicago", orders: 8, spent: "620.50", joined: "Feb 19, 2026" },
  { id: 4, name: "David Miller", phone: "555-987-6543", location: "Houston", orders: 1, spent: "129.99", joined: "Aug 01, 2026" },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); 
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers] = useState(INITIAL_CUSTOMERS);

  // Form & Image Upload States
  const [newProd, setNewProd] = useState({ name: "", category: "Tops", price: "", stock: "" });
  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdPreview, setNewProdPreview] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingProd, setEditingProd] = useState(null);
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdPreview, setEditProdPreview] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    setProducts(INITIAL_PRODUCTS);
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders(orders.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  const handleDeleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  // Helper Function: Upload Image File to Cloudinary
  const uploadImageToCloudinary = async (file) => {
    // Fallback if Cloudinary settings are default / missing
    if (CLOUDINARY_CLOUD_NAME === "your_cloud_name") {
      console.warn("Cloudinary not configured. Returning local object URL for demo.");
      return URL.createObjectURL(file);
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Cloudinary upload failed:", error);
      return URL.createObjectURL(file); // Fallback to local URL on error
    }
  };

  // Handle Add Image File Change
  const handleNewImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProdFile(file);
      setNewProdPreview(URL.createObjectURL(file));
    }
  };

  // Handle Add Product Submit
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!newProd.name || !newProd.price || !newProd.stock) return;

    setIsUploading(true);
    let imageUrl = "https://via.placeholder.com/150";

    if (newProdFile) {
      imageUrl = await uploadImageToCloudinary(newProdFile);
    }

    const created = {
      id: Date.now(),
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price),
      stock: parseInt(newProd.stock),
      sales: 0,
      image: imageUrl,
    };

    setProducts([...products, created]);
    setNewProd({ name: "", category: "Tops", price: "", stock: "" });
    setNewProdFile(null);
    setNewProdPreview("");
    setIsUploading(false);
    setShowAddModal(false);
  };

  // Handle Open Edit Modal
  const handleOpenEditModal = (product) => {
    setEditingProd({ ...product });
    setEditProdPreview(product.image);
    setEditProdFile(null);
    setShowEditModal(true);
  };

  // Handle Edit Image File Change
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditProdFile(file);
      setEditProdPreview(URL.createObjectURL(file));
    }
  };

  // Handle Save Edit Submit
  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    if (!editingProd.name || !editingProd.price) return;

    setIsUploading(true);
    let imageUrl = editingProd.image;

    if (editProdFile) {
      imageUrl = await uploadImageToCloudinary(editProdFile);
    }

    setProducts(
      products.map((p) =>
        p.id === editingProd.id
          ? {
              ...editingProd,
              price: parseFloat(editingProd.price),
              stock: parseInt(editingProd.stock),
              image: imageUrl,
            }
          : p
      )
    );

    setIsUploading(false);
    setShowEditModal(false);
    setEditingProd(null);
    setEditProdFile(null);
    setEditProdPreview("");
  };

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0).toFixed(2);
  const totalStock = products.reduce((sum, p) => sum + p.stock, 0);

  const monthlySales = 124500;
  const weeklySales = 32400;
  const yearlySales = 865900;

  const topSellingProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const bestProduct = topSellingProducts[0];

  // ---------- WEEKLY ----------
  const weekData = Array(7).fill(0);
  orders.forEach((order) => {
    const orderDate = new Date(order.date);
    const today = new Date();
    const diff = (today - orderDate) / (1000 * 60 * 60 * 24);
    if (diff <= 6) {
      weekData[orderDate.getDay()] += order.total;
    }
  });

  // ---------- MONTHLY ----------
  const monthData = Array(12).fill(0);
  orders.forEach((order) => {
    const month = new Date(order.date).getMonth();
    monthData[month] += order.total;
  });

  // ---------- YEARLY ----------
  const yearData = {};
  orders.forEach((order) => {
    const year = new Date(order.date).getFullYear();
    yearData[year] = (yearData[year] || 0) + order.total;
  });

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 text-gray-800 font-sans p-2 md:p-4">
      {/* 1. MOBILE TOP BAR */}
      <div className="md:hidden bg-gray-900 text-white flex items-center justify-between p-4 sticky top-0 z-30 shadow-md">
        <div className="text-base font-bold flex items-center gap-2">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">A</span>
          Admin Panel
        </div>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 rounded-lg bg-gray-800 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* 2. BACKDROP OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. SIDEBAR */}
      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col p-4 shrink-0 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="hidden md:flex text-lg font-bold p-2 items-center gap-2 border-b border-gray-800 pb-4 mb-4">
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">A</span>
          Admin Panel
        </div>

        <nav className="flex flex-col gap-1 flex-1 mt-4 md:mt-0">
          <SidebarBtn label="Dashboard" active={activeTab === "dashboard"} onClick={() => handleTabChange("dashboard")} icon="📊" />
          <SidebarBtn label="Orders" active={activeTab === "orders"} onClick={() => handleTabChange("orders")} badge={orders.length} icon="📦" />
          <SidebarBtn label="Products" active={activeTab === "products"} onClick={() => handleTabChange("products")} badge={products.length} icon="🏷️" />
          <SidebarBtn label="Customers" active={activeTab === "customers"} onClick={() => handleTabChange("customers")} icon="👥" />
          <SidebarBtn label="Sales" active={activeTab === "sales"} onClick={() => handleTabChange("sales")} icon="📈" />
        </nav>

        <div className="pt-4 border-t border-gray-800">
          <a onClick={handleLogout} href="/" className="text-xs text-gray-400 hover:text-white transition-colors flex items-center gap-1 cursor-pointer">
            ← Logout
          </a>
        </div>
      </aside>

      {/* 4. MAIN CONTENT AREA */}
      <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-gray-900 uppercase">{activeTab}</h1>
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <a href="/" className="text-sm font-semibold text-gray-900 leading-tight">Back to Home</a>
            </div>
            <a href="/" className="w-9 h-9 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-xs shadow-sm">
              Home
            </a>
          </div>
        </header>

        {/* 1. DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard title="Total Revenue" value={`${totalRevenue}₹`} trend="+14% this month" color="border-emerald-500" />
              <StatCard title="Total Orders" value={orders.length} trend="+5 new today" color="border-blue-500" />
              <StatCard title="Total Products" value={products.length} trend={`${totalStock} items in stock`} color="border-amber-500" />
              <StatCard title="Total Customers" value={customers.length} trend="+2 new this week" color="border-purple-500" />
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h3>
              <OrdersTable orders={orders.slice(0, 3)} onStatusChange={handleOrderStatusChange} />
            </div>
          </div>
        )}

        {/* 2. ORDERS VIEW */}
        {activeTab === "orders" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">All Store Orders</h3>
            </div>
            <OrdersTable orders={orders} onStatusChange={handleOrderStatusChange} />
          </div>
        )}

        {/* 3. PRODUCTS VIEW */}
        {activeTab === "products" && (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Product Catalog</h3>
              <button
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm flex items-center gap-2"
              >
                <span>+</span> Add New Product
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Product</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Price</th>
                    <th className="py-3 px-4">Stock</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-gray-100 border border-gray-200" />
                          <span className="font-medium text-gray-900 text-sm">{p.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-sm text-gray-600">{p.category}</td>
                      <td className="py-3.5 px-4 text-sm font-semibold text-gray-900">{p.price.toFixed(2)}₹</td>
                      <td className="py-3.5 px-4 text-sm">
                        <span className={`font-semibold ${p.stock < 10 ? "text-red-500" : "text-emerald-600"}`}>
                          {p.stock} units
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium text-xs px-3 py-1.5 rounded-md transition-colors"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id)}
                            className="bg-red-50 hover:bg-red-100 text-red-600 font-medium text-xs px-3 py-1.5 rounded-md transition-colors"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ADD PRODUCT MODAL */}
            {showAddModal && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Add New Clothing Product</h3>
                  <form onSubmit={handleAddProduct} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        placeholder="e.g. Oversized Denim Jacket"
                        value={newProd.name}
                        onChange={(e) => setNewProd({ ...newProd, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* FILE INPUT FOR IMAGE */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Upload Product Photo</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleNewImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                        required
                      />
                      {newProdPreview && (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={newProdPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                          <span className="text-xs text-gray-500">Image selected</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                      <select
                        value={newProd.category}
                        onChange={(e) => setNewProd({ ...newProd, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Outerwear">Outerwear</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          placeholder="49.99"
                          value={newProd.price}
                          onChange={(e) => setNewProd({ ...newProd, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                        <input
                          type="number"
                          placeholder="25"
                          value={newProd.stock}
                          onChange={(e) => setNewProd({ ...newProd, stock: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddModal(false)}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Save Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* EDIT PRODUCT MODAL */}
            {showEditModal && editingProd && (
              <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl border border-gray-100">
                  <h3 className="text-lg font-bold text-gray-900">Edit Product</h3>
                  <form onSubmit={handleUpdateProduct} className="mt-4 space-y-4">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Product Name</label>
                      <input
                        type="text"
                        value={editingProd.name}
                        onChange={(e) => setEditingProd({ ...editingProd, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>

                    {/* EDIT FILE INPUT */}
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Change Photo (Optional)</label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleEditImageChange}
                        className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
                      />
                      {editProdPreview && (
                        <div className="mt-3 flex items-center gap-3">
                          <img src={editProdPreview} alt="Preview" className="w-16 h-16 rounded-lg object-cover border border-gray-200" />
                          <span className="text-xs text-gray-500">Current / New Preview</span>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                      <select
                        value={editingProd.category}
                        onChange={(e) => setEditingProd({ ...editingProd, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                      >
                        <option value="Tops">Tops</option>
                        <option value="Bottoms">Bottoms</option>
                        <option value="Dresses">Dresses</option>
                        <option value="Outerwear">Outerwear</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Price (₹)</label>
                        <input
                          type="number"
                          step="0.01"
                          value={editingProd.price}
                          onChange={(e) => setEditingProd({ ...editingProd, price: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
                        <input
                          type="number"
                          value={editingProd.stock}
                          onChange={(e) => setEditingProd({ ...editingProd, stock: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                      <button
                        type="button"
                        onClick={() => {
                          setShowEditModal(false);
                          setEditingProd(null);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                        disabled={isUploading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading}
                        className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors shadow-sm disabled:opacity-50"
                      >
                        {isUploading ? "Uploading..." : "Update Product"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. CUSTOMERS VIEW */}
        {activeTab === "customers" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Registered Customers</h3>
            </div>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[500px]">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
                    <th className="py-3 px-4">Customer</th>
                    <th className="py-3 px-4">Phone No.</th>
                    <th className="py-3 px-4">Location</th>
                    <th className="py-3 px-4">Orders</th>
                    <th className="py-3 px-4">Total Spent</th>
                    <th className="py-3 px-4">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {customers.map((c) => (
                    <tr key={c.id} className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700">
                      <td className="py-3.5 px-4 font-semibold text-gray-900">{c.name}</td>
                      <td className="py-3.5 px-4">{c.phone}</td>
                      <td className="py-3.5 px-4">{c.location}</td>
                      <td className="py-3.5 px-4">{c.orders} orders</td>
                      <td className="py-3.5 px-4 font-semibold text-gray-900">{c.spent}₹</td>
                      <td className="py-3.5 px-4 text-gray-500">{c.joined}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. SALES VIEW */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <StatCard onClick={() => setSalesView("monthly")} title="Monthly Sales" value={`₹${monthlySales.toLocaleString()}`} trend="+12%" color="border-blue-500" />
              <StatCard onClick={() => setSalesView("weekly")} title="Weekly Sales" value={`₹${weeklySales.toLocaleString()}`} trend="+8%" color="border-blue-500" />
              <StatCard onClick={() => setSalesView("yearly")} title="Yearly Sales" value={`₹${yearlySales.toLocaleString()}`} trend="+24%" color="border-blue-500" />
            </div>

            <div className="flex gap-3 justify-center mb-4">
              <button
                onClick={() => setSalesView("weekly")}
                className={salesView === "weekly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Weekly
              </button>
              <button
                onClick={() => setSalesView("monthly")}
                className={salesView === "monthly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Monthly
              </button>
              <button
                onClick={() => setSalesView("yearly")}
                className={salesView === "yearly" ? "bg-blue-600 text-white px-4 py-2 rounded" : "bg-gray-200 px-4 py-2 rounded"}
              >
                Yearly
              </button>
            </div>

            {salesView === "weekly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Last 7 Days Revenue</h2>
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, index) => (
                  <div key={day} className="flex justify-between border-b py-2">
                    <span>{day}</span>
                    <span>₹{weekData[index]}</span>
                  </div>
                ))}
              </div>
            )}

            {salesView === "monthly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Monthly Revenue</h2>
                {["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].map((month, index) => (
                  <div key={month} className="flex justify-between border-b py-2">
                    <span>{month}</span>
                    <span>₹{monthData[index]}</span>
                  </div>
                ))}
              </div>
            )}

            {salesView === "yearly" && (
              <div className="bg-white rounded-xl shadow p-6">
                <h2 className="text-xl font-bold mb-4">Yearly Revenue</h2>
                {Object.entries(yearData).map(([year, total]) => (
                  <div key={year} className="flex justify-between border-b py-2">
                    <span>{year}</span>
                    <span>₹{total}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="bg-white p-6 rounded-xl shadow border">
              <h2 className="text-lg font-semibold mb-3">Monthly Target</h2>
              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">
                <div className="w-3/4 h-full bg-green-500 rounded-full"></div>
              </div>
              <p className="mt-2 text-gray-500">75% of target achieved</p>
            </div>

            <div className="bg-white rounded-xl shadow border p-6">
              <h2 className="text-lg font-semibold mb-4">Top Selling Products</h2>
              {topSellingProducts.map((item, index) => (
                <div key={item.id} className="flex justify-between py-3 border-b">
                  <span>{index + 1}. {item.name}</span>
                  <span className="font-bold">{item.sales} Sold</span>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h2 className="text-xl font-bold text-blue-700">Best Selling Product</h2>
              <p className="mt-3 text-lg font-semibold">{bestProduct?.name}</p>
              <p className="text-gray-600">{bestProduct?.sales} Units Sold</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function SidebarBtn({ label, active, onClick, badge, icon }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
        active ? "bg-gray-800 text-white" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"
      }`}
    >
      <span className="flex items-center gap-2">
        <span>{icon}</span> {label}
      </span>
      {badge !== undefined && (
        <span className="bg-gray-800 text-gray-300 text-xs px-2 py-0.5 rounded-full font-mono">{badge}</span>
      )}
    </button>
  );
}

function StatCard({ title, value, trend, color, onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border border-gray-200/80 shadow-sm border-t-4 ${color} ${
        onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""
      }`}
    >
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{title}</p>
      <h2 className="text-2xl font-bold text-gray-900 my-2">{value}</h2>
      <p className="text-xs font-medium text-emerald-600">{trend}</p>
    </div>
  );
}

function OrdersTable({ orders, onStatusChange }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-x-auto">
      <table className="w-full text-left border-collapse min-w-[500px]">
        <thead>
          <tr className="bg-gray-50 text-gray-600 text-xs font-semibold uppercase tracking-wider border-b border-gray-200">
            <th className="py-3 px-4">Order ID</th>
            <th className="py-3 px-4">Customer</th>
            <th className="py-3 px-4">Date</th>
            <th className="py-3 px-4">Total</th>
            <th className="py-3 px-4">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders.map((o) => (
            <tr key={o.id} className="hover:bg-gray-50/50 transition-colors text-sm text-gray-700">
              <td className="py-3.5 px-4 font-bold text-gray-900">{o.id}</td>
              <td className="py-3.5 px-4">{o.customer}</td>
              <td className="py-3.5 px-4 text-gray-500">{o.date}</td>
              <td className="py-3.5 px-4 font-semibold text-gray-900">{o.total.toFixed(2)}₹</td>
              <td className="py-3.5 px-4">
                <select
                  value={o.status}
                  onChange={(e) => onStatusChange(o.id, e.target.value)}
                  className={`text-xs font-medium px-2.5 py-1 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    o.status === "Delivered"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : o.status === "Processing"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-gray-50 text-gray-700"
                  }`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}