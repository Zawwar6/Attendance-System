import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import { toast } from "react-toastify"; // Import toast for notifications

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DashBoard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [attendanceData, setAttendanceData] = useState([]);
  const [attendanceChartData, setAttendanceChartData] = useState(null);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false); // New state to track attendance status

  useEffect(() => {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) {
      navigate("/");
    } else {
      setUser(currentUser);
      const storedAttendance = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];
      setAttendanceData(storedAttendance);
      generateAttendanceChart(storedAttendance);
      checkAttendanceForToday(storedAttendance);
    }
  }, [navigate]);

  const generateAttendanceChart = (data) => {
    if (!Array.isArray(data)) return;

    const currentDate = new Date();
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(currentDate.getDate() - i);
      return date.toISOString().split("T")[0];
    });

    const attendanceCount = last7Days.map((date) => {
      return data.find((entry) => entry.date === date) ? 1 : 0;
    });

    setAttendanceChartData({
      labels: last7Days,
      datasets: [
        {
          label: "Attendance (Present)",
          data: attendanceCount,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
      ],
    });
  };

  const checkAttendanceForToday = (attendance) => {
    const currentDate = new Date().toISOString().split('T')[0];
    const todayAttendance = attendance.find((entry) => entry.date === currentDate);
    if (todayAttendance) {
      setIsAttendanceMarked(true);
      toast.success(`Attendance marked as ${todayAttendance.status} for today.`);
    } else {
      setIsAttendanceMarked(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-gray-800 text-white">
      <div className="w-64 bg-gray-900 p-6">
        <h2 className="text-2xl font-bold mb-8">Dashboard</h2>
        <ul>
          <li className="mb-4 hover:text-blue-400 cursor-pointer">Home</li>
          <li className="mb-4 hover:text-blue-400 cursor-pointer">Profile</li>
          <li className="mb-4 hover:text-blue-400 cursor-pointer">Settings</li>
          <li className="mb-4 hover:text-blue-400 cursor-pointer" onClick={handleLogout}>Logout</li>
        </ul>
      </div>

      <div className="flex-1 p-8">
        <header className="flex items-center justify-between mb-6">
          <h1 className="text-4xl font-semibold">Welcome, {user || "User"}!</h1>
        </header>

        <div className="bg-gray-700 p-6 rounded-lg shadow-lg">
          <h2 className="text-3xl mb-4">Dashboard Overview</h2>
          <p className="text-lg">
            Welcome to your dashboard, {user || "User"}. Here you can manage your profile, settings, and more.
          </p>

          {/* Attendance Status */}
          <div className="mt-8">
            <h3 className="text-2xl mb-4">Today's Attendance</h3>
            {isAttendanceMarked ? (
              <p className="text-green-500">Attendance is marked for today.</p>
            ) : (
              <p className="text-red-500">You have not marked attendance for today yet.</p>
            )}
          </div>

          {/* Attendance Graph */}
          <div className="mt-8">
            <h3 className="text-2xl mb-4">Your Weekly Attendance</h3>
            {attendanceChartData ? (
              <Bar data={attendanceChartData} options={{ responsive: true, plugins: { legend: { position: "top" }, title: { display: true, text: "Attendance per Day" } } }} />
            ) : (
              <p className="text-gray-400">Loading attendance data...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashBoard;
