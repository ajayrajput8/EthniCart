import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

const INITIAL_PRODUCTS = [];

const INITIAL_ORDERS = [];

const INITIAL_CUSTOMERS = [];

export default function AdminLayout() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [salesView, setSalesView] = useState("weekly");

  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState(INITIAL_ORDERS);
  const [customers, setCustomers] = useState([]);
  const [loadingCustomers, setLoadingCustomers] = useState(false);

  // Form & Image Upload States
  const [newProd, setNewProd] = useState({ name: "", price: "", oldPrice: "", category: "", rating: "" });
  const [newProdFile, setNewProdFile] = useState(null);
  const [newProdPreview, setNewProdPreview] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);

  const [editingProd, setEditingProd] = useState(null);
  const [editProdFile, setEditProdFile] = useState(null);
  const [editProdPreview, setEditProdPreview] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

  const [isUploading, setIsUploading] =
    useState(false);

  //GET USERS FROM BACKEND
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoadingCustomers(true);

        /*const token = localStorage.getItem("token");

        if (!token) {
          console.error("No authentication token found");
          return;
        }*/

        const response = await fetch(
          "http://localhost:8000/api/users",
          {
            method: "GET",
            headers: {
              //Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        console.log("Fetch customers response:", response);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch users");
        }

        setCustomers(data.users || []);
      } catch (error) {
        console.error("Fetch customers error:", error);
      } finally {
        setLoadingCustomers(false);
      }
    };

    fetchCustomers();
  }, []);

  //GET PRODUCTS FROM BACKEND
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:8000/api/products");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch products");
        }

        setProducts(data.products);
      } catch (error) {
        console.error("Fetch products error:", error);
      }
    };
    fetchProducts();
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

  const handleDeleteProduct = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${"http://localhost:8000/api/products"}/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete product"
        );
      }

      setProducts((prev) =>
        prev.filter((product) => product._id !== id)
      );

      console.log(data.message);

    } catch (error) {
      console.error("Delete product error:", error);
      alert(error.message);
    }
  };

  // =====================================================
  // CLOUDINARY UPLOAD
  // =====================================================

  const uploadImageToCloudinary =
    async (file) => {
      if (!file) return "";

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "upload_preset",
        CLOUDINARY_UPLOAD_PRESET
      );

      try {
        const response =
          await fetch(
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
        console.error(
          "Cloudinary upload error:",
          error
        );

        return URL.createObjectURL(
          file
        );
      }
    };

  // =====================================================
  // ADD PRODUCT IMAGE
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

  // ADD PRODUCT SUBMIT
  const handleAddProduct = async (e) => {
    e.preventDefault();

    if (!newProd.name || !newProd.price || !newProdFile || !newProd.category) {
      alert("Name, price and image are required");
      return;
    }

    try {
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

    // UPDATE + SAVE
    setProducts(
      (currentProducts) => {
        const updatedProducts = [
          ...currentProducts,
          createdProduct,
        ];

        saveProducts(
          updatedProducts
        );

        return updatedProducts;
      }
    );

      setNewProd({
        name: "",
        price: "",
        oldPrice: "",
        rating: "",
        category: "",
      });

      setNewProdFile(null);
      setNewProdPreview("");

      setShowAddModal(false);

    } catch (error) {
      console.error("Add product error:", error);
      alert(error.message);
    } finally {
      setIsUploading(false);
    }
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

  // UPDATE PRODUCT SUBMIT
  const handleUpdateProduct = async (e) => {
    e.preventDefault();

    if (!editingProd.name || !editingProd.price || !editingProd.category) {
      alert("Name, price and category are required");
      return;
    }

    try {
      setIsUploading(true);

      let imageUrl =
        editingProd.image;

      if (editProdFile) {
        imageUrl =
          await uploadImageToCloudinary(
            editProdFile
          );
      }

      // UPDATE + SAVE
      setProducts(
        (currentProducts) => {
          const updatedProducts =
            currentProducts.map(
              (product) =>
                product.id ===
                editingProd.id
                  ? {
                      ...editingProd,
                      price:
                        Number(
                          editingProd.price
                        ),
                      stock:
                        Number(
                          editingProd.stock
                        ),
                      image:
                        imageUrl,
                    }
                  : product
            );

          saveProducts(
            updatedProducts
          );

          return updatedProducts;
        }
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

  const topSellingProducts = [
    ...products,
  ]
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

  const bestProduct = topSellingProducts[0];

  // ---------- WEEKLY ----------
  const weekData = Array(7).fill(0);
  orders.forEach((order) => {
    const date =
      new Date(order.date);

    if (
      !isNaN(
        date.getTime()
      )
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
      !isNaN(
        date.getTime()
      )
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
      !isNaN(
        date.getTime()
      )
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

      {/* 2. BACKDROP OVERLAY FOR MOBILE */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/50 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* 3. SIDEBAR */}
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

        <nav className="flex flex-col gap-1 flex-1 mt-4 md:mt-0">
          <SidebarBtn label="Dashboard" active={activeTab === "dashboard"} onClick={() => handleTabChange("dashboard")} icon="📊" />
          <SidebarBtn label="Orders" active={activeTab === "orders"} onClick={() => handleTabChange("orders")} badge={orders.length} icon="📦" />
          <SidebarBtn label="Products" active={activeTab === "products"} onClick={() => handleTabChange("products")} badge={products.length} icon="🏷️" />
          <SidebarBtn label="Customers" active={activeTab === "customers"} onClick={() => handleTabChange("customers")} badge={customers.length} icon="👥" />
          <SidebarBtn label="Sales" active={activeTab === "sales"} onClick={() => handleTabChange("sales")} icon="📈" />
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

        {/* 1. DASHBOARD VIEW */}
        {/* 1. DASHBOARD VIEW */}
        {activeTab === "dashboard" && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">

              <StatCard
                title="Total Revenue"
                value={`₹${totalRevenue.toFixed(
                  2
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

              <div className="bg-white rounded-xl border overflow-x-auto">
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
            ORDERS
        ================================================= */}

        {activeTab ===
          "orders" && (
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
                onClick={
                  loadOrders
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ↻ Refresh
              </button>

            </div>

            {orders.length ===
            0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">
                <div className="text-5xl mb-4">
                  📦
                </div>

                <h3 className="text-xl font-bold">
                  No Orders Found
                </h3>

                <p className="text-gray-500 mt-2">
                  Customer orders
                  will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border overflow-x-auto">
                <OrdersTable
                  orders={orders}
                  onStatusChange={
                    handleOrderStatusChange
                  }
                />
              </div>
            )}

          </div>
        )}

        {/* =================================================
            PRODUCTS
        ================================================= */}

        {activeTab ===
          "products" && (
          <div>

            <div className="flex justify-between items-center mb-6">

              <h2 className="text-xl font-bold">
                Product Catalog
              </h2>

              <button
                onClick={() =>
                  setShowAddModal(
                    true
                  )
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                <span>+</span> Add New Product
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
                        key={
                          product.id
                        }
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

            {/* ADD MODAL */}

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

            {/* EDIT MODAL */}

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
          <div>

            <div className="flex justify-between items-center mb-6">

              <div>
                <h2 className="text-xl font-bold">
                  Registered Customers
                </h2>

                <p className="text-sm text-gray-500">
                  Real users registered on
                  EthniCart
                </p>
              </div>

              <button
                onClick={
                  loadCustomers
                }
                className="bg-blue-600 text-white px-4 py-2 rounded-lg"
              >
                ↻ Refresh
              </button>

            </div>

            {customers.length ===
            0 ? (
              <div className="bg-white rounded-xl border p-12 text-center">

                <div className="text-5xl mb-4">
                  👥
                </div>

                <h3 className="text-xl font-bold">
                  No Customers Yet
                </h3>

                <p className="text-gray-500 mt-2">
                  Registered users
                  will appear here.
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
                      (
                        customer
                      ) => (
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

        {/* 5. SALES VIEW */}
        {activeTab === "sales" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">

              <StatCard
                title="Monthly Sales"
                value={`₹${monthData[
                  new Date().getMonth()
                ].toFixed(2)}`}
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
                  .toFixed(2)}`}
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
                value={`₹${totalRevenue.toFixed(
                  2
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

            <div className="flex gap-3">

              {[
                "weekly",
                "monthly",
                "yearly",
              ].map(
                (type) => (
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
                      .charAt(
                        0
                      )
                      .toUpperCase() +
                      type.slice(
                        1
                      )}
                  </button>
                )
              )}

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

            <div className="bg-white rounded-xl border p-6">

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
                    className="flex justify-between border-b py-3"
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
                        product.sales ||
                        0
                      }{" "}
                      Sold
                    </span>

                  </div>
                )
              )}

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

// --- SUB-COMPONENTS ---
function SidebarBtn({ label, active, onClick, badge, icon }) {
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

function StatCard({ title, value, trend, color, onClick }) {
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
                {
                  order.id
                }
              </td>

              <td className="p-4">
                {
                  order.customer
                }
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
                  : order.items ||
                    0}
              </td>

              <td className="p-4 font-bold">
                ₹
                {Number(
                  order.total ||
                    0
                ).toFixed(
                  2
                )}
              </td>

              <td className="p-4">

                <select
                  value={
                    order.status ||
                    "Confirmed"
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
          )
        )}

      </tbody>

    </table>
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

      <div className="bg-white rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">

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
              min="0"
              placeholder="Price"
              value={
                product.price
              }
              onChange={(e) =>
                setProduct({
                  ...product,
                  price:
                    e.target
                      .value,
                })
              }
              className="border rounded-lg px-3 py-2"
              required
            />

            <input
              type="number"
              min="0"
              placeholder="Stock"
              value={
                product.stock
              }
              onChange={(e) =>
                setProduct({
                  ...product,
                  stock:
                    e.target
                      .value,
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
  return (
    <div className="bg-white rounded-xl border p-6">

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
                data[index] ||
                  0
              ).toFixed(2)}
            </span>

          </div>
        )
      )}

    </div>
  );
}