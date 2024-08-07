import React, { useState, useEffect } from "react";
import { FaUser } from "react-icons/fa";
import "../Styles/permission.css";
import axiosInstance from "../Auth/AxiosInstance";

const Permission = () => {
  const [admin, setAdmin] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [loading, setLoading] = useState(false);

  const permissionsList = [
    "Dashboard",
    "Appointment",
    "Payment",
    "Package",
    "Promotion",
    "Permission",
  ];

  const fetchAdmins = async () => {
    try {
      const response = await axiosInstance.get("/getAdmins");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const handleAdminClick = (admin) => {
    setSelectedAdmin(admin);
    const permissions = permissionsList.filter(
      (permission) => admin[permission.toLowerCase()]
    );
    setSelectedPermissions(permissions);
  };

  const handlePermissionClick = (permission) => {
    setSelectedPermissions((prevSelected) =>
      prevSelected.includes(permission)
        ? prevSelected.filter((item) => item !== permission)
        : [...prevSelected, permission]
    );
  };

  const handleSend = async () => {
    try {
      const response = await axiosInstance.post("/addAdmin", {
        admin,
        password,
      });
      setMessage("Admin created successfully");
      fetchAdmins();
      clearMessage();
    } catch (error) {
      setMessage("Failed to create admin");
      clearMessage();
    }
  };

  const handleUpdate = async () => {
    const admin = selectedAdmin.id;
    setLoading(true);
    try {
      await axiosInstance.post("/updateAdminPermission", {
        selectedPermissions,
        admin,
      });
      setMessage("Permissions updated successfully");
      fetchAdmins();
      clearMessage();
    } catch (error) {
      setMessage("Failed to update permissions");
      clearMessage();
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm(`Do you really want to delete ${selectedAdmin.username} from admin?`)) {
      const admin = selectedAdmin.id;
      setLoading(true);
      try {
        await axiosInstance.post("/deleteAdmin", {
          admin,
        });
        fetchAdmins();
        setSelectedAdmin(null);
        setMessage("Admin deleted successfully");
        clearMessage();
      } catch (error) {
        setMessage("Failed to delete admin");
        clearMessage();
      } finally {
        setLoading(false);
      }
    }
  };

  const clearMessage = () => {
    setTimeout(() => {
      setMessage("");
    }, 3000);
  };

  return (
    <div className="permission-form-container">
      <div className="permission-leftdiv">
        <div className="permission-account">
          <label>Create Account</label>
          <input
            type="text"
            value={admin}
            placeholder=" Username"
            onChange={(e) => setAdmin(e.target.value)}
          />
          <input
            type="text"
            value={password}
            placeholder=" Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <div>
            <button onClick={handleSend} className="create-button">
              Create
            </button>
          </div>
          
        </div>
        {selectedAdmin && (
          <div className="permissions">
            <div className="permissions-type-container">
              <p>Permission for {selectedAdmin.username}</p>
              <div className="permissions-category">
                {permissionsList.map((permission) => (
                  <p
                    key={permission}
                    className={
                      selectedPermissions.includes(permission) ? "selected" : ""
                    }
                    onClick={() => handlePermissionClick(permission)}
                  >
                    {permission}
                  </p>
                ))}
              </div>
            </div>
            <div className="upd-btn-container">
              <div><button onClick={handleUpdate} className="update-button">
                {loading ? "loading..." : "Update"}
              </button></div>
              <div><button onClick={handleDelete} className="update-button">
                {loading ? "loading..." : "Delete Admin"}
              </button></div>
              
            </div>
          </div>
        )}
              {message && <p className="notification-message">{message}</p>}

      </div>
      <div className="perm-right">
        <p>Users</p>
        <div className="permission-rightdiv">
          <div className="admin-list">
            {admins.map((admin) => (
              <p
                key={admin.id}
                className={`p-card ${selectedAdmin && selectedAdmin.id === admin.id
                    ? "selected-admin"
                    : ""
                  }`}
                onClick={() => handleAdminClick(admin)}
                style={{ cursor: "pointer"}}
              >
              
                <span className="card-name">{admin.username}</span>
                <FaUser className="card-icon" />
              </p>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};

export default Permission;
