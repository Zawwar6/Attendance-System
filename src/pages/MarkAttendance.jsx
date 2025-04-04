import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { toast } from 'react-toastify'; // Import toast from react-toastify
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles

const MarkAttendance = () => {
  const [attendanceStatus, setAttendanceStatus] = useState(null);
  const [isAttendanceMarked, setIsAttendanceMarked] = useState(false);
  const navigate = useNavigate(); // Initialize navigate hook

  const handleMarkAttendance = (status) => {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const currentDate = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

      // Get existing attendance data from localStorage
      let attendanceData = JSON.parse(localStorage.getItem(`attendance_${currentUser}`)) || [];

      // Check if attendance for today is already marked
      const existingAttendance = attendanceData.find((entry) => entry.date === currentDate);
      if (existingAttendance) {
        // Show toast if attendance for today is already marked
        toast.info("You have already marked attendance for today.");
        return;
      }

      // Add the new attendance status for today
      attendanceData.push({ date: currentDate, status });
      localStorage.setItem(`attendance_${currentUser}`, JSON.stringify(attendanceData));

      setAttendanceStatus(status);
      setIsAttendanceMarked(true); // Mark attendance is completed

      // Show toast for success
      toast.success(`You have marked yourself as ${status} for today.`);

      // After marking attendance, navigate to the Dashboard
      navigate('/dashboard'); // Navigate to the dashboard
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Remove current user from localStorage
    toast.success("Logged out successfully!"); // Show toast notification
    navigate('/'); // Navigate to home page
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-800 text-white">
      <h2 className="text-3xl mb-6">Mark Your Attendance</h2>

      <div className="flex gap-4 mb-8">
        <button
          onClick={() => handleMarkAttendance('Present')}
          className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-400"
        >
          Mark as Present
        </button>
        <button
          onClick={() => handleMarkAttendance('Absent')}
          className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-400"
        >
          Mark as Absent
        </button>
      </div>

      {isAttendanceMarked && (
        <div className="text-lg text-gray-300 mt-6">
          You have marked yourself as <span className="font-bold">{attendanceStatus}</span> for today.
        </div>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="mt-8 bg-gray-600 cursor-pointer text-white px-6 py-2 rounded-lg hover:bg-gray-500"
      >
        Logout
      </button>
    </div>
  );
};

export default MarkAttendance;
