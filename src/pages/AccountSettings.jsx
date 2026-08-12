import { useContext, useEffect, useState } from "react";
import {
  FiUser,
  FiMail,
  FiPhone,
  FiLock,
  FiShield,
  FiLogOut,
  FiChevronRight,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";

import { AuthContext } from "../context/AuthContext";

const AccountSettings = () => {
  const { user, updateUser, logout } =
    useContext(AuthContext);

  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");

  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // =========================
  // SYNC USER DATA
  // =========================

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
    setLocation(user?.location || "");
  }, [user]);

  // =========================
  // SAVE PROFILE
  // =========================

  const handleSave = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const cleanName = name.trim();
    const cleanPhone = phone.trim();
    const cleanLocation = location.trim();

    if (!cleanName) {
      setError("Name is required.");
      return;
    }

    if (!cleanPhone) {
      setError("Phone number is required.");
      return;
    }

    if (!/^[0-9]{10}$/.test(cleanPhone)) {
      setError(
        "Please enter a valid 10-digit phone number."
      );
      return;
    }

    if (!cleanLocation) {
      setError("Location is required.");
      return;
    }

    setSaving(true);

    try {
      const result = await updateUser({
        name: cleanName,
        phone: cleanPhone,
        location: cleanLocation,
      });

      if (!result?.success) {
        setError(
          result?.message ||
            "Unable to update profile."
        );
        return;
      }

      setMessage(
        "Your profile has been updated successfully."
      );
    } catch (err) {
      console.error(
        "Account settings update error:",
        err
      );

      setError(
        "Something went wrong while updating your profile."
      );
    } finally {
      setSaving(false);
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================

  const handleChangePassword = () => {
    navigate("/profile?password=true");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  // =========================
  // LOGIN CHECK
  // =========================

  if (!user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#FAF9F7]">
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">

        {/* HEADER */}

        <div className="mb-8">

          <p className="text-[#C49A6C] uppercase tracking-[2.5px] text-[10px] sm:text-xs font-bold mb-2">
            Account
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">
            Account Settings
          </h1>

          <p className="text-gray-500 text-sm mt-2">
            Manage your personal information and account security.
          </p>

        </div>

        {/* PERSONAL INFORMATION */}

        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden">

          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                <FiUser
                  size={18}
                  className="text-[#C49A6C]"
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Personal Information
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Update your account details
                </p>
              </div>

            </div>
          </div>

          <form
            onSubmit={handleSave}
            className="p-5 sm:p-7"
          >

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

              <SettingInput
                label="Full Name"
                icon={<FiUser size={16} />}
                value={name}
                onChange={(e) =>
                  setName(e.target.value)
                }
              />

              <SettingInput
                label="Phone Number"
                icon={<FiPhone size={16} />}
                value={phone}
                onChange={(e) =>
                  setPhone(
                    e.target.value.replace(
                      /\D/g,
                      ""
                    ).slice(0, 10)
                  )
                }
              />

              <SettingInput
                label="Email Address"
                icon={<FiMail size={16} />}
                value={user.email || ""}
                readOnly
              />

              <SettingInput
                label="Location"
                icon={<FiUser size={16} />}
                value={location}
                onChange={(e) =>
                  setLocation(e.target.value)
                }
              />

            </div>

            {message && (
              <div className="flex items-center gap-2 mt-5 p-3 rounded-xl bg-green-50 border border-green-100 text-green-700 text-sm">
                <FiCheck size={16} />
                {message}
              </div>
            )}

            {error && (
              <div className="mt-5 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end mt-6">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center gap-2 bg-gray-900 hover:bg-[#C49A6C] text-white px-6 py-3 rounded-xl text-sm font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>

            </div>
          </form>
        </div>

        {/* SECURITY */}

        <div className="bg-white border border-gray-200 rounded-3xl mt-5 overflow-hidden">

          <div className="px-5 sm:px-7 py-5 border-b border-gray-100">

            <div className="flex items-center gap-3">

              <div className="w-10 h-10 rounded-xl bg-[#C49A6C]/10 flex items-center justify-center">
                <FiShield
                  size={18}
                  className="text-[#C49A6C]"
                />
              </div>

              <div>
                <h2 className="font-bold text-gray-900">
                  Login & Security
                </h2>

                <p className="text-xs text-gray-500 mt-0.5">
                  Keep your account secure
                </p>
              </div>

            </div>
          </div>

          <div>

            <button
              type="button"
              onClick={handleChangePassword}
              className="group w-full flex items-center gap-4 px-5 sm:px-7 py-5 text-left hover:bg-gray-50 transition"
            >

              <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center">
                <FiLock
                  size={17}
                  className="text-gray-600"
                />
              </div>

              <div className="flex-1">

                <p className="text-sm font-semibold text-gray-900">
                  Change Password
                </p>

                <p className="text-xs text-gray-500 mt-1">
                  Update your account password
                </p>

              </div>

              <FiChevronRight
                size={18}
                className="text-gray-400 group-hover:text-[#C49A6C]"
              />

            </button>
          </div>
        </div>

        {/* ACCOUNT STATUS */}

        <div className="bg-white border border-gray-200 rounded-3xl mt-5 p-5 sm:p-7">

          <div className="flex items-center justify-between gap-4">

            <div>
              <h2 className="font-bold text-gray-900">
                Account Status
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Your EthniCart account is active.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-xs font-bold">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
              Active
            </div>

          </div>
        </div>

        {/* LOGOUT */}

        <div className="bg-white border border-red-100 rounded-3xl mt-5 p-5 sm:p-7">

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">

            <div>
              <h2 className="font-bold text-gray-900">
                Sign Out
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Sign out from your EthniCart account on this device.
              </p>
            </div>

            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-2 border border-red-200 text-red-600 hover:bg-red-50 px-5 py-3 rounded-xl text-sm font-semibold transition"
            >
              <FiLogOut size={16} />
              Sign Out
            </button>

          </div>
        </div>

      </section>
    </main>
  );
};

const SettingInput = ({
  label,
  icon,
  value,
  onChange,
  readOnly = false,
}) => {
  return (
    <div>

      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>

      <div className="relative">

        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
          {icon}
        </span>

        <input
          type="text"
          value={value}
          onChange={onChange}
          readOnly={readOnly}
          className={`w-full h-12 pl-11 pr-4 rounded-xl border text-sm text-gray-900 outline-none transition ${
            readOnly
              ? "border-gray-200 bg-gray-100 text-gray-500 cursor-not-allowed"
              : "border-gray-200 bg-gray-50 focus:bg-white focus:border-[#C49A6C] focus:ring-2 focus:ring-[#C49A6C]/10"
          }`}
        />

      </div>
    </div>
  );
};

export default AccountSettings;