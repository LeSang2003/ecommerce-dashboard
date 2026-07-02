import { useEffect, useState } from "react";
import API from "../api/api";
import { Plus, Pencil, Trash2, Star, X } from "lucide-react";
import { toast } from "react-toastify";

function AdminCollections() {
  const emptyForm = {
    name: "",
    slug: "",
    bannerImage: "",
    description: "",
    season: "SS",
    year: 2026,
    featured: false,
  };

  const [collections, setCollections] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    loadCollections();
  }, []);

  const loadCollections = async () => {
    try {
      const res = await API.get("/collections");
      setCollections(res.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await API.put(`/collections/${editingId}`, form);

        toast.success("Collection updated");
      } else {
        await API.post("/collections", form);

        toast.success("Collection created");
      }

      setOpenModal(false);
      resetForm();
      loadCollections();
    } catch (err) {
      console.log(err);
      toast.error(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Operation failed",
      );
    }
  };

  const handleEdit = (c) => {
    setEditingId(c.id);

    setForm({
      name: c.name || "",
      slug: c.slug || "",
      bannerImage: c.bannerImage || "",
      description: c.description || "",
      season: c.season || "SS",
      year: c.year || 2026,
      featured: c.featured || false,
    });

    setOpenModal(true);
  };

  const handleDelete = async (id) => {
    const ok = window.confirm(
      "Are you sure you want to delete this collection?",
    );

    if (!ok) return;

    try {
      await API.delete(`/collections/${id}`);

      toast.success("Collection deleted");

      loadCollections();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();

    formData.append("file", file);

    try {
      const res = await API.post("/collections/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setForm({
        ...form,
        bannerImage: res.data,
      });

      toast.success("Banner uploaded");
    } catch (err) {
      console.log(err);

      toast.error("Upload failed");
    }
  };

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Collection Management</h1>

          <p className="text-gray-500 mt-1">
            Manage luxury collections for your storefront
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setOpenModal(true);
          }}
          className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800"
        >
          <Plus size={18} />
          New Collection
        </button>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4 text-left">Banner</th>
              <th className="p-4 text-left">Collection</th>
              <th className="p-4 text-left">Season</th>
              <th className="p-4 text-left">Year</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {collections.map((c) => (
              <tr key={c.id} className="border-t hover:bg-gray-50 transition">
                <td className="p-4">
                  <img
                    src={
                      c.bannerImage
                        ? `${import.meta.env.VITE_API_HOST}${c.bannerImage}`
                        : "/no-image.png"
                    }
                    alt=""
                    className="w-64 h-36 object-contain rounded-lg bg-gray-100"
                  />
                </td>

                <td className="p-4">
                  <p className="font-bold">{c.name}</p>

                  <p className="text-sm text-gray-500">{c.slug}</p>
                </td>

                <td className="p-4">
                  <span className="font-semibold">{c.season}</span>
                </td>

                <td className="p-4">{c.year}</td>

                <td className="p-4">
                  {c.featured ? (
                    <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-sm">
                      <Star size={14} />
                      Featured
                    </span>
                  ) : (
                    <span className="text-gray-400">Normal</span>
                  )}
                </td>

                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <button
                      onClick={() => handleEdit(c)}
                      className="p-2 rounded-lg bg-blue-100 text-blue-600 hover:bg-blue-200"
                    >
                      <Pencil size={18} />
                    </button>

                    <button
                      onClick={() => handleDelete(c.id)}
                      className="p-2 rounded-lg bg-red-100 text-red-600 hover:bg-red-200"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {collections.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-12 text-gray-400">
                  No collections found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {openModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-3xl rounded-2xl p-6 relative">
            <button
              onClick={() => {
                setOpenModal(false);
                resetForm();
              }}
              className="absolute right-4 top-4"
            >
              <X />
            </button>

            <h2 className="text-2xl font-bold mb-6">
              {editingId ? "Edit Collection" : "Create Collection"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                placeholder="Collection Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                placeholder="Slug"
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                className="w-full border p-3 rounded-lg"
                required
              />

              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="w-full border p-3 rounded-lg"
              />
              <p className="text-xs text-gray-500">
                Recommended size: 1920 × 1080 (16:9)
              </p>
              {form.bannerImage && (
                <img
                  src={
                    form.bannerImage.startsWith("http")
                      ? form.bannerImage
                      : `${import.meta.env.VITE_API_HOST}${form.bannerImage}`
                  }
                  alt=""
                  className="w-full h-52 object-cover rounded-lg"
                />
              )}

              <textarea
                rows="4"
                placeholder="Description"
                value={form.description}
                onChange={(e) =>
                  setForm({
                    ...form,
                    description: e.target.value,
                  })
                }
                className="w-full border p-3 rounded-lg"
              />

              <div className="grid md:grid-cols-2 gap-4">
                <select
                  value={form.season}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      season: e.target.value,
                    })
                  }
                  className="border p-3 rounded-lg"
                >
                  <option value="SS">SS</option>
                  <option value="FW">FW</option>
                  <option value="LE">LE</option>
                </select>

                <input
                  type="number"
                  value={form.year}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      year: Number(e.target.value),
                    })
                  }
                  className="border p-3 rounded-lg"
                />
              </div>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured Collection
              </label>

              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg hover:bg-gray-800"
              >
                {editingId ? "Update Collection" : "Create Collection"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminCollections;
