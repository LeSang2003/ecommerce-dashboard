import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function UserDashboard() {
  const [orders, setOrders] = useState([]);

  const [user, setUser] = useState(null);

  const [uploading, setUploading] = useState(false);

  const [editing, setEditing] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    address: "",
    birthday: "",
    gender: "",
  });

  useEffect(() => {
    loadProfile();
    loadOrders();
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/me");

      console.log("PROFILE:", res.data);

      setUser(res.data);

      setFormData({
        fullName: res.data.fullName || "",
        phone: res.data.phone || "",
        address: res.data.address || "",
        birthday: res.data.birthday || "",
        gender: res.data.gender || "",
      });
    } catch (err) {
      console.log(err);

      toast.error("Cannot load profile");
    }
  };

  // =========================
  // LOAD ORDERS
  // =========================

  const loadOrders = async () => {
    try {
      const res = await API.get("/orders/my-orders");

      setOrders(res.data || []);
    } catch (err) {
      console.log(err);

      toast.error("Cannot load orders");
    }
  };

  // =========================
  // HANDLE INPUT
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // UPDATE PROFILE
  // =========================

  const updateProfile = async () => {
    try {
      const res = await API.put("/users/profile", formData);

      setUser(res.data);

      setEditing(false);

      toast.success("Profile updated");
    } catch (err) {
      console.log(err);

      toast.error("Update failed");
    }
  };

  // =========================
  // CANCEL ORDER
  // =========================

  const cancelOrder = async (id) => {
    try {
      await API.put(`/orders/${id}/cancel`);

      toast.success("Order cancelled");

      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: "CANCELLED" } : o)),
      );
    } catch (err) {
      console.log(err);

      toast.error("Cannot cancel order");
    }
  };

  // =========================
  // UPLOAD AVATAR
  // =========================

  const uploadAvatar = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setUploading(true);

      const form = new FormData();

      form.append("file", file);

      const uploadRes = await API.post("/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      const avatarUrl = uploadRes.data;

      const res = await API.put("/users/avatar", {
        avatar: avatarUrl,
      });

      setUser(res.data);

      toast.success("Avatar updated");
    } catch (err) {
      console.log(err);

      toast.error("Upload failed");
    } finally {
      setUploading(false);
    }
  };
  const [passwordData, setPasswordData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const changePassword = async () => {
    try {
      await API.put("/users/change-password", passwordData);
      toast.success("Password changed");
      setPasswordData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data || "Change password failed");
    }
  };
  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* PROFILE */}

      {user && (
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-10">
          <div className="flex flex-col md:flex-row gap-8 items-center">
            {/* AVATAR */}

            <div className="text-center">
              <img
                src={
                  user?.avatar
                    ? user.avatar.startsWith("http")
                      ? user.avatar
                      : `http://localhost:8085${user.avatar}`
                    : `https://ui-avatars.com/api/?name=${user?.username}`
                }
                alt=""
                className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
              />

              <label className="mt-4 inline-block">
                <input type="file" className="hidden" onChange={uploadAvatar} />

                <div className="bg-black text-white px-4 py-2 rounded-xl cursor-pointer hover:bg-gray-800">
                  {uploading ? "Uploading..." : "Change Avatar"}
                </div>
              </label>
            </div>

            {/* INFO */}

            <div className="flex-1">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h1 className="text-4xl font-bold mb-2">{user.username}</h1>

                  <p className="text-gray-500">{user.email}</p>
                </div>

                <button
                  onClick={() => setEditing(!editing)}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
                >
                  {editing ? "Cancel" : "Edit Profile"}
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {/* FULL NAME */}

                <div>
                  <div className="text-gray-500 text-sm">Full Name</div>

                  {editing ? (
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <div className="font-semibold">{user.fullName || "-"}</div>
                  )}
                </div>

                {/* PHONE */}

                <div>
                  <div className="text-gray-500 text-sm">Phone</div>

                  {editing ? (
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <div className="font-semibold">{user.phone || "-"}</div>
                  )}
                </div>

                {/* ADDRESS */}

                <div>
                  <div className="text-gray-500 text-sm">Address</div>

                  {editing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <div className="font-semibold">{user.address || "-"}</div>
                  )}
                </div>

                {/* GENDER */}

                <div>
                  <div className="text-gray-500 text-sm">Gender</div>

                  {editing ? (
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    >
                      <option value="">Select Gender</option>

                      <option value="Male">Male</option>

                      <option value="Female">Female</option>
                    </select>
                  ) : (
                    <div className="font-semibold">{user.gender || "-"}</div>
                  )}
                </div>

                {/* BIRTHDAY */}

                <div>
                  <div className="text-gray-500 text-sm">Birthday</div>

                  {editing ? (
                    <input
                      type="date"
                      name="birthday"
                      value={formData.birthday}
                      onChange={handleChange}
                      className="border rounded-lg px-3 py-2 w-full"
                    />
                  ) : (
                    <div className="font-semibold">{user.birthday || "-"}</div>
                  )}
                </div>
              </div>

              {/* SAVE BUTTON */}

              {editing && (
                <button
                  onClick={updateProfile}
                  className="mt-6 bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
                >
                  Save Changes
                </button>
              )}
              {/* CHANGE PASSWORD */}

              <div className="mt-10 border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Change Password</h2>

                <div className="grid gap-4">
                  <input
                    type="password"
                    placeholder="Current Password"
                    value={passwordData.oldPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        oldPassword: e.target.value,
                      })
                    }
                    className="border rounded-xl px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="New Password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        newPassword: e.target.value,
                      })
                    }
                    className="border rounded-xl px-4 py-3"
                  />

                  <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({
                        ...passwordData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="border rounded-xl px-4 py-3"
                  />

                  <button
                    onClick={changePassword}
                    className="bg-black hover:bg-gray-800 text-white py-3 rounded-xl"
                  >
                    Change Password
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS */}

      <h1 className="text-4xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl p-10 shadow text-center">
          No orders yet
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow p-6">
              {/* TOP */}

              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold">Order #{order.id}</h2>

                  <p className="text-gray-500 mt-1">
                    {new Date(order.createAt).toLocaleString()}
                  </p>
                </div>

                <div className="flex flex-col items-end gap-3">
                  <div
                    className={`px-4 py-2 rounded-xl text-sm font-semibold
                    ${
                      order.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-700"
                        : order.status === "COMPLETED"
                          ? "bg-green-100 text-green-700"
                          : order.status === "SHIPPING"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-red-100 text-red-700"
                    }`}
                  >
                    {order.status}
                  </div>

                  {order.status === "PENDING" && (
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl text-sm"
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>

              {/* ITEMS */}

              <div className="border rounded-2xl overflow-hidden">
                {order.items?.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 border-b last:border-b-0"
                  >
                    <img
                      src={
                        item.product?.imageUrl?.startsWith("http")
                          ? item.product.imageUrl
                          : `http://localhost:8085${item.product?.imageUrl}`
                      }
                      alt={item.product?.name}
                      className="w-20 h-20 object-cover rounded-xl border"
                    />

                    <div className="flex-1">
                      <h3 className="font-bold">{item.productName}</h3>

                      <div className="text-gray-500 text-sm mt-1">
                        Qty: {item.quantity}
                      </div>

                      <div className="text-gray-500 text-sm">
                        Color: {item.color || "Default"}
                      </div>

                      <div className="text-gray-500 text-sm">
                        Size: {item.size || "Default"}
                      </div>
                    </div>

                    <div className="font-bold text-lg">
                      {item.price?.toLocaleString()} đ
                    </div>
                  </div>
                ))}
              </div>

              {/* TOTAL */}

              <div className="flex justify-end mt-6">
                <div className="text-2xl font-bold">
                  Total: {order.totalPrice?.toLocaleString()} đ
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;
