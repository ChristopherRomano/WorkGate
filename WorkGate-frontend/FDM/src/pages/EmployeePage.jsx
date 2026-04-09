import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import Layout from '../components/Layout';
import Dashboard   from '../pages/Dashboard';
import Profile     from '../pages/Profile';
import Timesheet   from '../pages/Timesheet';
import Tasks       from '../pages/Tasks';
import Leave       from '../pages/Leave';
import Expenses    from '../pages/Expenses';
import News        from '../pages/News';
import Leaderboard from '../pages/Leaderboard';
import IT          from '../pages/IT';
import HR          from '../pages/HR';
import React, { useState, useEffect } from "react";

export default function EmployeePage({username}) {
  const [user, setUser] = useState(null);

  useEffect(() => {
  fetch(`http://localhost:8080/api/employeeInfo?username=${username}`)
    .then(res => res.json())
    .then(data => console.log("Fetched:", data))
    .catch(err => console.error("Fetch error:", err));
  }, []);
    

  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index        element={<Dashboard />} />
          <Route path="profile"     element={<Profile />} />
          <Route path="timesheet"   element={<Timesheet />} />
          <Route path="tasks"       element={<Tasks />} />
          <Route path="leave"       element={<Leave />} />
          <Route path="expenses"    element={<Expenses />} />
          <Route path="news"        element={<News />} />
          <Route path="leaderboard" element={<Leaderboard />} />
          <Route path="it"          element={<IT />} />
          <Route path="hr"          element={<HR />} />
        </Route>
      </Routes>
    </BrowserRouter>
    </ThemeProvider>
  );
}
