import { useEffect, useState } from "react";
import {
  FiMapPin,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiCheck,
  FiX,
  FiPhone,
  FiHome,
} from "react-icons/fi";

const ADDRESS_KEY = "ethnicart_addresses";

const emptyAddress = {
  id: null,
  name: "",
  phone: "",
  house: "",
  area: "",
  city: "",
  state: "",
  pincode: "",
  isDefault: false,
};

const Addresses = () => {
  const [addresses, setAddresses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyAddress);

  // =========================
  // LOAD ADDRESSES
  // =========================

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ADDRESS_KEY);

      if (!saved) return;

      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        setAddresses(parsed);
      }
    } catch (error) {
      console.error("Address loading error:", error);
    }
  }, []);

  // =========================
  // SAVE ADDRESSES
  // =========================

  const saveAddresses = (newAddresses) => {
    setAddresses(newAddresses);

    localStorage.setItem(
      ADDRESS_KEY,
      JSON.stringify(newAddresses)
    );
  };

  // =========================
  // ADD
  // =========================

  const openAddForm = () => {
    setEditingId(null);

    setFormData({
      ...emptyAddress,
      isDefault: addresses.length === 0,
    });

    setShowForm(true);
  };

  // =========================
  // EDIT
  // =========================

  const openEditForm = (address) => {
    setEditingId(address.id);

    setFormData({
      ...address,
    });

    setShowForm(true);
  };

  // =========================
  // CLOSE
  // =========================

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyAddress);
  };

  // =========================
  // INPUT
  // =========================

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =========================
  // SUBMIT
  // =========================

  const handleSubmit = (e) => {
    e.preventDefault();

    const name = formData.name.trim();
    const phone = formData.phone.trim();
    const house = formData.house.trim();
    const area = formData.area.trim();
    const city = formData.city.trim();
    const state = formData.state.trim();
    const pincode = formData.pincode.trim();

    if (!name) {
      alert("Please enter your full name.");
      return;
    }

    if (!/^[0-9]{10}$/.test(phone)) {
      alert("Please enter a valid 10-digit phone number.");
      return;
    }

    if (!house) {
      alert("Please enter house / flat / building.");
      return;
    }

    if (!city) {
      alert("Please enter city.");
      return;
    }

    if (!state) {
      alert("Please enter state.");
      return;
    }

    if (!/^[0-9]{6}$/.test(pincode)) {
      alert("Please enter a valid 6-digit pincode.");
      return;
    }

    const cleanAddress = {
      ...formData,
      name,
      phone,
      house,
      area,
      city,
      state,
      pincode,
    };

    let updatedAddresses;

    if (editingId !== null) {
      updatedAddresses = addresses.map((address) =>
        address.id === editingId
          ? {
              ...cleanAddress,
              id: editingId,
            }
          : address
      );
    } else {
      const newAddress = {
        ...cleanAddress,
        id: Date.now(),
      };

      updatedAddresses = [
        ...addresses,
        newAddress,
      ];
    }

    // Only one default address
    const selectedDefaultId =
      cleanAddress.isDefault
        ? cleanAddress.id || updatedAddresses[updatedAddresses.length - 1]?.id
        : null;

    if (selectedDefaultId) {
      updatedAddresses = updatedAddresses.map(
        (address) => ({
          ...address,
          isDefault:
            address.id === selectedDefaultId,
        })
      );
    }

    // Ensure first address is default
    if (
      updatedAddresses.length === 1 &&
      !updatedAddresses[0].isDefault
    ) {
      updatedAddresses[0].isDefault = true;
    }

    saveAddresses(updatedAddresses);
    closeForm();
  };

  // =========================
  // DELETE
  // =========================

  const deleteAddress = (id) => {
    const address = addresses.find(
      (item) => item.id === id
    );

    if (!address) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this address?"
    );

    if (!confirmed) return;

    let updatedAddresses = addresses.filter(
      (item) => item.id !== id
    );

    if (
      address.isDefault &&
      updatedAddresses.length > 0
    ) {
      updatedAddresses = updatedAddresses.map(
        (item, index) => ({
          ...item,
          isDefault: index === 0,
        })
      );
    }

    saveAddresses(updatedAddresses);
  };

  // =========================
  // MAKE DEFAULT
  // =========================

  const makeDefault = (id) => {
    const updatedAddresses = addresses.map(
      (address) => ({
        ...address,
        isDefault: address.id === id,
      })
    );

    saveAddresses(updatedAddresses);
  };

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* HEADER */}

        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5 mb-8">

          <div>
            <p className="text-[#C49A6C] uppercase tracking-[2.5px] text-[10px] sm:text-xs font-bold mb-2">
              Account
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Your Addresses
            </h1>

            <p className="text-gray-500 text-sm mt-2">
              Manage your delivery addresses.
            </p>
          </div>

          {!showForm && (
            <button
              type="button"
              onClick={openAddForm}
              className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#C49A6C] text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              <FiPlus size={17} />
              Add Address
            </button>
          )}
        </div>

        {/* FORM */}

        {showForm && (
          <div className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-7 mb-8">

            <div className="flex items-center justify-between mb-6">

              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId !== null
                    ? "Edit Address"
                    : "Add New Address"}
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Enter your complete delivery details.
                </p>
              </div>

              <button
                type="button"
                onClick={closeForm}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition"
              >
                <FiX size={17} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                <Input
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter full name"
                  required
                />

                <Input
                  label="Phone Number"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit phone number"
                  required
                  maxLength={10}
                />

                <div className="sm:col-span-2">
                  <Input
                    label="House / Flat / Building"
                    name="house"
                    value={formData.house}
                    onChange={handleChange}
                    placeholder="House no., flat, building..."
                    required
                  />
                </div>

                <Input
                  label="Area / Locality"
                  name="area"
                  value={formData.area}
                  onChange={handleChange}
                  placeholder="Area or locality"
                />

                <Input
                  label="City"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="City"
                  required
                />

                <Input
                  label="State"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  placeholder="State"
                  required
                />

                <Input
                  label="Pincode"
                  name="pincode"
                  value={formData.pincode}
                  onChange={handleChange}
                  placeholder="6-digit pincode"
                  required
                  maxLength={6}
                />
              </div>

              <label className="flex items-center gap-3 mt-5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.isDefault}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      isDefault: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-[#C49A6C]"
                />

                <span className="text-sm text-gray-700">
                  Make this my default address
                </span>
              </label>

              <div className="flex flex-col-reverse sm:flex-row gap-3 mt-7">

                <button
                  type="button"
                  onClick={closeForm}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border border-gray-200 text-gray-700 text-sm font-semibold hover:bg-gray-50 transition"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gray-900 hover:bg-[#C49A6C] text-white text-sm font-semibold transition"
                >
                  {editingId !== null
                    ? "Save Changes"
                    : "Save Address"}
                </button>

              </div>
            </form>
          </div>
        )}

        {/* ADDRESS LIST */}

        {addresses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {addresses.map((address) => (
              <div
                key={address.id}
                className="bg-white border border-gray-200 rounded-3xl p-5 sm:p-6 relative"
              >

                {address.isDefault && (
                  <div className="absolute top-5 right-5 inline-flex items-center gap-1.5 bg-[#C49A6C]/10 text-[#9B7045] px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide">
                    <FiCheck size={11} />
                    Default
                  </div>
                )}

                <div className="flex items-start gap-4 pr-16">

                  <div className="w-11 h-11 shrink-0 rounded-2xl bg-[#C49A6C]/10 flex items-center justify-center">
                    <FiMapPin
                      size={19}
                      className="text-[#C49A6C]"
                    />
                  </div>

                  <div className="min-w-0">

                    <h3 className="font-bold text-gray-900">
                      {address.name}
                    </h3>

                    <div className="flex items-center gap-2 text-gray-500 text-sm mt-1">
                      <FiPhone size={13} />
                      {address.phone}
                    </div>

                  </div>
                </div>

                <div className="mt-5">

                  <div className="flex items-start gap-2 text-sm text-gray-600 leading-6">

                    <FiHome
                      size={15}
                      className="mt-1 shrink-0 text-gray-400"
                    />

                    <div>
                      {address.house}

                      {address.area && (
                        <>
                          , {address.area}
                        </>
                      )}

                      <br />

                      {address.city}, {address.state} -{" "}
                      {address.pincode}
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3 mt-6 pt-5 border-t border-gray-100">

                  <button
                    type="button"
                    onClick={() =>
                      openEditForm(address)
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-[#C49A6C] transition"
                  >
                    <FiEdit2 size={15} />
                    Edit
                  </button>

                  <span className="w-px h-4 bg-gray-200" />

                  <button
                    type="button"
                    onClick={() =>
                      deleteAddress(address.id)
                    }
                    className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-red-500 transition"
                  >
                    <FiTrash2 size={15} />
                    Delete
                  </button>

                  {!address.isDefault && (
                    <>
                      <span className="w-px h-4 bg-gray-200" />

                      <button
                        type="button"
                        onClick={() =>
                          makeDefault(address.id)
                        }
                        className="text-sm font-semibold text-[#9B7045] hover:text-[#C49A6C] transition"
                      >
                        Make Default
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-3xl py-16 px-5 text-center">

            <div className="w-16 h-16 mx-auto rounded-full bg-[#C49A6C]/10 flex items-center justify-center">
              <FiMapPin
                size={25}
                className="text-[#C49A6C]"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mt-5">
              No saved addresses
            </h2>

            <p className="text-gray-500 text-sm mt-2">
              Add an address for faster checkout.
            </p>

            <button
              type="button"
              onClick={openAddForm}
              className="mt-6 inline-flex items-center gap-2 bg-gray-900 hover:bg-[#C49A6C] text-white px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              <FiPlus size={17} />
              Add Your First Address
            </button>
          </div>
        )}
      </section>
    </main>
  );
};

const Input = ({
  label,
  name,
  value,
  onChange,
  placeholder,
  required = false,
  maxLength,
}) => {
  return (
    <div>
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}

        {required && (
          <span className="text-red-400 ml-1">
            *
          </span>
        )}
      </label>

      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        maxLength={maxLength}
        className="w-full h-12 px-4 rounded-xl border border-gray-200 bg-gray-50 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:bg-white focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10 transition"
      />
    </div>
  );
};

export default Addresses;