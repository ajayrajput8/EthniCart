import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getProducts,
  saveProducts,
} from "../../data/productStorage";

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
  const [isMobileMenuOpen, setIsMobileMenuOpen] =
    useState(false);
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);

  const [showAddModal, setShowAddModal] =
    useState(false);
  const [showEditModal, setShowEditModal] =
    useState(false);

  const [newProd, setNewProd] = useState({
    name: "",
    category: "Tops",
    price: "",
    stock: "",
  });

  const [newProdFile, setNewProdFile] =
    useState(null);
  const [newProdPreview, setNewProdPreview] =
    useState("");

  const [editingProd, setEditingProd] =
    useState(null);
  const [editProdFile, setEditProdFile] =
    useState(null);
  const [editProdPreview, setEditProdPreview] =
    useState("");

  const [isUploading, setIsUploading] =
    useState(false);

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    const storedProducts = getProducts();

    setProducts(
      Array.isArray(storedProducts) &&
        storedProducts.length > 0
        ? storedProducts
        : INITIAL_PRODUCTS
    );

    loadCustomers();
    loadOrders();
  }, []);

  // =====================================================
  // LOAD CUSTOMERS
  // =====================================================

  const loadCustomers = () => {
    try {
      const savedUsers =
        localStorage.getItem("ethnicartUsers");

      if (!savedUsers) {
        setCustomers([]);
        return;
      }

      const users = JSON.parse(savedUsers);

      if (!Array.isArray(users)) {
        setCustomers([]);
        return;
      }

      const savedOrders =
        localStorage.getItem("ethnicartOrders");

      const allOrders = savedOrders
        ? JSON.parse(savedOrders)
        : [];

      const formattedUsers = users.map(
        (user, index) => {
          const userEmail = String(
            user.email || ""
          ).toLowerCase();

          const userOrders = allOrders.filter(
            (order) => {
              const orderEmail = String(
                order.customer?.email ||
                  order.email ||
                  ""
              ).toLowerCase();

              return (
                orderEmail &&
                orderEmail === userEmail
              );
            }
          );

          const spent =
            userOrders.reduce(
              (sum, order) =>
                sum +
                Number(
                  order.total || 0
                ),
              0
            );

          return {
            id:
              user.id ||
              index + 1,

            name:
              user.name ||
              "Unknown Customer",

            email:
              user.email ||
              "Not provided",

            phone:
              user.phone ||
              "Not provided",

            location:
              user.location ||
              "Not provided",

            orders:
              user.orders !== undefined
                ? Number(user.orders)
                : userOrders.length,

            spent:
              user.spent !== undefined
                ? Number(user.spent)
                : spent,

            joined:
              user.joined ||
              "Unknown",
          };
        }
      );

      setCustomers(formattedUsers);
    } catch (error) {
      console.error(
        "Failed to load customers:",
        error
      );

      setCustomers([]);
    }
  };

  // =====================================================
  // LOAD ORDERS
  // =====================================================

  const loadOrders = () => {
    try {
      const savedOrders =
        localStorage.getItem(
          "ethnicartOrders"
        );

      if (!savedOrders) {
        setOrders(INITIAL_ORDERS);
        return;
      }

      const storedOrders =
        JSON.parse(savedOrders);

      if (!Array.isArray(storedOrders)) {
        setOrders(INITIAL_ORDERS);
        return;
      }

      const formattedOrders =
        storedOrders.map((order) => {
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

            customer:
              customerName,

            customerEmail:
              order.customer?.email ||
              order.customerEmail ||
              order.email ||
              "",

            itemsCount:
              Array.isArray(order.items)
                ? order.items.length
                : Number(
                    order.items || 0
                  ),

            total: Number(
              order.total || 0
            ),

            date:
              order.date ||
              new Date().toISOString(),

            status:
              order.status ||
              "Confirmed",
          };
        });

      setOrders(
        [...formattedOrders].reverse()
      );
    } catch (error) {
      console.error(
        "Failed to load orders:",
        error
      );

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

  const handleOrderStatusChange = (
    orderId,
    newStatus
  ) => {
    try {
      const savedOrders =
        localStorage.getItem(
          "ethnicartOrders"
        );

      if (!savedOrders) return;

      const originalOrders =
        JSON.parse(savedOrders);

      const updatedOrders =
        originalOrders.map((order) =>
          String(order.id) ===
          String(orderId)
            ? {
                ...order,
                status: newStatus,
              }
            : order
        );

      localStorage.setItem(
        "ethnicartOrders",
        JSON.stringify(
          updatedOrders
        )
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
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmed) return;

    setProducts((currentProducts) => {
      const updated =
        currentProducts.filter(
          (product) =>
            product.id !== id
        );

      saveProducts(updated);

      return updated;
    });
  };

  // =====================================================
  // CLOUDINARY
  // =====================================================

  const uploadImageToCloudinary =
    async (file) => {
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

        const data =
          await response.json();

        if (
          !response.ok ||
          !data.secure_url
        ) {
          throw new Error(
            "Cloudinary upload failed"
          );
        }

        return data.secure_url;
      } catch (error) {
        console.error(error);

        return URL.createObjectURL(
          file
        );
      }
    };

  // =====================================================
  // ADD IMAGE
  // =====================================================

  const handleNewImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setNewProdFile(file);

    setNewProdPreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // ADD PRODUCT
  // =====================================================

  const handleAddProduct = async (
    e
  ) => {
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

      category:
        newProd.category,

      price: Number(
        newProd.price
      ),

      stock: Number(
        newProd.stock
      ),

      sales: 0,

      image: imageUrl,
    };

    setProducts(
      (currentProducts) => {
        const updated = [
          ...currentProducts,
          createdProduct,
        ];

        saveProducts(updated);

        return updated;
      }
    );

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

  const handleOpenEditModal = (
    product
  ) => {
    setEditingProd({
      ...product,
    });

    setEditProdPreview(
      product.image
    );

    setEditProdFile(null);

    setShowEditModal(true);
  };

  // =====================================================
  // EDIT IMAGE
  // =====================================================

  const handleEditImageChange = (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file) return;

    setEditProdFile(file);

    setEditProdPreview(
      URL.createObjectURL(file)
    );
  };

  // =====================================================
  // UPDATE PRODUCT
  // =====================================================

  const handleUpdateProduct =
    async (e) => {
      e.preventDefault();

      if (
        !editingProd?.name ||
        !editingProd?.price
      ) {
        return;
      }

      setIsUploading(true);

      let imageUrl =
        editingProd.image;

      if (editProdFile) {
        imageUrl =
          await uploadImageToCloudinary(
            editProdFile
          );
      }

      setProducts(
        (currentProducts) => {
          const updated =
            currentProducts.map(
              (product) =>
                product.id ===
                editingProd.id
                  ? {
                      ...editingProd,

                      price: Number(
                        editingProd.price
                      ),

                      stock: Number(
                        editingProd.stock
                      ),

                      image:
                        imageUrl,
                    }
                  : product
            );

          saveProducts(updated);

          return updated;
        }
      );

      setIsUploading(false);

      setShowEditModal(false);

      setEditingProd(null);

      setEditProdFile(null);

      setEditProdPreview("");
    };

  // =====================================================
  // DASHBOARD DATA
  // =====================================================

  const totalRevenue =
    orders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.total || 0
        ),
      0
    );

  const totalStock =
    products.reduce(
      (sum, product) =>
        sum +
        Number(
          product.stock || 0
        ),
      0
    );

  const topSellingProducts =
    [...products]
      .sort(
        (a, b) =>
          Number(
            b.sales || 0
          ) -
          Number(
            a.sales || 0
          )
      )
      .slice(0, 5);

  // =====================================================
  // SALES DATA
  // =====================================================

  const weekData =
    Array(7).fill(0);

  orders.forEach((order) => {
    const date =
      new Date(order.date);

    if (
      !isNaN(date.getTime())
    ) {
      weekData[
        date.getDay()
      ] += Number(
        order.total || 0
      );
    }
  });

  const monthData =
    Array(12).fill(0);

  orders.forEach((order) => {
    const date =
      new Date(order.date);

    if (
      !isNaN(date.getTime())
    ) {
      monthData[
        date.getMonth()
      ] += Number(
        order.total || 0
      );
    }
  });

  const yearData = {};

  orders.forEach((order) => {
    const date =
      new Date(order.date);

    if (
      !isNaN(date.getTime())
    ) {
      const year =
        date.getFullYear();

      yearData[year] =
        (yearData[year] || 0) +
        Number(
          order.total || 0
        );
    }
  });

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* MOBILE BAR */}

      <div className="fixed top-0 left-0 right-0 z-40 bg-gray-950 text-white p-3 flex items-center justify-between md:hidden">

        <div className="font-bold">
          🛍️ EthniCart
        </div>

        <button
          onClick={() =>
            setIsMobileMenuOpen(
              !isMobileMenuOpen
            )
          }
          className="bg-gray-800 px-3 py-2 rounded-lg"
        >
          ☰
        </button>

      </div>

      {/* MOBILE BACKDROP */}

      {isMobileMenuOpen && (
        <div
          onClick={() =>
            setIsMobileMenuOpen(
              false
            )
          }
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      {/* SIDEBAR */}

      <aside
        className={`fixed md:static inset-y-0 left-0 z-40 w-64 bg-gray-950 text-white p-4 flex flex-col transition-transform duration-300 ${
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
              activeTab ===
              "dashboard"
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
            badge={
              orders.length
            }
            active={
              activeTab ===
              "orders"
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
            badge={
              products.length
            }
            active={
              activeTab ===
              "products"
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
            badge={
              customers.length
            }
            active={
              activeTab ===
              "customers"
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
              activeTab ===
              "sales"
            }
            onClick={() =>
              handleTabChange(
                "sales"
              )
            }
          />

        </nav>

        <div className="mt-auto border-t border-gray-800 pt-4">

          <button
            onClick={
              handleLogout
            }
            className="text-gray-400 hover:text-white text-sm"
          >
            ← Logout
          </button>

        </div>

      </aside>

      {/* MAIN */}

      <main className="flex-1 min-w-0 p-4 md:p-8 pt-20 md:pt-8 overflow-y-auto">

        {/* HEADER */}

        <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8 border-b pb-5">

          <div>
            <p className="text-xs uppercase tracking-[3px] text-gray-400">
              EthniCart Admin
            </p>

            <h1 className="text-2xl font-bold uppercase mt-1">
              {activeTab}
            </h1>
          </div>

          <a
            href="/"
            className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold text-center"
          >
            View Store
          </a>

        </header>

        {/* =================================================
            DASHBOARD
        ================================================= */}

        {activeTab ===
          "dashboard" && (
          <div className="space-y-8">

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <StatCard
                title="Total Revenue"
                value={`₹${totalRevenue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
                trend="All orders"
                color="border-emerald-500"
              />

              <StatCard
                title="Total Orders"
                value={
                  orders.length
                }
                trend="Store orders"
                color="border-blue-500"
              />

              <StatCard
                title="Total Products"
                value={
                  products.length
                }
                trend={`${totalStock} items in stock`}
                color="border-amber-500"
              />

              <StatCard
                title="Total Customers"
                value={
                  customers.length
                }
                trend="Registered users"
                color="border-purple-500"
              />

            </div>

            <div>

              <h2 className="text-xl font-bold mb-4">
                Recent Orders
              </h2>

              <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">

                <OrdersTable
                  orders={orders.slice(
                    0,
                    5
                  )}
                  onStatusChange={
                    handleOrderStatusChange
                  }
                />

              </div>

            </div>

          </div>
        )}

        {/* =================================================
            PROFESSIONAL ORDERS
        ================================================= */}

        {activeTab ===
          "orders" && (
          <AdminOrdersSection
            orders={orders}
            onStatusChange={
              handleOrderStatusChange
            }
            onRefresh={
              loadOrders
            }
          />
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {activeTab ===
          "products" && (
          <div>

            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Product Catalog
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Manage your store products.
                </p>
              </div>

              <button
                onClick={() =>
                  setShowAddModal(
                    true
                  )
                }
                className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold"
              >
                + Add Product
              </button>

            </div>

            <div className="bg-white rounded-2xl border shadow-sm overflow-x-auto">

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
                        key={
                          product.id
                        }
                        className="border-t hover:bg-gray-50"
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
                          ).toFixed(
                            2
                          )}
                        </td>

                        <td className="p-4">

                          <span
                            className={
                              Number(
                                product.stock
                              ) <
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
                              className="bg-blue-50 text-blue-600 px-3 py-2 rounded-lg font-medium"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() =>
                                handleDeleteProduct(
                                  product.id
                                )
                              }
                              className="bg-red-50 text-red-600 px-3 py-2 rounded-lg font-medium"
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
                product={
                  newProd
                }
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

        {activeTab ===
          "customers" && (
          <CustomersSection
            customers={
              customers
            }
            onRefresh={
              loadCustomers
            }
          />
        )}

        {/* =================================================
            SALES
        ================================================= */}

        {activeTab ===
          "sales" && (
          <div className="space-y-6">

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <StatCard
                title="Monthly Sales"
                value={`₹${monthData[
                  new Date().getMonth()
                ].toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
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
                value={`₹${weekData
                  .reduce(
                    (a, b) =>
                      a + b,
                    0
                  )
                  .toLocaleString(
                    "en-IN",
                    {
                      minimumFractionDigits: 2,
                    }
                  )}`}
                trend="Loaded orders"
                color="border-green-500"
                onClick={() =>
                  setSalesView(
                    "weekly"
                  )
                }
              />

              <StatCard
                title="Total Sales"
                value={`₹${totalRevenue.toLocaleString(
                  "en-IN",
                  {
                    minimumFractionDigits: 2,
                  }
                )}`}
                trend="All orders"
                color="border-purple-500"
                onClick={() =>
                  setSalesView(
                    "yearly"
                  )
                }
              />

            </div>

            <div className="flex gap-2 flex-wrap">

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
                      ? "bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold"
                      : "bg-white border px-4 py-2 rounded-lg font-semibold"
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

            <div className="bg-white border rounded-2xl p-6">

              {salesView ===
                "weekly" && (
                <SalesBox
                  title="Weekly Revenue"
                  data={
                    weekData
                  }
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

            </div>

            <div className="bg-white rounded-2xl border p-6">

              <h2 className="text-lg font-bold mb-4">
                Top Selling Products
              </h2>

              {topSellingProducts.map(
                (
                  product,
                  index
                ) => (
                  <div
                    key={
                      product.id
                    }
                    className="flex justify-between border-b last:border-0 py-3"
                  >
                    <span>
                      {index +
                        1}
                      .{" "}
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
// PROFESSIONAL ORDERS SECTION
// =====================================================

function AdminOrdersSection({
  orders,
  onStatusChange,
  onRefresh,
}) {
  const [search, setSearch] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [selectedOrder, setSelectedOrder] =
    useState(null);

  const statusOptions = [
    "All",
    "Pending",
    "Confirmed",
    "Processing",
    "Shipped",
    "Delivered",
    "Cancelled",
  ];

  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-50 text-yellow-700 border-yellow-200";

      case "Confirmed":
        return "bg-blue-50 text-blue-700 border-blue-200";

      case "Processing":
        return "bg-purple-50 text-purple-700 border-purple-200";

      case "Shipped":
        return "bg-indigo-50 text-indigo-700 border-indigo-200";

      case "Delivered":
        return "bg-green-50 text-green-700 border-green-200";

      case "Cancelled":
        return "bg-red-50 text-red-700 border-red-200";

      default:
        return "bg-gray-50 text-gray-700 border-gray-200";
    }
  };

  const canCancelOrder = (
    status
  ) => {
    return (
      status !== "Shipped" &&
      status !== "Delivered" &&
      status !== "Cancelled"
    );
  };

  const handleCancelOrder = (
    order
  ) => {
    if (
      !canCancelOrder(
        order.status
      )
    ) {
      return;
    }

    const confirmed =
      window.confirm(
        `Cancel order ${order.id}?\n\nThis will mark the order as Cancelled.`
      );

    if (!confirmed) return;

    onStatusChange(
      order.id,
      "Cancelled"
    );

    setSelectedOrder(null);
  };

  const filteredOrders =
    orders.filter((order) => {
      const status =
        order.status ||
        "Confirmed";

      const customerName =
        typeof order.customer ===
        "string"
          ? order.customer
          : order.customer?.name ||
            "";

      const customerEmail =
        order.customer?.email ||
        order.customerEmail ||
        order.email ||
        "";

      const searchText =
        search
          .toLowerCase()
          .trim();

      const matchesSearch =
        !searchText ||
        String(order.id || "")
          .toLowerCase()
          .includes(
            searchText
          ) ||
        customerName
          .toLowerCase()
          .includes(
            searchText
          ) ||
        customerEmail
          .toLowerCase()
          .includes(
            searchText
          );

      const matchesStatus =
        statusFilter ===
          "All" ||
        status ===
          statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });

  return (
    <div className="space-y-6">

      {/* HEADER */}

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Store Orders
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Manage customer orders and delivery status.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="w-fit bg-gray-900 text-white px-5 py-2.5 rounded-xl text-sm font-semibold hover:bg-gray-800 transition"
        >
          ↻ Refresh Orders
        </button>

      </div>

      {/* SEARCH */}

      <div className="bg-white border rounded-2xl p-4 shadow-sm">

        <div className="grid grid-cols-1 md:grid-cols-[1fr_220px] gap-3">

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔎
            </span>

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
              placeholder="Search order ID, customer or email..."
              className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />

          </div>

          <select
            value={
              statusFilter
            }
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          >

            {statusOptions.map(
              (status) => (
                <option
                  key={status}
                  value={status}
                >
                  {status ===
                  "All"
                    ? "All Status"
                    : status}
                </option>
              )
            )}

          </select>

        </div>

        <div className="flex items-center justify-between mt-4 text-sm">

          <p className="text-gray-500">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {
                filteredOrders.length
              }
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">
              {orders.length}
            </span>{" "}
            orders
          </p>

          {(search ||
            statusFilter !==
              "All") && (
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter(
                  "All"
                );
              }}
              className="text-blue-600 font-semibold hover:underline"
            >
              Clear Filters
            </button>
          )}

        </div>

      </div>

      {/* ORDERS */}

      {filteredOrders.length ===
      0 ? (
        <div className="bg-white border rounded-2xl p-12 text-center">

          <div className="text-5xl mb-4">
            📦
          </div>

          <h3 className="text-xl font-bold">
            No Orders Found
          </h3>

          <p className="text-gray-500 mt-2">
            Try changing your search or status filter.
          </p>

        </div>
      ) : (
        <div className="space-y-4">

          {filteredOrders.map(
            (order) => {
              const status =
                order.status ||
                "Confirmed";

              const customerName =
                typeof order.customer ===
                "string"
                  ? order.customer
                  : order.customer
                      ?.name ||
                    "Unknown Customer";

              const customerEmail =
                order.customer
                  ?.email ||
                order.customerEmail ||
                order.email ||
                "No email";

              const items =
                Array.isArray(
                  order.items
                )
                  ? order.items
                  : [];

              return (
                <div
                  key={
                    order.id
                  }
                  className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition overflow-hidden"
                >

                  {/* ORDER TOP */}

                  <div className="p-5 border-b">

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                      <div className="flex items-start gap-4">

                        <div className="w-11 h-11 rounded-xl bg-blue-50 flex items-center justify-center text-xl">
                          📦
                        </div>

                        <div>

                          <p className="text-xs text-gray-500 uppercase tracking-wide">
                            Order ID
                          </p>

                          <p className="font-bold text-gray-900">
                            {
                              order.id
                            }
                          </p>

                          <p className="text-xs text-gray-500 mt-1">
                            {order.date
                              ? new Date(
                                  order.date
                                ).toLocaleString(
                                  "en-IN"
                                )
                              : "Unknown date"}
                          </p>

                        </div>

                      </div>

                      <div className="flex flex-wrap items-center gap-3">

                        <span
                          className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusStyle(
                            status
                          )}`}
                        >
                          {
                            status
                          }
                        </span>

                        <span className="text-lg font-bold text-gray-900">
                          ₹
                          {Number(
                            order.total ||
                              0
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </span>

                      </div>

                    </div>

                  </div>

                  {/* ORDER BODY */}

                  <div className="p-5">

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                      {/* CUSTOMER */}

                      <div>

                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                          Customer
                        </p>

                        <div className="flex items-center gap-3">

                          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                            {customerName
                              .charAt(
                                0
                              )
                              .toUpperCase()}
                          </div>

                          <div>

                            <p className="font-semibold text-gray-900">
                              {
                                customerName
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              {
                                customerEmail
                              }
                            </p>

                            {order
                              .customer
                              ?.phone && (
                              <p className="text-xs text-gray-500 mt-1">
                                {
                                  order
                                    .customer
                                    .phone
                                }
                              </p>
                            )}

                          </div>

                        </div>

                      </div>

                      {/* ITEMS */}

                      <div className="lg:col-span-2">

                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-3">
                          Order Items
                        </p>

                        {items.length >
                        0 ? (
                          <div className="space-y-2">

                            {items
                              .slice(
                                0,
                                3
                              )
                              .map(
                                (
                                  item,
                                  index
                                ) => (
                                  <div
                                    key={
                                      item.id ||
                                      `${order.id}-${index}`
                                    }
                                    className="flex items-center justify-between gap-3 bg-gray-50 rounded-xl p-2.5"
                                  >

                                    <div className="flex items-center gap-3 min-w-0">

                                      {item.image ? (
                                        <img
                                          src={
                                            item.image
                                          }
                                          alt={
                                            item.name
                                          }
                                          className="w-12 h-12 rounded-lg object-cover"
                                        />
                                      ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                                          📦
                                        </div>
                                      )}

                                      <div className="min-w-0">

                                        <p className="font-semibold text-sm text-gray-900 truncate">
                                          {
                                            item.name
                                          }
                                        </p>

                                        <p className="text-xs text-gray-500">
                                          Qty:{" "}
                                          {item.quantity ||
                                            1}
                                        </p>

                                      </div>

                                    </div>

                                    <p className="font-semibold text-sm whitespace-nowrap">
                                      ₹
                                      {(
                                        Number(
                                          item.price ||
                                            0
                                        ) *
                                        Number(
                                          item.quantity ||
                                            1
                                        )
                                      ).toLocaleString(
                                        "en-IN"
                                      )}
                                    </p>

                                  </div>
                                )
                              )}

                            {items.length >
                              3 && (
                              <p className="text-xs text-gray-500">
                                +
                                {items.length -
                                  3}{" "}
                                more item(s)
                              </p>
                            )}

                          </div>
                        ) : (
                          <p className="text-sm text-gray-500">
                            No item details available.
                          </p>
                        )}

                      </div>

                    </div>

                  </div>

                  {/* FOOTER */}

                  <div className="bg-gray-50 border-t px-5 py-4">

                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">

                      <div className="flex flex-wrap gap-2">

                        <span className="text-xs bg-white border px-3 py-1.5 rounded-lg text-gray-600">
                          Payment:{" "}
                          <b>
                            {order.payment ===
                            "online"
                              ? "Online"
                              : "COD"}
                          </b>
                        </span>

                        <span className="text-xs bg-white border px-3 py-1.5 rounded-lg text-gray-600">
                          Items:{" "}
                          <b>
                            {items.length ||
                              order.itemsCount ||
                              0}
                          </b>
                        </span>

                      </div>

                      <div className="flex flex-wrap gap-2">

                        {/* STATUS */}

                        <select
                          value={
                            status
                          }
                          onChange={(
                            e
                          ) =>
                            onStatusChange(
                              order.id,
                              e.target
                                .value
                            )
                          }
                          disabled={
                            status ===
                            "Cancelled"
                          }
                          className="border bg-white rounded-lg px-3 py-2 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                        >

                          {statusOptions
                            .filter(
                              (
                                item
                              ) =>
                                item !==
                                "All"
                            )
                            .map(
                              (
                                item
                              ) => (
                                <option
                                  key={
                                    item
                                  }
                                  value={
                                    item
                                  }
                                >
                                  {
                                    item
                                  }
                                </option>
                              )
                            )}

                        </select>

                        {/* VIEW */}

                        <button
                          onClick={() =>
                            setSelectedOrder(
                              order
                            )
                          }
                          className="bg-white border border-gray-200 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-100 transition"
                        >
                          View
                        </button>

                        {/* CANCEL */}

                        {canCancelOrder(
                          status
                        ) && (
                          <button
                            onClick={() =>
                              handleCancelOrder(
                                order
                              )
                            }
                            className="bg-red-50 text-red-600 border border-red-100 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-100 transition"
                          >
                            Cancel
                          </button>
                        )}

                      </div>

                    </div>

                  </div>

                </div>
              );
            }
          )}

        </div>
      )}

      {/* =================================================
          ORDER DETAIL MODAL
      ================================================= */}

      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

          <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">

            <div className="p-5 border-b flex items-center justify-between">

              <div>

                <p className="text-xs text-gray-500 uppercase">
                  Order Details
                </p>

                <h3 className="text-xl font-bold">
                  {
                    selectedOrder.id
                  }
                </h3>

              </div>

              <button
                onClick={() =>
                  setSelectedOrder(
                    null
                  )
                }
                className="w-9 h-9 rounded-full bg-gray-100 hover:bg-gray-200"
              >
                ✕
              </button>

            </div>

            <div className="p-5 space-y-6">

              {/* STATUS */}

              <div className="flex justify-between items-center">

                <span className="text-gray-500">
                  Order Status
                </span>

                <span
                  className={`px-3 py-1.5 rounded-full border text-xs font-bold ${getStatusStyle(
                    selectedOrder.status ||
                      "Confirmed"
                  )}`}
                >
                  {
                    selectedOrder.status ||
                    "Confirmed"
                  }
                </span>

              </div>

              {/* CUSTOMER */}

              <div>

                <h4 className="font-bold mb-3">
                  Customer
                </h4>

                <div className="bg-gray-50 rounded-xl p-4 text-sm space-y-1">

                  <p className="font-semibold">
                    {typeof selectedOrder.customer ===
                    "string"
                      ? selectedOrder.customer
                      : selectedOrder
                          .customer
                          ?.name ||
                        "Unknown Customer"}
                  </p>

                  <p className="text-gray-500">
                    {selectedOrder
                      .customer
                      ?.email ||
                      selectedOrder.customerEmail ||
                      selectedOrder.email ||
                      "No email"}
                  </p>

                  {selectedOrder
                    .customer
                    ?.phone && (
                    <p className="text-gray-500">
                      {
                        selectedOrder
                          .customer
                          .phone
                      }
                    </p>
                  )}

                </div>

              </div>

              {/* PRODUCTS */}

              <div>

                <h4 className="font-bold mb-3">
                  Ordered Products
                </h4>

                <div className="space-y-3">

                  {selectedOrder.items?.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={
                          item.id ||
                          index
                        }
                        className="flex items-center justify-between border rounded-xl p-3"
                      >

                        <div className="flex items-center gap-3">

                          {item.image ? (
                            <img
                              src={
                                item.image
                              }
                              alt={
                                item.name
                              }
                              className="w-14 h-14 rounded-lg object-cover"
                            />
                          ) : (
                            <div className="w-14 h-14 bg-gray-100 rounded-lg flex items-center justify-center">
                              📦
                            </div>
                          )}

                          <div>

                            <p className="font-semibold text-sm">
                              {
                                item.name
                              }
                            </p>

                            <p className="text-xs text-gray-500">
                              Qty:{" "}
                              {item.quantity ||
                                1}
                            </p>

                          </div>

                        </div>

                        <p className="font-bold">
                          ₹
                          {(
                            Number(
                              item.price ||
                                0
                            ) *
                            Number(
                              item.quantity ||
                                1
                            )
                          ).toLocaleString(
                            "en-IN"
                          )}
                        </p>

                      </div>
                    )
                  )}

                </div>

              </div>

              {/* ADDRESS */}

              {selectedOrder
                .customer && (
                <div>

                  <h4 className="font-bold mb-3">
                    Delivery Address
                  </h4>

                  <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-600 leading-6">

                    <p>
                      {
                        selectedOrder
                          .customer
                          .address
                      }
                    </p>

                    <p>
                      {
                        selectedOrder
                          .customer
                          .city
                      }
                      ,{" "}
                      {
                        selectedOrder
                          .customer
                          .state
                      }
                    </p>

                    <p>
                      PIN:{" "}
                      {
                        selectedOrder
                          .customer
                          .pincode
                      }
                    </p>

                  </div>

                </div>
              )}

              {/* TOTAL */}

              <div className="border-t pt-5 flex justify-between">

                <span className="text-gray-500">
                  Order Total
                </span>

                <span className="text-xl font-bold">
                  ₹
                  {Number(
                    selectedOrder.total ||
                      0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </span>

              </div>

              {/* CANCEL */}

              {canCancelOrder(
                selectedOrder.status ||
                  "Confirmed"
              ) && (
                <button
                  onClick={() =>
                    handleCancelOrder(
                      selectedOrder
                    )
                  }
                  className="w-full bg-red-50 text-red-600 border border-red-100 py-3 rounded-xl font-semibold hover:bg-red-100 transition"
                >
                  ✕ Cancel This Order
                </button>
              )}

            </div>

          </div>

        </div>
      )}

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
      className={`flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-left transition ${
        active
          ? "bg-gray-800 text-white"
          : "text-gray-400 hover:bg-gray-800 hover:text-white"
      }`}
    >

      <span>
        {icon}{" "}
        {label}
      </span>

      {badge !==
        undefined && (
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
      className={`bg-white p-5 rounded-2xl border border-t-4 shadow-sm ${color} ${
        onClick
          ? "cursor-pointer hover:shadow-md"
          : ""
      }`}
    >

      <p className="text-sm text-gray-500">
        {title}
      </p>

      <p className="text-2xl font-bold mt-2 text-gray-900">
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
  const getStatusStyle = (
    status
  ) => {
    switch (status) {
      case "Delivered":
        return "bg-green-50 text-green-700";

      case "Cancelled":
        return "bg-red-50 text-red-700";

      case "Shipped":
        return "bg-indigo-50 text-indigo-700";

      case "Processing":
        return "bg-purple-50 text-purple-700";

      default:
        return "bg-blue-50 text-blue-700";
    }
  };

  return (
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

        {orders.map(
          (order) => (
            <tr
              key={
                order.id
              }
              className="border-t"
            >

              <td className="p-4 font-bold">
                {order.id}
              </td>

              <td className="p-4">
                {typeof order.customer ===
                "string"
                  ? order.customer
                  : order.customer
                      ?.name ||
                    "Unknown"}
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
                {order.itemsCount ||
                  order.items ||
                  0}
              </td>

              <td className="p-4 font-bold">
                ₹
                {Number(
                  order.total ||
                    0
                ).toLocaleString(
                  "en-IN"
                )}
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
                      e.target
                        .value
                    )
                  }
                  className={`border-0 rounded-full px-3 py-2 text-xs font-bold ${getStatusStyle(
                    order.status ||
                      "Confirmed"
                  )}`}
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
          )
        )}

      </tbody>

    </table>
  );
}

// =====================================================
// CUSTOMERS
// =====================================================

function CustomersSection({
  customers,
  onRefresh,
}) {
  return (
    <div>

      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">

        <div>

          <h2 className="text-xl font-bold">
            Registered Customers
          </h2>

          <p className="text-sm text-gray-500 mt-1">
            Real users registered on EthniCart.
          </p>

        </div>

        <button
          onClick={onRefresh}
          className="bg-blue-600 text-white px-4 py-2.5 rounded-xl font-semibold"
        >
          ↻ Refresh
        </button>

      </div>

      {customers.length ===
      0 ? (
        <div className="bg-white rounded-2xl border p-12 text-center">

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
        <div className="bg-white rounded-2xl border overflow-x-auto">

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
                      ).toLocaleString(
                        "en-IN"
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
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">

      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">

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
            value={
              product.name
            }
            onChange={(e) =>
              setProduct({
                ...product,
                name: e.target
                  .value,
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
            className="w-full text-sm"
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

          <div className="flex justify-end gap-3 pt-2">

            <button
              type="button"
              onClick={
                onClose
              }
              disabled={
                uploading
              }
              className="bg-gray-100 px-4 py-2 rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={
                uploading
              }
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
  const maxValue =
    Math.max(
      ...data.map(
        (value) =>
          Number(value) || 0
      ),
      1
    );

  return (
    <div>

      <h2 className="text-xl font-bold mb-6">
        {title}
      </h2>

      <div className="space-y-4">

        {labels.map(
          (label, index) => {
            const value =
              Number(
                data[index] || 0
              );

            const width =
              (value /
                maxValue) *
              100;

            return (
              <div
                key={`${label}-${index}`}
              >

                <div className="flex justify-between text-sm mb-1">

                  <span className="font-medium">
                    {label}
                  </span>

                  <span className="font-semibold">
                    ₹
                    {value.toLocaleString(
                      "en-IN",
                      {
                        minimumFractionDigits: 2,
                      }
                    )}
                  </span>

                </div>

                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">

                  <div
                    className="h-full bg-blue-600 rounded-full transition-all"
                    style={{
                      width: `${width}%`,
                    }}
                  />

                </div>

              </div>
            );
          }
        )}

      </div>

    </div>
  );
}