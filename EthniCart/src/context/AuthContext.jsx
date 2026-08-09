import { createContext, useState } from "react";
export const AuthContext = createContext();

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
  const register = (
    name,
    phone,
    location,
    email,
    password
  ) => {
    const savedUsers =
      localStorage.getItem("ethnicartUsers");

    const users = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    // Check duplicate email
    const existingUser = users.find(
      (item) =>
        item.email?.toLowerCase() ===
        email.toLowerCase()
    );

    if (existingUser) {
      return {
        success: false,
        message:
          "An account with this email already exists. Please login.",
      };
    }

    // Create new user
    const newUser = {
      id: Date.now(),
      name,
      phone,
      location,
      email,
      password,
      orders: 0,
      spent: 0,
      joined: new Date().toLocaleDateString(),
    };

    // Save user in all users
    const updatedUsers = [
      ...users,
      newUser,
    ];

    localStorage.setItem(
      "ethnicartUsers",
      JSON.stringify(updatedUsers)
    );

    // Save currently logged-in user
    localStorage.setItem(
      "ethnicartUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
    };
  };

  // =========================
  // LOGIN
  // =========================
  const login = (email, password) => {
    const savedUsers =
      localStorage.getItem("ethnicartUsers");

    const users = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    const storedUser = users.find(
      (item) =>
        item.email?.toLowerCase() ===
          email.toLowerCase() &&
        item.password === password
    );

    if (!storedUser) {
      return {
        success: false,
        message: "Invalid email or password.",
      };
    }

    // Save current user
    localStorage.setItem(
      "ethnicartUser",
      JSON.stringify(storedUser)
    );

    setUser(storedUser);

    return {
      success: true,
    };
  };

  // =========================
  // LOGOUT
  // =========================
  const logout = () => {
    localStorage.removeItem("ethnicartUser");

    setUser(null);
  };

  // =========================
  // UPDATE USER
  // =========================
  const updateUser = (updatedData) => {
    if (!user) return;

    const updatedUser = {
      ...user,
      ...updatedData,
    };

    // Update current user
    setUser(updatedUser);

    localStorage.setItem(
      "ethnicartUser",
      JSON.stringify(updatedUser)
    );

    // Update users list
    const savedUsers =
      localStorage.getItem("ethnicartUsers");

    const users = savedUsers
      ? JSON.parse(savedUsers)
      : [];

    const updatedUsers = users.map(
      (item) =>
        item.id === user.id
          ? updatedUser
          : item
    );

    localStorage.setItem(
      "ethnicartUsers",
      JSON.stringify(updatedUsers)
    );
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
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;