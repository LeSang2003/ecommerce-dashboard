import { useEffect, useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

function UserProfile() {
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
  }, []);

  // =========================
  // LOAD PROFILE
  // =========================

  const loadProfile = async () => {
    try {
      const res = await API.get("/users/me");

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

  if (!user) return null;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 lg:p-8 max-w-full overflow-x-hidden">
      <div className="flex flex-col md:flex-row gap-8 items-center">
        {/* AVATAR */}

        <div className="text-center">
          <img
            src={
              user?.avatar
                ? user.avatar.startsWith("http")
                  ? user.avatar
                  : `http://${import.meta.env.VITE_API_HOST}${user.avatar}`
                : `https://ui-avatars.com/api/?name=${user?.username}`
            }
            alt=""
            className="w-40 h-40 rounded-full object-cover border-4 border-gray-200"
            className="w-24 h-24 sm:w-32 sm:h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-gray-200"
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 break-words">
                {user.username}
              </h1>

              <p className="text-gray-500">{user.email}</p>
            </div>

            <button
              onClick={() => setEditing(!editing)}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-xl"
            >
              {editing ? "Cancel" : "Edit Profile"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              className="mt-6 w-full sm:w-auto bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-xl"
            >
              Save Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
