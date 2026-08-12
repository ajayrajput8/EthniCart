import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FiHelpCircle,
  FiPackage,
  FiCreditCard,
  FiMapPin,
  FiUser,
  FiMail,
  FiPhone,
  FiChevronDown,
  FiMessageCircle,
  FiArrowLeft,
  FiSearch,
  FiSend,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";

const HelpSupport = () => {
  const [openFaq, setOpenFaq] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const [formData, setFormData] = useState({
    category: "",
    orderNumber: "",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");
  const [submitError, setSubmitError] = useState("");

  const faqs = [
    {
      category: "Orders & Delivery",
      question: "How can I track my order?",
      answer:
        "Go to Your Orders from your account. Select the order you want to track to view its current status and order details.",
    },
    {
      category: "Orders & Delivery",
      question: "How can I cancel my order?",
      answer:
        "If your order has not been shipped yet, contact our support team with your order details. We will help you with the cancellation.",
    },
    {
      category: "Delivery Address",
      question: "How can I change my delivery address?",
      answer:
        "You can manage your saved addresses from Your Addresses in your account. For an already placed order, contact support as soon as possible.",
    },
    {
      category: "Payments",
      question: "What payment methods are supported?",
      answer:
        "EthniCart supports the payment methods currently available during checkout. Available options will be shown on the checkout page.",
    },
    {
      category: "Account",
      question: "I forgot my password. What should I do?",
      answer:
        "Go to the Login page and use the available password recovery option. You can also contact support if you need further assistance.",
    },
    {
      category: "Account",
      question: "How can I update my profile?",
      answer:
        "Open your Account page and select Edit Profile. You can update your name, phone number and location from there.",
    },
    {
      category: "Orders & Delivery",
      question: "What should I do if my order has not arrived?",
      answer:
        "Open Your Orders and check the latest order status. If the expected delivery date has passed, contact support with your order number.",
    },
    {
      category: "Payments",
      question: "My payment failed. What should I do?",
      answer:
        "Check your payment details and try again. If money was deducted but the order was not created, contact support with your payment/order details.",
    },
    {
      category: "Delivery Address",
      question: "Can I add a new delivery address?",
      answer:
        "Yes. Open Your Addresses from your account and add a new delivery address.",
    },
    {
      category: "Account",
      question: "How can I change my password?",
      answer:
        "Go to your Account page and open Login & Security. You can change your password by entering your current password and a new password.",
    },
  ];

  const supportOptions = [
    {
      icon: FiPackage,
      title: "Orders & Delivery",
      description: "Track, cancel or get help with your order.",
    },
    {
      icon: FiCreditCard,
      title: "Payments",
      description: "Get help with payment or checkout issues.",
    },
    {
      icon: FiMapPin,
      title: "Delivery Address",
      description: "Manage or update your delivery information.",
    },
    {
      icon: FiUser,
      title: "Account",
      description: "Get help with your profile and account.",
    },
  ];

  const categories = [
    "All",
    "Orders & Delivery",
    "Payments",
    "Delivery Address",
    "Account",
  ];

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setSearchQuery("");
    setOpenFaq(null);

    setTimeout(() => {
      document.getElementById("faq-section")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 50);
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory =
      selectedCategory === "All" ||
      faq.category === selectedCategory;

    const query = searchQuery.trim().toLowerCase();

    const matchesSearch =
      !query ||
      faq.question.toLowerCase().includes(query) ||
      faq.answer.toLowerCase().includes(query) ||
      faq.category.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    setSubmitMessage("");
    setSubmitError("");
  };

  const handleSubmitSupport = async (e) => {
    e.preventDefault();

    setSubmitMessage("");
    setSubmitError("");

    const category = formData.category.trim();
    const orderNumber = formData.orderNumber.trim();
    const message = formData.message.trim();

    if (!category) {
      setSubmitError("Please select a support category.");
      return;
    }

    if (!message) {
      setSubmitError("Please describe your problem.");
      return;
    }

    if (message.length < 10) {
      setSubmitError(
        "Please provide a little more detail about your problem."
      );
      return;
    }

    setSubmitting(true);

    try {
      const existingRequests = JSON.parse(
        localStorage.getItem("ethnicart_support_requests") || "[]"
      );

      const newRequest = {
        id: `SUP-${Date.now()}`,
        category,
        orderNumber: orderNumber || null,
        message,
        status: "Open",
        createdAt: new Date().toISOString(),
      };

      localStorage.setItem(
        "ethnicart_support_requests",
        JSON.stringify([newRequest, ...existingRequests])
      );

      setFormData({
        category: "",
        orderNumber: "",
        message: "",
      });

      setSubmitMessage(
        `Support request submitted successfully. Reference ID: ${newRequest.id}`
      );
    } catch (error) {
      console.error("Support request error:", error);

      setSubmitError(
        "Unable to submit your request. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      {/* HEADER */}
      <section className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#C49A6C] transition mb-6"
          >
            <FiArrowLeft size={16} />
            Back to Account
          </Link>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center shrink-0">
              <FiHelpCircle
                size={25}
                className="text-[#C49A6C]"
              />
            </div>

            <div>
              <p className="text-[#C49A6C] uppercase tracking-[2.5px] text-[10px] sm:text-xs font-bold mb-2">
                Support
              </p>

              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
                Help & Support
              </h1>

              <p className="text-gray-500 text-sm mt-2 max-w-xl">
                Find answers to common questions or contact
                our support team for help with your EthniCart
                account and orders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* SUPPORT CATEGORIES */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {supportOptions.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.title}
                type="button"
                onClick={() => handleCategoryClick(item.title)}
                className="bg-white border border-gray-200 rounded-2xl p-5 text-left hover:border-[#C49A6C]/50 hover:shadow-sm transition"
              >
                <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center mb-4">
                  <Icon
                    size={19}
                    className="text-[#C49A6C]"
                  />
                </div>

                <h2 className="font-bold text-gray-900">
                  {item.title}
                </h2>

                <p className="text-sm text-gray-500 mt-1 leading-5">
                  {item.description}
                </p>

                <span className="inline-block text-xs text-[#C49A6C] font-semibold mt-3">
                  View related help →
                </span>
              </button>
            );
          })}
        </div>

        {/* FAQ */}
        <div
          id="faq-section"
          className="bg-white border border-gray-200 rounded-3xl overflow-hidden scroll-mt-6"
        >
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Search or select a category to find your answer.
            </p>

            {/* SEARCH */}
            <div className="relative mt-5">
              <FiSearch
                size={18}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
              />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) =>
                  setSearchQuery(e.target.value)
                }
                placeholder="Search your question..."
                className="w-full border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C]"
              />
            </div>

            {/* CATEGORY FILTER */}
            <div className="flex gap-2 overflow-x-auto pb-1 mt-4">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() =>
                    setSelectedCategory(category)
                  }
                  className={`whitespace-nowrap px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition ${
                    selectedCategory === category
                      ? "bg-[#C49A6C] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-[#C49A6C]/10 hover:text-[#C49A6C]"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          <div>
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => {
                const isOpen = openFaq === index;

                return (
                  <div
                    key={faq.question}
                    className="border-b border-gray-100 last:border-b-0"
                  >
                    <button
                      type="button"
                      onClick={() => toggleFaq(index)}
                      className="w-full flex items-center justify-between gap-4 px-5 sm:px-7 py-5 text-left hover:bg-[#FAF9F7] transition"
                    >
                      <div className="min-w-0">
                        <span className="block text-sm sm:text-base font-semibold text-gray-900">
                          {faq.question}
                        </span>

                        <span className="inline-block text-[10px] uppercase tracking-wide text-[#C49A6C] font-semibold mt-2">
                          {faq.category}
                        </span>
                      </div>

                      <FiChevronDown
                        size={19}
                        className={`shrink-0 text-gray-400 transition-transform duration-200 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {isOpen && (
                      <div className="px-5 sm:px-7 pb-5">
                        <p className="text-sm text-gray-500 leading-6 max-w-3xl">
                          {faq.answer}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })
            ) : (
              <div className="px-5 sm:px-7 py-10 text-center">
                <FiHelpCircle
                  size={32}
                  className="mx-auto text-gray-300"
                />

                <h3 className="font-semibold text-gray-900 mt-3">
                  No results found
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Try another search or select a different
                  category.
                </p>

                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("All");
                  }}
                  className="mt-4 text-sm font-semibold text-[#C49A6C] hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* CONTACT SUPPORT */}
        <div className="bg-white border border-gray-200 rounded-3xl mt-6 overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900">
              Contact Support
            </h2>

            <p className="text-sm text-gray-500 mt-1">
              Still need help? Get in touch with our support
              team.
            </p>
          </div>

          <div className="p-5 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <a
              href="mailto:vijaysinghdarbarr@gmail.com?subject=EthniCart%20Support%20Request"
              className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:border-[#C49A6C] hover:bg-[#FAF9F7] transition"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center shrink-0">
                <FiMail
                  size={19}
                  className="text-[#C49A6C]"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Email Support
                </p>

                <p className="text-sm text-gray-500 mt-1 break-all">
                  vijaysinghdarbarr@gmail.com
                </p>
              </div>
            </a>

            <a
              href="tel:+916265316424"
              className="flex items-center gap-4 border border-gray-200 rounded-2xl p-4 hover:border-[#C49A6C] hover:bg-[#FAF9F7] transition"
            >
              <div className="w-11 h-11 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center shrink-0">
                <FiPhone
                  size={19}
                  className="text-[#C49A6C]"
                />
              </div>

              <div>
                <p className="font-semibold text-gray-900">
                  Call Support
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  +91 62653 16424
                </p>
              </div>
            </a>
          </div>
        </div>

        {/* SUPPORT REQUEST FORM */}
        <div className="bg-white border border-gray-200 rounded-3xl mt-6 overflow-hidden">
          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                <FiMessageCircle
                  size={19}
                  className="text-[#C49A6C]"
                />
              </div>

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Send a Support Request
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Tell us what you need help with.
                </p>
              </div>
            </div>
          </div>

          <form
            onSubmit={handleSubmitSupport}
            className="p-5 sm:p-7"
          >
            {submitMessage && (
              <div className="mb-5 flex gap-3 rounded-xl bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-700">
                <FiCheckCircle
                  size={18}
                  className="shrink-0 mt-0.5"
                />

                <span>{submitMessage}</span>
              </div>
            )}

            {submitError && (
              <div className="mb-5 flex gap-3 rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600">
                <FiAlertCircle
                  size={18}
                  className="shrink-0 mt-0.5"
                />

                <span>{submitError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* CATEGORY */}
              <div>
                <label
                  htmlFor="support-category"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  What do you need help with?
                </label>

                <select
                  id="support-category"
                  name="category"
                  value={formData.category}
                  onChange={handleFormChange}
                  disabled={submitting}
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm bg-white outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                >
                  <option value="">
                    Select a category
                  </option>

                  {supportOptions.map((item) => (
                    <option
                      key={item.title}
                      value={item.title}
                    >
                      {item.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* ORDER NUMBER */}
              <div>
                <label
                  htmlFor="support-order"
                  className="block text-sm font-semibold text-gray-700 mb-2"
                >
                  Order Number
                  <span className="font-normal text-gray-400">
                    {" "}
                    (optional)
                  </span>
                </label>

                <input
                  id="support-order"
                  type="text"
                  name="orderNumber"
                  value={formData.orderNumber}
                  onChange={handleFormChange}
                  disabled={submitting}
                  placeholder="e.g. ORD-123456"
                  className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
                />
              </div>
            </div>

            {/* MESSAGE */}
            <div className="mt-4">
              <label
                htmlFor="support-message"
                className="block text-sm font-semibold text-gray-700 mb-2"
              >
                Describe your problem
              </label>

              <textarea
                id="support-message"
                name="message"
                value={formData.message}
                onChange={handleFormChange}
                disabled={submitting}
                rows={5}
                maxLength={1000}
                placeholder="Tell us what happened and how we can help..."
                className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-[#C49A6C] focus:ring-1 focus:ring-[#C49A6C] disabled:bg-gray-100"
              />

              <div className="flex justify-end mt-1">
                <span className="text-xs text-gray-400">
                  {formData.message.length}/1000
                </span>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={submitting}
              className="mt-4 w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#C49A6C] hover:bg-[#b4885c] text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <FiSend size={16} />
                  Submit Request
                </>
              )}
            </button>
          </form>
        </div>

        {/* ORDER HELP */}
        <div className="mt-6 bg-gray-900 rounded-3xl p-6 sm:p-8 text-white">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div>
              <div className="flex items-center gap-3">
                <FiMessageCircle size={20} />

                <h2 className="text-lg font-bold">
                  Need help with an order?
                </h2>
              </div>

              <p className="text-gray-300 text-sm mt-2">
                Check your orders and find the details you
                need.
              </p>
            </div>

            <Link
              to="/orders"
              className="inline-flex items-center justify-center gap-2 bg-[#C49A6C] hover:bg-[#b4885c] text-white px-5 py-3 rounded-xl text-sm font-semibold transition shrink-0"
            >
              View Orders
              <FiPackage size={16} />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default HelpSupport;