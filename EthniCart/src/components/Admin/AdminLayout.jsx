import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// =====================================================
// CLOUDINARY
// =====================================================

const CLOUDINARY_CLOUD_NAME = "dz59agoyk";
const CLOUDINARY_UPLOAD_PRESET = "ethnicart";

// =====================================================
// INITIAL PRODUCTS
// =====================================================

const INITIAL_PRODUCTS = [
  {
    id: 101,
    name: "Oversized Cotton Hoodie",
    category: "Tops",
    price: 49.99,
    stock: 35,
    sales: 120,
    image:
      "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 102,
    name: "Slim Fit Denim Jeans",
    category: "Bottoms",
    price: 59.99,
    stock: 18,
    sales: 85,
    image:
      "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 103,
    name: "Floral Summer Dress",
    category: "Dresses",
    price: 39.99,
    stock: 8,
    sales: 140,
    image:
      "https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=500&auto=format&fit=crop&q=60",
  },
  {
    id: 104,
    name: "Classic Leather Jacket",
    category: "Outerwear",
    price: 129.99,
    stock: 12,
    sales: 45,
    image:
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&auto=format&fit=crop&q=60",
  },
];

// =====================================================
// INITIAL ORDERS
// =====================================================

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
];

// =====================================================
// ADMIN LAYOUT
// =====================================================

export default function AdminLayout() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Tops",
    price: "",
    stock: "",
  });

  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdPreview, setNewProdPreview] = useState("");

  const [editingProd, setEditingProd] = useState(null);
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdPreview, setEditProdPreview] = useState("");

  const [isUploading, setIsUploading] = useState(false);

  // =====================================================
  // LOAD ALL DATA
  // =====================================================

  useEffect(() => {
    setProducts(INITIAL_PRODUCTS);
    loadCustomers();
    loadOrders();
  }, []);

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = () => {
    try {
      const savedUsers = localStorage.getItem("ethnicartUsers");

      if (!savedUsers) {
        setCustomers([]);
        return;
      }

      const users = JSON.parse(savedUsers);

      if (!Array.isArray(users)) {
        setCustomers([]);
        return;
      }

      const savedOrders = localStorage.getItem("ethnicartOrders");
      const allOrders = savedOrders ? JSON.parse(savedOrders) : [];

      const formattedUsers = users.map((user, index) => {
        const userEmail = String(user.email || "").toLowerCase();

        const userOrders = allOrders.filter((order) => {
          const orderEmail = String(
            order.customer?.email ||
              order.email ||
              ""
          ).toLowerCase();

          return orderEmail && orderEmail === userEmail;
        });

        const spent = userOrders.reduce(
          (sum, order) => sum + Number(order.total || 0),
          0
        );

        return {
          id: user.id || index + 1,
          name: user.name || "Unknown Customer",
          email: user.email || "Not provided",
          phone: user.phone || "Not provided",
          location: user.location || "Not provided",
          orders:
            user.orders !== undefined
              ? Number(user.orders)
              : userOrders.length,
          spent:
            user.spent !== undefined
              ? Number(user.spent)
              : spent,
          joined: user.joined || "Unknown",
        };
      });

      setCustomers(formattedUsers);
    } catch (error) {
      console.error("Failed to load customers:", error);
      setCustomers([]);
    }
  };

  // =====================================================
  // LOAD REAL ORDERS
  // =====================================================

  const loadOrders = () => {
    try {
      const savedOrders = localStorage.getItem("ethnicartOrders");

      if (!savedOrders) {
        setOrders(INITIAL_ORDERS);
        return;
      }

      const storedOrders = JSON.parse(savedOrders);

      if (!Array.isArray(storedOrders)) {
        setOrders(INITIAL_ORDERS);
        return;
      }

      const formattedOrders = storedOrders.map((order) => {
        const customerName =
          order.customer?.name ||
          order.customerName ||
          order.name ||
          order.customer?.email ||
          order.email ||
          "Unknown Customer";

        return {
          ...order,

          id:
            order.id ||
            `ORD-${Date.now()}`,

          customer: customerName,

          customerEmail:
            order.customer?.email ||
            order.customerEmail ||
            order.email ||
            "",

          itemsCount: Array.isArray(order.items)
            ? order.items.length
            : Number(order.items || 0),

          total: Number(order.total || 0),

          date:
            order.date ||
            new Date().toISOString(),

          status:
            order.status ||
            "Confirmed",
        };
      });

      setOrders(formattedOrders.reverse());
    } catch (error) {
      console.error("Failed to load orders:", error);
      setOrders(INITIAL_ORDERS);
    }
  };

  // =====================================================
  // TAB CHANGE
  // =====================================================

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);

    if (tab === "orders") {
      loadOrders();
    }

    if (tab === "customers") {
      loadCustomers();
    }
  };

  // =====================================================
  // LOGOUT
  // =====================================================

  const handleLogout = () => {
    localStorage.removeItem("adminAuth");
    navigate("/");
  };

  // =====================================================
  // ORDER STATUS
  // =====================================================

  const handleOrderStatusChange = (orderId, newStatus) => {
    try {
      const savedOrders =
        localStorage.getItem("ethnicartOrders");

      if (!savedOrders) return;

      const originalOrders = JSON.parse(savedOrders);

      const updatedOrders = originalOrders.map((order) =>
        String(order.id) === String(orderId)
          ? {
              ...order,
              status: newStatus,
            }
          : order
      );

      localStorage.setItem(
        "ethnicartOrders",
        JSON.stringify(updatedOrders)
      );

      loadOrders();
    } catch (error) {
      console.error(
        "Failed to update order status:",
        error
      );
    }
  };

  // =====================================================
  // DELETE PRODUCT
  // =====================================================

  const handleDeleteProduct = (id) => {
    setProducts((currentProducts) =>
      currentProducts.filter(
        (product) => product.id !== id
      )
    );
  };

  // =====================================================
  // CLOUDINARY UPLOAD
  // =====================================================

  const uploadImageToCloudinary = async (file) => {
    if (!file) return "";

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
        throw new Error(
          "Cloudinary upload failed"
        );
      }

      return data.secure_url;
    } catch (error) {
      console.error(error);

      return URL.createObjectURL(file);
    }
  };

  // =====================================================
  // ADD PRODUCT IMAGE
  // =====================================================

  const handleNewImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setNewProdFile(file);
    setNewProdPreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

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
        await uploadImageToCloudinary(
          newProdFile
        );
    }

    const createdProduct = {
      id: Date.now(),
      name: newProd.name,
      category: newProd.category,
      price: Number(newProd.price),
      stock: Number(newProd.stock),
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

  // =====================================================
  // OPEN EDIT
  // =====================================================

  const handleOpenEditModal = (product) => {
    setEditingProd({
      ...product,
    });

    setEditProdPreview(product.image);
    setEditProdFile(null);
    setShowEditModal(true);
  };

  // =====================================================
  // EDIT IMAGE
  // =====================================================

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];

    if (!file) return;

    setEditProdFile(file);
    setEditProdPreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (
      !editingProd?.name ||
      !editingProd?.price
    ) {
      return;
    }

    setIsUploading(true);

    let imageUrl = editingProd.image;

    if (editProdFile) {
      imageUrl =
        await uploadImageToCloudinary(
          editProdFile
        );
    }

    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === editingProd.id
          ? {
              ...editingProd,
              price: Number(
                editingProd.price
              ),
              stock: Number(
                editingProd.stock
              ),
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

  // =====================================================
  // DASHBOARD
  // =====================================================

  const totalRevenue = orders.reduce(
    (sum, order) =>
      sum + Number(order.total || 0),
    0
  );

  const totalStock = products.reduce(
    (sum, product) =>
      sum + Number(product.stock || 0),
    0
  );

  const topSellingProducts = [
    ...products,
  ]
    .sort(
      (a, b) =>
        Number(b.sales || 0) -
        Number(a.sales || 0)
    )
    .slice(0, 5);

  const bestProduct =
    topSellingProducts[0];

  // =====================================================
  // SALES DATA
  // =====================================================

  const weekData = Array(7).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.date);

    if (!isNaN(date.getTime())) {
      weekData[date.getDay()] +=
        Number(order.total || 0);
    }
  });

  const monthData = Array(12).fill(0);

  orders.forEach((order) => {
    const date = new Date(order.date);

    if (!isNaN(date.getTime())) {
      monthData[date.getMonth()] +=
        Number(order.total || 0);
    }
  });

  const yearData = {};

  orders.forEach((order) => {
    const date = new Date(order.date);

    if (!isNaN(date.getTime())) {
      const year =
        date.getFullYear();

      yearData[year] =
        (yearData[year] || 0) +
        Number(order.total || 0);
    }
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100 flex">

      {/* MOBILE BAR */}

      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-900 text-white p-3 flex items-center justify-between md:hidden">
        <div className="font-bold">
          Admin Panel
        </div>

        <button
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen
            )
          }
          className="bg-gray-800 px-3 py-2 rounded"
        >
          ☰
        </button>
      </div>

      {/* MOBILE BACKDROP */}

      {isMobileMenuOpen && (
        <div
          onClick={() =>
            setIsMobileMenuOpen(false)
          }
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white p-4 flex flex-col transition-transform duration-300 ${
          isMobileMenuOpen
            ? "translate-x-0"
            : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="text-xl font-bold border-b border-gray-800 pb-5 mb-5">
          🛍️ EthniCart
          <div className="text-xs text-gray-500 mt-1">
            Admin Panel
          </div>
        </div>

        <nav className="flex flex-col gap-2">

          <SidebarBtn
            label="Dashboard"
            icon="📊"
            active={
              activeTab === "dashboard"
            }
            onClick={() =>
              handleTabChange(
                "dashboard"
              )
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
              handleTabChange(
                "orders"
              )
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
              handleTabChange(
                "products"
              )
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
              handleTabChange(
                "customers"
              )
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

        <div className="mt-auto border-t border-gray-800 pt-4">
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Logout
          </button>
        </div>
      </aside>

      {/* MAIN */}

      <main className="flex-1 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">

        <header className="flex justify-between items-center mb-8 border-b pb-5">

          <h1 className="text-2xl font-bold uppercase">
            {activeTab}
          </h1>

          <a
            href="/"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Home
          </a>

        </header>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeTab === "dashboard" && (
          <div className="space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <StatCard
                title="Total Revenue"
                value={`₹${totalRevenue.toFixed(2)}`}
                trend="All orders"
                color="border-emerald-500"
              />

              <StatCard
                title="Total Orders"
                value={orders.length}
                trend="Store orders"
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
              <h2 className="text-xl font-bold mb-4">
                Recent Orders
              </h2>

              <OrdersTable
                orders={orders.slice(0, 5)}
                onStatusChange={
                  handleOrderStatusChange
                }
              />
            </div>

          </div>
        )}

        {/* =================================================
            ORDERS
        ================================================= */}

        {activeTab === "orders" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  All Store Orders
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Orders placed by customers
                </p>
              </div>

              <button
                onClick={loadOrders}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ↻ Refresh
              </button>

            </div>

            {orders.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <div className="text-5xl mb-4">
                  📦
                </div>

                <h3 className="text-xl font-bold">
                  No Orders Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Customer orders will appear here.
                </p>
              </div>
            ) : (
              <OrdersTable
                orders={orders}
                onStatusChange={
                  handleOrderStatusChange
                }
              />
            )}

          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {activeTab === "products" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Product Catalog
              </h2>

              <button
                onClick={() =>
                  setShowAddModal(true)
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                + Add Product
              </button>

            </div>

            <div className="bg-white rounded-xl border shadow-sm overflow-x-auto">

              <table className="w-full min-w-[700px]">

                <thead className="bg-gray-50">
                  <tr>
                    <th className="p-4 text-left">
                      Product
                    </th>

                    <th className="p-4 text-left">
                      Category
                    </th>

                    <th className="p-4 text-left">
                      Price
                    </th>

                    <th className="p-4 text-left">
                      Stock
                    </th>

                    <th className="p-4 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>

                  {products.map(
                    (product) => (
                      <tr
                        key={product.id}
                        className="border-t"
                      >

                        <td className="p-4">
                          <div className="flex items-center gap-3">

                            <img
                              src={
                                product.image
                              }
                              alt={
                                product.name
                              }
                              className="w-12 h-12 object-cover rounded-lg"
                            />

                            <span className="font-semibold">
                              {
                                product.name
                              }
                            </span>

                          </div>
                        </td>

                        <td className="p-4">
                          {
                            product.category
                          }
                        </td>

                        <td className="p-4 font-semibold">
                          ₹
                          {Number(
                            product.price
                          ).toFixed(2)}
                        </td>

                        <td className="p-4">
                          <span
                            className={
                              product.stock <
                              10
                                ? "text-red-600 font-semibold"
                                : "text-green-600 font-semibold"
                            }
                          >
                            {
                              product.stock
                            }{" "}
                            units
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
                              className="bg-blue-50 text-blue-600 px-3 py-2 rounded"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }
                              className="bg-red-50 text-red-600 px-3 py-2 rounded"
                            >
                              Delete
                            </button>

                          </div>

                        </td>

                      </tr>
                    )
                  )}

                </tbody>

              </table>

            </div>

            {showAddModal && (
              <ProductModal
                title="Add New Product"
                product={newProd}
                setProduct={
                  setNewProd
                }
                preview={
                  newProdPreview
                }
                onImageChange={
                  handleNewImageChange
                }
                onSubmit={
                  handleAddProduct
                }
                onClose={() =>
                  setShowAddModal(
                    false
                  )
                }
                uploading={
                  isUploading
                }
                isEdit={false}
              />
            )}

            {showEditModal &&
              editingProd && (
                <ProductModal
                  title="Edit Product"
                  product={
                    editingProd
                  }
                  setProduct={
                    setEditingProd
                  }
                  preview={
                    editProdPreview
                  }
                  onImageChange={
                    handleEditImageChange
                  }
                  onSubmit={
                    handleUpdateProduct
                  }
                  onClose={() => {
                    setShowEditModal(
                      false
                    );
                    setEditingProd(
                      null
                    );
                  }}
                  uploading={
                    isUploading
                  }
                  isEdit={true}
                />
              )}

          </div>
        )}

        {/* =================================================
            CUSTOMERS
        ================================================= */}

        {activeTab === "customers" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Registered Customers
                </h2>

                <p className="text-sm text-gray-500">
                  Real users registered on EthniCart
                </p>
              </div>

              <button
                onClick={loadCustomers}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ↻ Refresh
              </button>

            </div>

            {customers.length === 0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">

                <div className="text-5xl mb-4">
                  👥
                </div>

                <h3 className="text-xl font-bold">
                  No Customers Yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Registered users will appear here.
                </p>

              </div>
            ) : (
              <div className="bg-white rounded-xl border overflow-x-auto">

                <table className="w-full min-w-[850px]">

                  <thead className="bg-gray-50">
                    <tr>

                      <th className="p-4 text-left">
                        Customer
                      </th>

                      <th className="p-4 text-left">
                        Email
                      </th>

                      <th className="p-4 text-left">
                        Phone
                      </th>

                      <th className="p-4 text-left">
                        Location
                      </th>

                      <th className="p-4 text-left">
                        Orders
                      </th>

                      <th className="p-4 text-left">
                        Spent
                      </th>

                      <th className="p-4 text-left">
                        Joined
                      </th>

                    </tr>
                  </thead>

                  <tbody>

                    {customers.map(
                      (customer) => (
                        <tr
                          key={
                            customer.id
                          }
                          className="border-t hover:bg-gray-50"
                        >

                          <td className="p-4">

                            <div className="flex items-center gap-3">

                              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                {customer.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase()}
                              </div>

                              <span className="font-semibold">
                                {
                                  customer.name
                                }
                              </span>

                            </div>

                          </td>

                          <td className="p-4 text-sm text-gray-600">
                            {
                              customer.email
                            }
                          </td>

                          <td className="p-4 text-sm text-gray-600">
                            {
                              customer.phone
                            }
                          </td>

                          <td className="p-4 text-sm text-gray-600">
                            {
                              customer.location
                            }
                          </td>

                          <td className="p-4">
                            {
                              customer.orders
                            }
                          </td>

                          <td className="p-4 font-semibold">
                            ₹
                            {Number(
                              customer.spent ||
                                0
                            ).toFixed(
                              2
                            )}
                          </td>

                          <td className="p-4 text-sm text-gray-500">
                            {
                              customer.joined
                            }
                          </td>

                        </tr>
                      )
                    )}

                  </tbody>

                </table>

              </div>
            )}

          </div>
        )}

        {/* =================================================
            SALES
        ================================================= */}

        {activeTab === "sales" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <StatCard
                title="Monthly Sales"
                value={`₹${monthData[new Date().getMonth()].toFixed(2)}`}
                trend="Current month"
                color="border-blue-500"
                onClick={() =>
                  setSalesView(
                    "monthly"
                  )
                }
              />

              <StatCard
                title="Weekly Sales"
                value={`₹${weekData.reduce(
                  (a, b) =>
                    a + b,
                  0
                ).toFixed(2)}`}
                trend="All loaded orders"
                color="border-green-500"
                onClick={() =>
                  setSalesView(
                    "weekly"
                  )
                }
              />

              <StatCard
                title="Total Sales"
                value={`₹${totalRevenue.toFixed(2)}`}
                trend="All orders"
                color="border-purple-500"
                onClick={() =>
                  setSalesView(
                    "yearly"
                  )
                }
              />

            </div>

            <div className="flex gap-3">

              {[
                "weekly",
                "monthly",
                "yearly",
              ].map((type) => (
                <button
                  key={type}
                  onClick={() =>
                    setSalesView(
                      type
                    )
                  }
                  className={
                    salesView ===
                    type
                      ? "bg-blue-600 text-white px-4 py-2 rounded-lg"
                      : "bg-gray-200 px-4 py-2 rounded-lg"
                  }
                >
                  {type
                    .charAt(0)
                    .toUpperCase() +
                    type.slice(
                      1
                    )}
                </button>
              ))}

            </div>

            {salesView ===
              "weekly" && (
              <SalesBox
                title="Weekly Revenue"
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

            {salesView ===
              "monthly" && (
              <SalesBox
                title="Monthly Revenue"
                data={
                  monthData
                }
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

            {salesView ===
              "yearly" && (
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

            <div className="bg-white rounded-xl border p-6">

              <h2 className="text-lg font-bold mb-4">
                Top Selling Products
              </h2>

              {topSellingProducts.map(
                (product, index) => (
                  <div
                    key={
                      product.id
                    }
                    className="flex justify-between border-b py-3"
                  >
                    <span>
                      {index + 1}.{" "}
                      {
                        product.name
                      }
                    </span>

                    <span className="font-bold">
                      {
                        product.sales
                      }{" "}
                      Sold
                    </span>
                  </div>
                )
              )}

            </div>

          </div>
        )}

      </main>
    </div>
  );
}

// =====================================================
// SIDEBAR BUTTON
// =====================================================

function SidebarBtn({
  label,
  icon,
  active,
  onClick,
  badge,
}) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center justify-between px-3 py-3 rounded-lg text-sm font-medium text-left ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >
      <span>
        {icon} {label}
      </span>

      {badge !== undefined && (
        <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
}

// =====================================================
// STAT CARD
// =====================================================

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
      className={`bg-white p-5 rounded-xl border border-t-4 shadow-sm ${color} ${
        onClick
          ? "cursor-pointer hover:shadow-md"
          : ""
      }`}
    >
      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2">
        {value}
      </p>

      <p className="text-xs text-gray-500 mt-2">
        {trend}
      </p>
    </div>
  );
}

// =====================================================
// ORDERS TABLE
// =====================================================

function OrdersTable({
  orders,
  onStatusChange,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-x-auto">

      <table className="w-full min-w-[700px]">

        <thead className="bg-gray-50">
          <tr>

            <th className="p-4 text-left">
              Order ID
            </th>

            <th className="p-4 text-left">
              Customer
            </th>

            <th className="p-4 text-left">
              Date
            </th>

            <th className="p-4 text-left">
              Items
            </th>

            <th className="p-4 text-left">
              Total
            </th>

            <th className="p-4 text-left">
              Status
            </th>

          </tr>
        </thead>

        <tbody>

          {orders.map((order) => (
            <tr
              key={order.id}
              className="border-t"
            >

              <td className="p-4 font-bold">
                {order.id}
              </td>

              <td className="p-4">
                {order.customer}
              </td>

              <td className="p-4 text-gray-500">
                {order.date
                  ? new Date(
                      order.date
                    ).toLocaleDateString(
                      "en-IN"
                    )
                  : "Unknown"}
              </td>

              <td className="p-4">
                {order.itemsCount !==
                undefined
                  ? order.itemsCount
                  : order.items || 0}
              </td>

              <td className="p-4 font-bold">
                ₹
                {Number(
                  order.total || 0
                ).toFixed(2)}
              </td>

              <td className="p-4">

                <select
                  value={
                    order.status ||
                    "Confirmed"
                  }
                  onChange={(e) =>
                    onStatusChange(
                      order.id,
                      e.target.value
                    )
                  }
                  className="border rounded-lg px-3 py-2 text-sm"
                >

                  <option value="Pending">
                    Pending
                  </option>

                  <option value="Confirmed">
                    Confirmed
                  </option>

                  <option value="Processing">
                    Processing
                  </option>

                  <option value="Shipped">
                    Shipped
                  </option>

                  <option value="Delivered">
                    Delivered
                  </option>

                  <option value="Cancelled">
                    Cancelled
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

// =====================================================
// PRODUCT MODAL
// =====================================================

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
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md">

        <h2 className="text-xl font-bold mb-5">
          {title}
        </h2>

        <form
          onSubmit={onSubmit}
          className="space-y-4"
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
            onChange={
              onImageChange
            }
            className="w-full"
            required={!isEdit}
          />

          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover"
            />
          )}

          <select
            value={
              product.category
            }
            onChange={(e) =>
              setProduct({
                ...product,
                category:
                  e.target.value,
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
              value={
                product.price
              }
              onChange={(e) =>
                setProduct({
                  ...product,
                  price:
                    e.target.value,
                })
              }
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="number"
              placeholder="Stock"
              value={
                product.stock
              }
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock:
                    e.target.value,
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

// =====================================================
// SALES BOX
// =====================================================

function SalesBox({
  title,
  data,
  labels,
}) {
  return (
    <div className="bg-white rounded-xl shadow-sm border p-6">

      <h2 className="text-xl font-bold mb-5">
        {title}
      </h2>

      {labels.map(
        (label, index) => (
          <div
            key={`${label}-${index}`}
            className="flex justify-between border-b py-3"
          >

            <span>
              {label}
            </span>

            <span className="font-semibold">
              ₹
              {Number(
                data[index] || 0
              ).toFixed(2)}
            </span>

          </div>
        )
      )}

    </div>
  );
}