import { createContext, useState } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("ethnicartUser");

    return savedUser ? JSON.parse(savedUser) : null;
  });

  // REGISTER
  const register = (name, email, password) => {
    const existingUser = localStorage.getItem("ethnicartUser");

    if (existingUser) {
      return {
        success: false,
        message: "An account already exists. Please login.",
      };
    }

    const newUser = {
      name,
      email,
      password,
    };

    localStorage.setItem(
      "ethnicartUser",
      JSON.stringify(newUser)
    );

    setUser(newUser);

    return {
      success: true,
    };
  };

  // LOGIN
  const login = (email, password) => {
    const savedUser = localStorage.getItem("ethnicartUser");

    if (!savedUser) {
      return {
        success: false,
        message: "Account not found. Please register first.",
      };
    }

    const storedUser = JSON.parse(savedUser);

    if (
      storedUser.email === email &&
      storedUser.password === password
    ) {
      setUser(storedUser);

      return {
        success: true,
      };
    }

    return {
      success: false,
      message: "Invalid email or password.",
    };
  };

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("ethnicartUser");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;