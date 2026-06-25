import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function AdminCoupons() {
  const [coupons, setCoupons] = useState([]);
  const [stats, setStats] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");

  const [form, setForm] = useState({
    code: "",
    discountPercent: "",
    expiredAt: "",
    minOrderValue: "",
    maxUsage: "",
    active: true,
  });

  // =========================
  // FETCH COUPONS
  // =========================
  const fetchCoupons = async () => {
    try {
      const res = await API.get(
        `/admin/coupons?page=${page}&size=5&keyword=${keyword}`,
      );

      setCoupons(res.data.content || []);
      setTotalPages(res.data.totalPages || 1);
    } catch {
      toast.error("Load coupons failed");
    }
  };

  // =========================
  // FETCH STATS
  // =========================
  const fetchStats = async () => {
    try {
      const res = await API.get("/coupons/stats");
      setStats(res.data);
    } catch {
      toast.error("Load stats failed");
    }
  };

  useEffect(() => {
    fetchCoupons();
    fetchStats();
  }, [page]);

  // SEARCH debounce
  useEffect(() => {
    const delay = setTimeout(() => {
      setPage(0);
      fetchCoupons();
    }, 400);

    return () => clearTimeout(delay);
  }, [keyword]);

  // =========================
  // SAVE
  // =========================
  const saveCoupon = async () => {
    try {
      if (editingId) {
        await API.put(`/admin/coupons/${editingId}`, form);
        toast.success("Coupon updated");
      } else {
        await API.post("/admin/coupons", form);
        toast.success("Coupon created");
      }

      resetForm();
      fetchCoupons();
      fetchStats();
    } catch {
      toast.error("Save failed");
    }
  };

  // DELETE
  const deleteCoupon = async (id) => {
    await API.delete(`/admin/coupons/${id}`);
    toast.success("Deleted");
    fetchCoupons();
    fetchStats();
  };

  // TOGGLE
  const toggleCoupon = async (id) => {
    await API.put(`/admin/coupons/${id}/toggle`);
    toast.success("Updated");
    fetchCoupons();
    fetchStats();
  };

  // EDIT
  const editCoupon = (coupon) => {
    setEditingId(coupon.id);

    setForm({
      code: coupon.code,
      discountPercent: coupon.discountPercent,
      expiredAt: coupon.expiredAt?.slice(0, 16) || "",
      minOrderValue: coupon.minOrderValue || "",
      maxUsage: coupon.maxUsage || "",
      active: coupon.active,
    });
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      code: "",
      discountPercent: "",
      expiredAt: "",
      minOrderValue: "",
      maxUsage: "",
      active: true,
    });
  };

  return (
    <div className="p-8">
      {/* WHITE CONTAINER FIX DARK MODE */}
      <div className="bg-white rounded-2xl shadow-xl p-8 text-black">
        <h1 className="text-3xl font-bold mb-6">Coupon Management</h1>

        {/* SEARCH */}
        <input
          type="text"
          placeholder="Search coupon..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="border p-3 rounded-lg w-full mb-6"
        />

        {/* STATS */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="bg-blue-500 text-white p-5 rounded-xl">
            <h3>Total Coupons</h3>
            <p className="text-3xl font-bold">{stats.totalCoupons || 0}</p>
          </div>

          <div className="bg-green-500 text-white p-5 rounded-xl">
            <h3>Active</h3>
            <p className="text-3xl font-bold">{stats.activeCoupons || 0}</p>
          </div>

          <div className="bg-yellow-500 text-white p-5 rounded-xl">
            <h3>Used</h3>
            <p className="text-3xl font-bold">{stats.usedCoupons || 0}</p>
          </div>

          <div className="bg-purple-500 text-white p-5 rounded-xl">
            <h3>Most Used</h3>
            <p className="text-xl font-bold">{stats.mostUsedCoupon || "N/A"}</p>
          </div>
        </div>

        {/* FORM */}
        <div className="grid gap-3 mb-8">
          <input
            placeholder="Code"
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value })}
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Discount %"
            value={form.discountPercent}
            onChange={(e) =>
              setForm({ ...form, discountPercent: e.target.value })
            }
            className="border p-3 rounded"
          />

          <input
            type="datetime-local"
            value={form.expiredAt}
            onChange={(e) => setForm({ ...form, expiredAt: e.target.value })}
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Min Order"
            value={form.minOrderValue}
            onChange={(e) =>
              setForm({ ...form, minOrderValue: e.target.value })
            }
            className="border p-3 rounded"
          />

          <input
            type="number"
            placeholder="Max Usage"
            value={form.maxUsage}
            onChange={(e) => setForm({ ...form, maxUsage: e.target.value })}
            className="border p-3 rounded"
          />

          <div className="flex gap-3">
            <button
              onClick={saveCoupon}
              className="bg-black text-white py-3 px-6 rounded-lg"
            >
              {editingId ? "Update Coupon" : "Create Coupon"}
            </button>

            {editingId && (
              <button
                onClick={resetForm}
                className="bg-gray-500 text-white py-3 px-6 rounded-lg"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* TABLE */}
        <table className="w-full border shadow rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3">Code</th>
              <th>%</th>
              <th>Used</th>
              <th>Max</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="text-center border-t">
                <td className="p-3">{coupon.code}</td>
                <td>{coupon.discountPercent}%</td>
                <td>{coupon.usedCount}</td>
                <td>{coupon.maxUsage}</td>

                <td>
                  <span
                    className={`font-semibold ${
                      coupon.active ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {coupon.active ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="space-x-2">
                  <button
                    onClick={() => editCoupon(coupon)}
                    className="bg-green-500 text-white px-3 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => toggleCoupon(coupon.id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded"
                  >
                    Toggle
                  </button>

                  <button
                    onClick={() => deleteCoupon(coupon.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* PAGINATION */}
        <div className="flex justify-center gap-4 mt-6">
          <button
            disabled={page === 0}
            onClick={() => setPage(page - 1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Prev
          </button>

          <span className="font-semibold">
            Page {page + 1} / {totalPages}
          </span>

          <button
            disabled={page + 1 >= totalPages}
            onClick={() => setPage(page + 1)}
            className="bg-gray-300 px-4 py-2 rounded"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminCoupons;
