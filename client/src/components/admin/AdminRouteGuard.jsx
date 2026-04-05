import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import LoadingSpinner from "../LoadingSpinner";
import { API_BASE } from "../../config/api.js";

/**
 * Only authenticated admins (valid adminToken cookie) may access /admin/home/*.
 */
const AdminRouteGuard = ({ children }) => {
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    axios
      .get(`${API_BASE}/api/dashboard`, { withCredentials: true })
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err) => {
        if (cancelled) return;
        const status = err.response?.status;
        if (status === 401 || status === 403) {
          toast.info("Please log in with your admin account.");
          navigate("/admin/login", { replace: true });
          return;
        }
        if (!err.response) {
          toast.error("Cannot reach the server. Is the backend running?");
          navigate("/admin/login", { replace: true });
          return;
        }
        setReady(true);
      });

    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (!ready) return <LoadingSpinner />;
  return children;
};

export default AdminRouteGuard;
