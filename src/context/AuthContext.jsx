import { createContext, useState } from "react";

export const AuthContext = createContext();

const API_URL = "http://localhost:8000/api";

const AuthProvider = ({ children }) => {
  // =========================
  // CURRENT LOGGED IN USER
  // =========================
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ethnicartUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // =========================
  // REGISTER
  // =========================
  const register = async (
    name,
    phone,
    location,
    email,
    password
  ) => {
    try {
      const response = await fetch(`${API_URL}/users/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          phone,
          location,
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Registration failed.",
        };
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "ethnicartUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error("Register error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };

  // =========================
  // LOGIN
  // =========================
  const login = async (phone, password) => {
    try {
      const response = await fetch(`${API_URL}/users/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phone,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Invalid phone or password.",
        };
      }

      localStorage.setItem("token", data.token);

      localStorage.setItem(
        "ethnicartUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return {
        success: true,
        user: data.user,
        token: data.token,
      };
    } catch (error) {
      console.error("Login error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("ethnicartUser");

    setUser(null);
  };

  // =========================
  // UPDATE USER
  // =========================
  const updateUser = async (updatedData) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`${API_URL}/users/edit`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || "Failed to update user.",
        };
      }

      localStorage.setItem(
        "ethnicartUser",
        JSON.stringify(data.user)
      );

      setUser(data.user);

      return {
        success: true,
        user: data.user,
      };
    } catch (error) {
      console.error("Update user error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };

  // =========================
  // CHANGE PASSWORD
  // =========================
  const changePassword = async (
    currentPassword,
    newPassword
  ) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(
        `${API_URL}/users/change-password`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            currentPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message:
            data.message || "Failed to change password.",
        };
      }

      return {
        success: true,
        message:
          data.message || "Password changed successfully.",
      };
    } catch (error) {
      console.error("Change password error:", error);

      return {
        success: false,
        message: "Unable to connect to server.",
      };
    }
  };

  // =========================
  // PROVIDER
  // =========================
  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        updateUser,
        changePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;