import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function LoginSignup() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true); // state to toggle between login/signup
  const navigate = useNavigate();

  const handleSubmit = () => {
    if (!username || !password) {
      return toast.error("Please fill in all fields!");
    }

    const users = JSON.parse(localStorage.getItem("users")) || [];

    if (isLogin) {
      // Login Logic
      const currentUser = users.find(
        (user) => user.username === username && user.password === password
      );
      if (!currentUser) {
        return toast.error("Invalid username or password! Please Signup.");
      }

      localStorage.setItem("currentUser", username);
      toast.success("Login successful!");
      navigate("/mark-attendance");
    } else {
      // Signup Logic
      if (users.some((user) => user.username === username)) {
        return toast.warning("User already exists! Try another name.");
      }

      if (password !== confirmPassword) {
        return toast.error("Passwords do not match!");
      }

      // Store user data (username and password)
      users.push({ username, password });
      localStorage.setItem("users", JSON.stringify(users));
      localStorage.setItem("currentUser", username);
      localStorage.setItem(`attendance_${username}`, JSON.stringify([]));

      toast.success("Signup successful!");
      navigate("/mark-attendance");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-xl shadow-xl w-full max-w-md transform transition-all duration-300 hover:scale-105">
        <h2 className="text-4xl text-white font-extrabold text-center mb-6">
          {isLogin ? "Login" : "Signup"}
        </h2>
        <input
          type="text"
          className="border-2 border-gray-600 p-4 my-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
          placeholder="Enter Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          className="border-2 border-gray-600 p-4 my-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {!isLogin && (
          <input
            type="password"
            className="border-2 border-gray-600 p-4 my-4 w-full rounded-xl bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-all duration-300"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        )}
        <button
          className="bg-gray-600 text-white cursor-pointer px-6 py-3 rounded-xl w-full hover:bg-gray-500 transition-all duration-300"
          onClick={handleSubmit}
        >
          {isLogin ? "Login" : "Signup"}
        </button>
        <p className="mt-6 text-sm text-center text-gray-400">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <span
            className="text-gray-300 cursor-pointer hover:text-gray-200 transition-all duration-300"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin ? "Signup" : "Login"}
          </span>
        </p>
      </div>
    </div>
  );
}

export default LoginSignup;
