import { useState } from "react";
import API from "../../api/api";
import { toast } from "react-toastify";

function ChangePassword() {
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
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h1 className="text-3xl font-bold mb-8">Change Password</h1>

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
  );
}

export default ChangePassword;
