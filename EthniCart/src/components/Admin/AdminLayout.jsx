import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =========================
// CLOUDINARY CONFIG
// =========================

const CLOUDINARY_CLOUD_NAME = "dz59agoyk";
const CLOUDINARY_UPLOAD_PRESET = "ethnicart";

// =========================
// INITIAL PRODUCTS
// =========================

const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: "Oversized Cotton Hoodie",
    category: "Tops",
    price: 49.99,
    stock: 35,
    sales: 120,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: 102,
    name: "Slim Fit Denim Jeans",
    category: "Bottoms",
    price: 59.99,
    stock: 18,
    sales: 85,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: 103,
    name: "Floral Summer Dress",
    category: "Dresses",
    price: 39.99,
    stock: 8,
    sales: 140,
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=300&auto=format&fit=crop&q=60",
  },
  {
    id: 104,
    name: "Classic Leather Jacket",
    category: "Outerwear",
    price: 129.99,
    stock: 12,
    sales: 45,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&auto=format&fit=crop&q=60",
  },
];

// =========================
// INITIAL ORDERS
// =========================

const INITIAL_ORDERS = [
  {
    id: "ORD-9021",
    customer: "Sarah Jenkins",
    items: 2,
    total: 100,
    date: "2026-08-05",
    status: "Delivered",
  },
  {
    id: "ORD-9022",
    customer: "Michael Chang",
    items: 1,
    total: 50,
    date: "2026-08-06",
    status: "Processing",
  },
  {
    id: "ORD-9023",
    customer: "Emma Watson",
    items: 3,
    total: 150,
    date: "2026-08-07",
    status: "Pending",
  },
  {
    id: "ORD-9024",
    customer: "David Miller",
    items: 1,
    total: 130,
    date: "2026-08-07",
    status: "Shipped",
  },
];

// =========================
// ADMIN LAYOUT
// =========================

export default function AdminLayout() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  // =========================
  // REAL CUSTOMERS
  // =========================

  const [customers, setCustomers] = useState([]);

  // =========================
  // ADD PRODUCT
  // =========================

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Tops",
    price: "",
    stock: "",
  });

  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdPreview, setNewProdPreview] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  // =========================
  // EDIT PRODUCT
  // =========================

  const [editingProd, setEditingProd] = useState(null);
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdPreview, setEditProdPreview] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [isUploading, setIsUploading] = useState(false);

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {
    setProducts(INITIAL_PRODUCTS);
    loadCustomers();
  }, []);

  // =========================
  // LOAD REGISTERED USERS
  // =========================

  const loadCustomers = () => {
    const savedUsers = localStorage.getItem("ethnicartUsers");

    if (!savedUsers) {
      setCustomers([]);
      return;
    }

    try {
      const users = JSON.parse(savedUsers);

      const formattedUsers = users.map((user, index) => ({
        id: user.id || index + 1,
        name: user.name || "Unknown",
        email: user.email || "Not provided",
        phone: user.phone || "Not provided",
        location: user.location || "Not provided",
        orders: user.orders || 0,
        spent: Number(user.spent || 0),
        joined: user.joined || "Unknown",
      }));

      setCustomers(formattedUsers);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    }
  };

  // =========================
  // TAB
  // =========================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);

    if (tab === "customers") {
      loadCustomers();
    }
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  // =========================
  // ORDER STATUS
  // =========================

  const handleOrderStatusChange = (orderId, newStatus) => {
    setOrders((currentOrders) =>
      currentOrders.map((order) =>
        order.id === orderId
          ? { ...order, status: newStatus }
          : order
      )
    );
  };

  // =========================
  // DELETE PRODUCT
  // =========================

  const handleDeleteProduct = (id) => {
    setProducts((currentProducts) =>
      currentProducts.filter((product) => product.id !== id)
    );
  };

  // =========================
  // CLOUDINARY
  // =========================

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";

    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
      return URL.createObjectURL(file);
    }

    const formData = new FormData();

    formData.append("file", file);
    formData.append(
      "upload_preset",
      CLOUDINARY_UPLOAD_PRESET
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error("Cloudinary upload failed");
      }

      return data.secure_url;
    } catch (error) {
      console.error(error);

      return URL.createObjectURL(file);
    }
  };

  // =========================
  // NEW IMAGE
  // =========================

  const handleNewImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setNewProdFile(file);
    setNewProdPreview(URL.createObjectURL(file));
  };

  // =========================
  // ADD PRODUCT
  // =========================

  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (
      !newProd.name ||
      !newProd.price ||
      !newProd.stock
    ) {
      return;
    }

    setIsUploading(true);

    let imageUrl =
      "https://via.placeholder.com/300";

    if (newProdFile) {
      imageUrl =
        await uploadImageToCloudinary(newProdFile);
    }

    const createdProduct = {
      id: Date.now(),
      name: newProd.name,
      category: newProd.category,
      price: parseFloat(newProd.price),
      stock: parseInt(newProd.stock),
      sales: 0,
      image: imageUrl,
    };

    setProducts((currentProducts) => [
      ...currentProducts,
      createdProduct,
    ]);

    setNewProd({
      name: "",
      category: "Tops",
      price: "",
      stock: "",
    });

    setNewProdFile(null);
    setNewProdPreview("");
    setIsUploading(false);
    setShowAddModal(false);
  };

  // =========================
  // OPEN EDIT
  // =========================

  const handleOpenEditModal = (product) => {
    setEditingProd({ ...product });
    setEditProdPreview(product.image);
    setEditProdFile(null);
    setShowEditModal(true);
  };

  // =========================
  // EDIT IMAGE
  // =========================

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditProdFile(file);
    setEditProdPreview(URL.createObjectURL(file));
  };

  // =========================
  // UPDATE PRODUCT
  // =========================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProd?.name || !editingProd?.price) {
      return;
    }

    setIsUploading(true);

    let imageUrl = editingProd.image;

    if (editProdFile) {
      imageUrl =
        await uploadImageToCloudinary(editProdFile);
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === editingProd.id
          ? {
              ...editingProd,
              price: parseFloat(editingProd.price),
              stock: parseInt(editingProd.stock),
              image: imageUrl,
            }
          : product
      )
    );

    setIsUploading(false);
    setShowEditModal(false);
    setEditingProd(null);
    setEditProdFile(null);
    setEditProdPreview("");
  };

  // =========================
  // DASHBOARD DATA
  // =========================

  const totalRevenue = orders
    .reduce((sum, order) => sum + order.total, 0)
    .toFixed(2);

  const totalStock = products.reduce(
    (sum, product) => sum + product.stock,
    0
  );

  const monthlySales = 124500;
  const weeklySales = 32400;
  const yearlySales = 865900;

  const topSellingProducts = [...products]
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5);

  const bestProduct = topSellingProducts[0];

  // =========================
  // SALES DATA
  // =========================

  const weekData = Array(7).fill(0);

  orders.forEach((order) => {
    const orderDate = new Date(order.date);
    const today = new Date();

    const diff =
      (today - orderDate) /
      (1000 * 60 * 60 * 24);

    if (diff <= 6 && diff >= 0) {
      weekData[orderDate.getDay()] +=
        order.total;
    }
  });

  const monthData = Array(12).fill(0);

  orders.forEach((order) => {
    const month = new Date(
      order.date
    ).getMonth();

    monthData[month] += order.total;
  });

  const yearData = {};

  orders.forEach((order) => {
    const year = new Date(
      order.date
    ).getFullYear();

    yearData[year] =
      (yearData[year] || 0) + order.total;
  });

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* =========================
          MOBILE TOP BAR
      ========================= */}

      <div className="fixed top-0 left-0 right-0 z-30 bg-gray-900 text-white p-3 flex items-center justify-between md:hidden">

        <div className="flex items-center gap-2 font-bold">
          <span className="bg-blue-600 px-2 py-1 rounded">
            A
          </span>

          Admin Panel
        </div>

        <button
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen
            )
          }
          className="p-2 rounded-lg bg-gray-800"
        >
          ☰
        </button>
      </div>

      {/* =========================
          MOBILE BACKDROP
      ========================= */}

      {isMobileMenuOpen && (
        <div
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-50 w-64 bg-gray-900 text-white flex flex-col p-4 shadow-lg transform transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >

        <div className="hidden md:flex text-lg font-bold p-2 items-center gap-2 border-b border-gray-800 pb-4 mb-4">

          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-mono">
            A
          </span>

          Admin Panel
        </div>

        <nav className="flex flex-col gap-1 flex-1 mt-16 md:mt-0">

          <SidebarBtn
            label="Dashboard"
            icon="📊"
            active={
              activeTab === "dashboard"
            }
            onClick={() =>
              handleTabChange("dashboard")
            }
          />

          <SidebarBtn
            label="Orders"
            icon="📦"
            badge={orders.length}
            active={
              activeTab === "orders"
            }
            onClick={() =>
              handleTabChange("orders")
            }
          />

          <SidebarBtn
            label="Products"
            icon="🏷️"
            badge={products.length}
            active={
              activeTab === "products"
            }
            onClick={() =>
              handleTabChange("products")
            }
          />

          <SidebarBtn
            label="Customers"
            icon="👥"
            badge={customers.length}
            active={
              activeTab === "customers"
            }
            onClick={() =>
              handleTabChange("customers")
            }
          />

          <SidebarBtn
            label="Sales"
            icon="📈"
            active={
              activeTab === "sales"
            }
            onClick={() =>
              handleTabChange("sales")
            }
          />

        </nav>

        <div className="pt-4 border-t border-gray-800">

          <button
            onClick={handleLogout}
            className="text-xs text-gray-400 hover:text-white flex items-center gap-1"
          >
            ← Logout
          </button>

        </div>

      </aside>

      {/* =========================
          MAIN
      ========================= */}

      <main className="flex-1 p-4 sm:p-6 md:p-8 pt-20 md:pt-8 overflow-y-auto">

        <header className="flex justify-between items-center pb-6 border-b border-gray-200 mb-8">

          <h1 className="text-2xl font-bold text-gray-900 uppercase">
            {activeTab}
          </h1>

          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-semibold"
          >
            Home
          </a>

        </header>

        {/* =========================
            DASHBOARD
        ========================= */}

        {activeTab === "dashboard" && (
          <div className="space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <StatCard
                title="Total Revenue"
                value={`₹${totalRevenue}`}
                trend="+14% this month"
                color="border-emerald-500"
              />

              <StatCard
                title="Total Orders"
                value={orders.length}
                trend="+5 new today"
                color="border-blue-500"
              />

              <StatCard
                title="Total Products"
                value={products.length}
                trend={`${totalStock} items in stock`}
                color="border-amber-500"
              />

              <StatCard
                title="Total Customers"
                value={customers.length}
                trend="Registered users"
                color="border-purple-500"
              />

            </div>

            <div>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Orders
              </h3>

              <OrdersTable
                orders={orders.slice(0, 3)}
                onStatusChange={
                  handleOrderStatusChange
                }
              />

            </div>

          </div>
        )}

        {/* =========================
            ORDERS
        ========================= */}

        {activeTab === "orders" && (
          <div>

            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              All Store Orders
            </h3>

            <OrdersTable
              orders={orders}
              onStatusChange={
                handleOrderStatusChange
              }
            />

          </div>
        )}

        {/* =========================
            PRODUCTS
        ========================= */}

        {activeTab === "products" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <h3 className="text-lg font-semibold">
                Product Catalog
              </h3>

              <button
                onClick={() =>
                  setShowAddModal(true)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Product
              </button>

            </div>

            <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

              <table className="w-full text-left min-w-[650px]">

                <thead className="bg-gray-50">

                  <tr>
                    <th className="p-4">
                      Product
                    </th>

                    <th className="p-4">
                      Category
                    </th>

                    <th className="p-4">
                      Price
                    </th>

                    <th className="p-4">
                      Stock
                    </th>

                    <th className="p-4 text-right">
                      Actions
                    </th>
                  </tr>

                </thead>

                <tbody>

                  {products.map((product) => (

                    <tr
                      key={product.id}
                      className="border-t"
                    >

                      <td className="p-4">

                        <div className="flex items-center gap-3">

                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-12 h-12 rounded-lg object-cover"
                          />

                          <span className="font-medium">
                            {product.name}
                          </span>

                        </div>

                      </td>

                      <td className="p-4">
                        {product.category}
                      </td>

                      <td className="p-4 font-semibold">
                        ₹{product.price.toFixed(2)}
                      </td>

                      <td className="p-4">
                        <span
                          className={
                            product.stock < 10
                              ? "text-red-500 font-semibold"
                              : "text-green-600 font-semibold"
                          }
                        >
                          {product.stock} units
                        </span>
                      </td>

                      <td className="p-4">

                        <div className="flex justify-end gap-2">

                          <button
                            onClick={() =>
                              handleOpenEditModal(
                                product
                              )
                            }
                            className="bg-blue-50 text-blue-600 px-3 py-1.5 rounded"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() =>
                              handleDeleteProduct(
                                product.id
                              )
                            }
                            className="bg-red-50 text-red-600 px-3 py-1.5 rounded"
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

            {/* =========================
                ADD MODAL
            ========================= */}

            {showAddModal && (
              <ProductModal
                title="Add New Product"
                product={newProd}
                setProduct={setNewProd}
                preview={newProdPreview}
                onImageChange={
                  handleNewImageChange
                }
                onSubmit={
                  handleAddProduct
                }
                onClose={() =>
                  setShowAddModal(false)
                }
                uploading={isUploading}
                isEdit={false}
              />
            )}

            {/* =========================
                EDIT MODAL
            ========================= */}

            {showEditModal &&
              editingProd && (
                <ProductModal
                  title="Edit Product"
                  product={editingProd}
                  setProduct={setEditingProd}
                  preview={editProdPreview}
                  onImageChange={
                    handleEditImageChange
                  }
                  onSubmit={
                    handleUpdateProduct
                  }
                  onClose={() => {
                    setShowEditModal(false);
                    setEditingProd(null);
                  }}
                  uploading={isUploading}
                  isEdit={true}
                />
              )}

          </div>
        )}

        {/* =========================
            CUSTOMERS
        ========================= */}

        {activeTab === "customers" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <div>

                <h3 className="text-lg font-semibold text-gray-800">
                  Registered Customers
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Real users registered on EthniCart
                </p>

              </div>

              <button
                onClick={loadCustomers}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm"
              >
                ↻ Refresh
              </button>

            </div>

            {customers.length === 0 ? (

              <div className="bg-white rounded-xl border p-10 text-center">

                <div className="text-5xl mb-4">
                  👥
                </div>

                <h3 className="text-lg font-semibold text-gray-800">
                  No customers yet
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Registered users will appear here.
                </p>

              </div>

            ) : (

              <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

                <table className="w-full text-left min-w-[850px]">

                  <thead>

                    <tr className="bg-gray-50 text-gray-600 text-xs uppercase border-b">

                      <th className="py-3 px-4">
                        Customer
                      </th>

                      <th className="py-3 px-4">
                        Email
                      </th>

                      <th className="py-3 px-4">
                        Phone
                      </th>

                      <th className="py-3 px-4">
                        Location
                      </th>

                      <th className="py-3 px-4">
                        Orders
                      </th>

                      <th className="py-3 px-4">
                        Total Spent
                      </th>

                      <th className="py-3 px-4">
                        Joined
                      </th>

                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    {customers.map((customer) => (

                      <tr
                        key={customer.id}
                        className="hover:bg-gray-50"
                      >

                        <td className="py-4 px-4">

                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                              {customer.name
                                ?.charAt(0)
                                ?.toUpperCase()}
                            </div>

                            <div>

                              <p className="font-semibold text-gray-900">
                                {customer.name}
                              </p>

                            </div>

                          </div>

                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600">
                          {customer.email}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600">
                          {customer.phone}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-600">
                          {customer.location}
                        </td>

                        <td className="py-4 px-4 text-sm">
                          {customer.orders}
                        </td>

                        <td className="py-4 px-4 font-semibold">
                          ₹
                          {Number(
                            customer.spent || 0
                          ).toFixed(2)}
                        </td>

                        <td className="py-4 px-4 text-sm text-gray-500">
                          {customer.joined}
                        </td>

                      </tr>

                    ))}

                  </tbody>

                </table>

              </div>

            )}

          </div>
        )}

        {/* =========================
            SALES
        ========================= */}

        {activeTab === "sales" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <StatCard
                onClick={() =>
                  setSalesView("monthly")
                }
                title="Monthly Sales"
                value={`₹${monthlySales.toLocaleString()}`}
                trend="+12%"
                color="border-blue-500"
              />

              <StatCard
                onClick={() =>
                  setSalesView("weekly")
                }
                title="Weekly Sales"
                value={`₹${weeklySales.toLocaleString()}`}
                trend="+8%"
                color="border-blue-500"
              />

              <StatCard
                onClick={() =>
                  setSalesView("yearly")
                }
                title="Yearly Sales"
                value={`₹${yearlySales.toLocaleString()}`}
                trend="+24%"
                color="border-blue-500"
              />

            </div>

            <div className="flex gap-3 justify-center">

              {["weekly", "monthly", "yearly"].map(
                (type) => (

                  <button
                    key={type}
                    onClick={() =>
                      setSalesView(type)
                    }
                    className={
                      salesView === type
                        ? "bg-blue-600 text-white px-4 py-2 rounded"
                        : "bg-gray-200 px-4 py-2 rounded"
                    }
                  >
                    {type
                      .charAt(0)
                      .toUpperCase() +
                      type.slice(1)}
                  </button>

                )
              )}

            </div>

            {salesView === "weekly" && (
              <SalesBox
                title="Last 7 Days Revenue"
                data={weekData}
                labels={[
                  "Sun",
                  "Mon",
                  "Tue",
                  "Wed",
                  "Thu",
                  "Fri",
                  "Sat",
                ]}
              />
            )}

            {salesView === "monthly" && (
              <SalesBox
                title="Monthly Revenue"
                data={monthData}
                labels={[
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ]}
              />
            )}

            {salesView === "yearly" && (
              <SalesBox
                title="Yearly Revenue"
                data={Object.values(
                  yearData
                )}
                labels={Object.keys(
                  yearData
                )}
              />
            )}

            <div className="bg-white p-6 rounded-xl shadow border">

              <h2 className="text-lg font-semibold mb-3">
                Monthly Target
              </h2>

              <div className="w-full h-4 bg-gray-200 rounded-full overflow-hidden">

                <div className="w-3/4 h-full bg-green-500 rounded-full" />

              </div>

              <p className="mt-2 text-gray-500">
                75% of target achieved
              </p>

            </div>

            <div className="bg-white rounded-xl shadow border p-6">

              <h2 className="text-lg font-semibold mb-4">
                Top Selling Products
              </h2>

              {topSellingProducts.map(
                (item, index) => (

                  <div
                    key={item.id}
                    className="flex justify-between py-3 border-b"
                  >

                    <span>
                      {index + 1}.{" "}
                      {item.name}
                    </span>

                    <span className="font-bold">
                      {item.sales} Sold
                    </span>

                  </div>

                )
              )}

            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">

              <h2 className="text-xl font-bold text-blue-700">
                Best Selling Product
              </h2>

              <p className="mt-3 text-lg font-semibold">
                {bestProduct?.name ||
                  "No products"}
              </p>

              <p className="text-gray-600">
                {bestProduct?.sales || 0}{" "}
                Units Sold
              </p>

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// =========================
// SIDEBAR BUTTON
// =========================

function SidebarBtn({
  label,
  active,
  onClick,
  badge,
  icon,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium w-full text-left ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >

      <span>
        {icon} {label}
      </span>

      {badge !== undefined && (
        <span className="bg-blue-600 text-white text-xs px-2 py-0.5 rounded-full">
          {badge}
        </span>
      )}

    </button>
  );
}

// =========================
// STAT CARD
// =========================

function StatCard({
  title,
  value,
  trend,
  color,
  onClick,
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border shadow-sm border-t-4 ${color} ${
        onClick
          ? "cursor-pointer hover:shadow-md"
          : ""
      }`}
    >

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold text-gray-900 mt-2">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {trend}
      </p>

    </div>
  );
}

// =========================
// ORDERS TABLE
// =========================

function OrdersTable({
  orders,
  onStatusChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

      <table className="w-full text-left min-w-[650px]">

        <thead>

          <tr className="bg-gray-50 text-gray-600 text-xs uppercase border-b">

            <th className="py-3 px-4">
              Order ID
            </th>

            <th className="py-3 px-4">
              Customer
            </th>

            <th className="py-3 px-4">
              Date
            </th>

            <th className="py-3 px-4">
              Total
            </th>

            <th className="py-3 px-4">
              Status
            </th>

          </tr>

        </thead>

        <tbody className="divide-y">

          {orders.map((order) => (

            <tr key={order.id}>

              <td className="py-4 px-4 font-semibold">
                {order.id}
              </td>

              <td className="py-4 px-4">
                {order.customer}
              </td>

              <td className="py-4 px-4 text-gray-500">
                {order.date}
              </td>

              <td className="py-4 px-4 font-semibold">
                ₹
                {order.total.toFixed(2)}
              </td>

              <td className="py-4 px-4">

                <select
                  value={order.status}
                  onChange={(e) =>
                    onStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-2 py-1 text-sm"
                >

                  <option>
                    Pending
                  </option>

                  <option>
                    Processing
                  </option>

                  <option>
                    Shipped
                  </option>

                  <option>
                    Delivered
                  </option>

                </select>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

// =========================
// PRODUCT MODAL
// =========================

function ProductModal({
  title,
  product,
  setProduct,
  preview,
  onImageChange,
  onSubmit,
  onClose,
  uploading,
  isEdit,
}) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">

        <h3 className="text-lg font-bold">
          {title}
        </h3>

        <form
          onSubmit={onSubmit}
          className="space-y-4 mt-4"
        >

          <input
            type="text"
            placeholder="Product Name"
            value={product.name}
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full text-sm"
            required={!isEdit}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          )}

          <select
            value={product.category}
            onChange={(e) =>
              setProduct({
                ...product,
                category: e.target.value,
              })
            }
            className="w-full border rounded-lg px-3 py-2"
          >

            <option value="Tops">
              Tops
            </option>

            <option value="Bottoms">
              Bottoms
            </option>

            <option value="Dresses">
              Dresses
            </option>

            <option value="Outerwear">
              Outerwear
            </option>

          </select>

          <div className="grid grid-cols-2 gap-3">

            <input
              type="number"
              step="0.01"
              placeholder="Price"
              value={product.price}
              onChange={(e) =>
                setProduct({
                  ...product,
                  price: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={product.stock}
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock: e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
              required
            />

          </div>

          <div className="flex justify-end gap-3">

            <button
              type="button"
              onClick={onClose}
              disabled={uploading}
              className="bg-gray-100 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={uploading}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              {uploading
                ? "Uploading..."
                : isEdit
                ? "Update Product"
                : "Save Product"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

// =========================
// SALES BOX
// =========================

function SalesBox({
  title,
  data,
  labels,
}) {
  return (
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-bold mb-4">
        {title}
      </h2>

      {labels.map((label, index) => (

        <div
          key={`${label}-${index}`}
          className="flex justify-between border-b py-2"
        >

          <span>
            {label}
          </span>

          <span>
            ₹
            {Number(
              data[index] || 0
            ).toFixed(2)}
          </span>

        </div>

      ))}

    </div>
  );
}