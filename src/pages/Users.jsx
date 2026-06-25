import { useEffect, useState } from "react";
import API from "../api/api";
import ConfirmModal from "../components/ConfirmModal";
import { toast } from "react-toastify";
import TableSkeleton from "../components/skeletons/TableSkeleton";
import Papa from "papaparse";

function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [sortAsc, setSortAsc] = useState(true);

  const [loading, setLoading] = useState(true);
  const [loadingId, setLoadingId] = useState(null);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ================= LOAD USERS =================
  useEffect(() => {
    setLoading(true);

    API.get("/orders/admin/users", {
      params: {
        page,
        size: 5,
        search: debouncedSearch,
      },
    })
      .then((res) => {
        setUsers(res.data.content);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [page, debouncedSearch]);

  // ================= DEBOUNCE =================
  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 400);

    return () => clearTimeout(timeout);
  }, [search]);

  // reset page khi search
  useEffect(() => {
    setPage(0);
  }, [debouncedSearch]);

  // ================= EXPORT CSV =================
  const handleExportCSV = () => {
    if (!sortedUsers.length) {
      toast.error("No data to export");
      return;
    }

    const data = sortedUsers.map((u) => ({
      ID: u.id,
      Email: u.email || "",
      Username: u.username || "",
      Role: u.role,
      Status: u.banned ? "Banned" : "Active",
    }));

    const csv = Papa.unparse(data);

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute(
      "download",
      `users_${new Date().toLocaleDateString()}.csv`,
    );

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // ================= ACTIONS =================
  const handleChangeRole = (user) => {
    const newRole = user.role === "ADMIN" ? "USER" : "ADMIN";

    API.put(`/orders/admin/users/${user.id}/role`, null, {
      params: { role: newRole },
    })
      .then(() => {
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, role: newRole } : u)),
        );
        toast.success("Role updated");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.customMessage || "Error");
      });
  };

  const handleToggleBan = (user) => {
    setSelectedUser(user);
    setConfirmOpen(true);
  };

  const handleConfirmBan = () => {
    if (!selectedUser) return;

    setLoadingId(selectedUser.id);

    API.put(`/orders/admin/users/${selectedUser.id}/toggle-ban`)
      .then(() => {
        setUsers((prev) =>
          prev.map((u) =>
            u.id === selectedUser.id ? { ...u, banned: !u.banned } : u,
          ),
        );
        toast.success("Updated successfully");
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.customMessage || "Error");
      })
      .finally(() => {
        setLoadingId(null);
        setConfirmOpen(false);
        setSelectedUser(null);
      });
  };

  // ================= FILTER + SORT =================
  const sortedUsers = [...users]
    .filter((u) =>
      (u.email || u.username || "")
        .toLowerCase()
        .includes(debouncedSearch.toLowerCase()),
    )
    .sort((a, b) => (sortAsc ? a.id - b.id : b.id - a.id));

  // ================= LOADING =================
  if (loading) return <TableSkeleton rows={5} />;

  return (
    <div className="bg-white p-6 rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Users Management</h1>

      {/* SEARCH + EXPORT */}
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search email or username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 w-72 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleExportCSV}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Export CSV
        </button>
      </div>

      {/* TABLE */}
      <table className="w-full text-sm border rounded overflow-hidden">
        <thead className="bg-gray-100">
          <tr className="text-left">
            <th
              className="p-3 cursor-pointer"
              onClick={() => setSortAsc(!sortAsc)}
            >
              ID {sortAsc ? "↑" : "↓"}
            </th>
            <th className="p-3">User</th>
            <th className="p-3">Role</th>
            <th className="p-3">Status</th>
            <th className="p-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {sortedUsers.map((u) => (
            <tr key={u.id} className="border-t hover:bg-gray-50">
              <td className="p-3 font-medium">#{u.id}</td>

              <td className="p-3">
                <div className="flex flex-col">
                  <span className="font-semibold">{u.email || u.username}</span>
                  {u.username && (
                    <span className="text-xs text-gray-400">{u.username}</span>
                  )}
                </div>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.role === "ADMIN"
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {u.role}
                </span>

                <button
                  onClick={() => handleChangeRole(u)}
                  className="ml-2 bg-indigo-500 text-white px-2 py-1 rounded text-xs"
                >
                  Switch
                </button>
              </td>

              <td className="p-3">
                <span
                  className={`px-2 py-1 rounded text-xs font-semibold ${
                    u.banned
                      ? "bg-red-100 text-red-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {u.banned ? "Banned" : "Active"}
                </span>
              </td>

              <td className="p-3 text-center">
                <button
                  disabled={u.role === "ADMIN" || loadingId === u.id}
                  onClick={() => handleToggleBan(u)}
                  className={`px-3 py-1 rounded text-xs ${
                    u.role === "ADMIN"
                      ? "bg-gray-300 cursor-not-allowed"
                      : u.banned
                        ? "bg-green-500 text-white"
                        : "bg-red-500 text-white"
                  }`}
                >
                  {loadingId === u.id
                    ? "Processing..."
                    : u.banned
                      ? "Unban"
                      : "Ban"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* EMPTY */}
      {sortedUsers.length === 0 && (
        <p className="text-center text-gray-400 mt-6">No users found</p>
      )}

      {/* PAGINATION */}
      <div className="flex gap-2 mt-4">
        <button
          disabled={page === 0}
          onClick={() => setPage((p) => Math.max(p - 1, 0))}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Prev
        </button>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-200 rounded"
        >
          Next
        </button>
      </div>

      {/* MODAL */}
      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleConfirmBan}
        message={`Are you sure you want to ${
          selectedUser?.banned ? "unban" : "ban"
        } this user?`}
      />
    </div>
  );
}

export default Users;
