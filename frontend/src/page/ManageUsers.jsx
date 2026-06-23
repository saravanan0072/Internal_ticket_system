import { fetchAllUser,updateUser } from "../api/api.js";
import { useEffect, useState } from "react";
import { showSuccess, showError } from "../utils/toast";
function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const getUsers = async () => {
    try {
      const res = await fetchAllUser();
      console.log(res);

      setUsers(res.users);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    getUsers();
  }, []);

  const handleRoleChange = (id, role) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, role } : user)),
    );
  };

  const handleStatusChange = (id, status) => {
    setUsers((prev) =>
      prev.map((user) => (user.id === id ? { ...user, status } : user)),
    );
  };

  const updateUserData = async (user) => {
    try {
      setLoadingId(user.id);
      const res = await updateUser(user.id, user.role, user.status);

      if (!res.success) {
        showError(res.message);
        return;
      }

      showSuccess(res.message);

      await getUsers();
    } catch (err) {
      console.log(err);
      showError(err?.response?.data?.message);

      await getUsers();
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container-fluid">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold mb-0">Manage Users</h3>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Current Role</th>
                  <th>Change Role</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.userName}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className="badge bg-secondary">{user.role}</span>
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={user.role}
                        disabled={user.role === "admin"}
                        onChange={(e) =>
                          handleRoleChange(user.id, e.target.value)
                        }
                      >
                        <option value="employee">Employee</option>

                        <option value="IT_dept_Agent">IT Agent</option>

                        <option value="HR_dept_Agent">HR Agent</option>

                        <option value="Finance_dept_agent">
                          Finance Agent
                        </option>
                        <option value="Admin_dept_Agent">Admin Agent</option>

                        <option value="admin">Admin</option>
                      </select>
                    </td>

                    <td>
                      <select
                        className="form-select"
                        value={user.status}
                        disabled={user.role === "admin"}
                        onChange={(e) =>
                          handleStatusChange(user.id, e.target.value)
                        }
                      >
                        <option value="active">Active</option>

                        <option value="inActive">Inactive</option>
                      </select>
                    </td>

                    <td>
                      <button
                        className="btn btn-warning btn-sm"
                        disabled={loadingId === user.id}
                        onClick={() => updateUserData(user)}
                      >
                        {loadingId === user.id ? "Updating..." : "Update"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
