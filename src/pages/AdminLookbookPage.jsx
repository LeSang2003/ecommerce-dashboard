import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";

function AdminLookbookPage() {
  const [lookbooks, setLookbooks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    season: "",
    year: 2026,
    description: "",
    coverImage: "",
    featured: false,

    sections: [],
  });

  useEffect(() => {
    loadLookbooks();
  }, []);

  const loadLookbooks = async () => {
    try {
      const res = await API.get("/lookbooks");
      setLookbooks(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load lookbooks");
    }
  };

  const resetForm = () => {
    setForm({
      title: "",
      slug: "",
      season: "",
      year: 2026,
      description: "",
      coverImage: "",
      featured: false,

      sections: [],
    });

    setEditingId(null);
  };

  const handleEdit = async (item) => {
    try {
      const res = await API.get(`/lookbooks/${item.slug}`);

      const lookbook = res.data;

      setEditingId(lookbook.id);

      setForm({
        title: lookbook.title || "",
        slug: lookbook.slug || "",
        season: lookbook.season || "",
        year: lookbook.year || 2026,
        description: lookbook.description || "",
        coverImage: lookbook.coverImage || "",
        featured: lookbook.featured || false,
        sections: lookbook.sections || [],
      });

      setShowForm(true);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      console.log(err);
      toast.error("Load lookbook failed");
    }
  };
  const saveLookbook = async () => {
    try {
      if (editingId) {
        console.log(JSON.stringify(form, null, 2));
        await API.put(`/lookbooks/${editingId}`, form);

        toast.success("Lookbook updated");
      } else {
        await API.post("/lookbooks", form);

        toast.success("Lookbook created");
      }

      resetForm();

      setEditingId(null);

      setShowForm(false);

      loadLookbooks();
    } catch (err) {
      console.log(err);

      toast.error("Save failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this lookbook?")) {
      return;
    }

    try {
      await API.delete(`/lookbooks/${id}`);

      toast.success("Deleted");

      loadLookbooks();
    } catch (err) {
      console.log(err);
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Lookbooks</h1>

        <button
          onClick={() => setShowForm(!showForm)}
          className="
            bg-black
            text-white
            px-5
            py-3
            rounded-lg
          "
        >
          {showForm ? "Close" : "+ New Lookbook"}
        </button>
      </div>

      {/* FORM */}
      {showForm && (
        <div className="bg-white border rounded-xl p-6 mb-10 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Create Lookbook</h2>

          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Slug"
              value={form.slug}
              onChange={(e) =>
                setForm({
                  ...form,
                  slug: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="text"
              placeholder="Season"
              value={form.season}
              onChange={(e) =>
                setForm({
                  ...form,
                  season: e.target.value,
                })
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="number"
              placeholder="Year"
              value={form.year}
              onChange={(e) =>
                setForm({
                  ...form,
                  year: Number(e.target.value),
                })
              }
              className="border p-3 rounded-lg"
            />

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const data = new FormData();

                data.append("file", e.target.files[0]);

                const res = await API.post("/upload", data, {
                  headers: {
                    "Content-Type": "multipart/form-data",
                  },
                });

                setForm({
                  ...form,
                  coverImage: res.data,
                });
              }}
            />
            {form.coverImage && (
              <img
                src={
                  form.coverImage.startsWith("http")
                    ? form.coverImage
                    : `http://${import.meta.env.VITE_API_HOST}${form.coverImage}`
                }
                alt=""
                className="w-40 rounded-lg border"
              />
            )}
            <textarea
              rows={4}
              placeholder="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              className="
                border
                p-3
                rounded-lg
                md:col-span-2
              "
            />

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
              Featured Lookbook
            </label>
            {form.featured && (
              <p className="text-orange-500 text-sm mt-2">
                Setting this lookbook as Featured will remove Featured from the
                current one.
              </p>
            )}
          </div>

          {/* SECTIONS */}
          <div className="mt-10 border-t pt-8">
            <h3 className="font-semibold text-lg mb-4">Lookbook Sections</h3>
            <div className="mb-4">
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({
                    ...prev,
                    sections: [
                      ...prev.sections,
                      {
                        type: "TEXT",
                        title: "",
                        content: "",
                        displayOrder: prev.sections.length + 1,
                        images: [],
                      },
                    ],
                  }));
                }}
                className="
      bg-purple-600
      text-white
      px-4
      py-2
      rounded-lg
    "
              >
                + Add Section
              </button>
            </div>
            {form.sections.map((section, index) => (
              <div
                key={index}
                className="
        border
        rounded-lg
        p-4
        mb-4
        bg-gray-50
      "
              >
                <div className="grid md:grid-cols-2 gap-4">
                  <select
                    value={section.type}
                    onChange={(e) => {
                      const copy = [...form.sections];
                      copy[index].type = e.target.value;

                      setForm({
                        ...form,
                        sections: copy,
                      });
                    }}
                    className="border p-2 rounded"
                  >
                    <option value="TEXT">TEXT</option>
                    <option value="QUOTE">QUOTE</option>
                    <option value="IMAGE">IMAGE</option>
                  </select>

                  <input
                    type="number"
                    value={section.displayOrder}
                    onChange={(e) => {
                      const copy = [...form.sections];

                      copy[index].displayOrder = Number(e.target.value);

                      setForm({
                        ...form,
                        sections: copy,
                      });
                    }}
                    className="border p-2 rounded"
                  />

                  <input
                    type="text"
                    placeholder="Title"
                    value={section.title || ""}
                    onChange={(e) => {
                      const copy = [...form.sections];

                      copy[index].title = e.target.value;

                      setForm({
                        ...form,
                        sections: copy,
                      });
                    }}
                    className="border p-2 rounded md:col-span-2"
                  />

                  <textarea
                    rows={3}
                    placeholder="Content"
                    value={section.content || ""}
                    onChange={(e) => {
                      const copy = [...form.sections];

                      copy[index].content = e.target.value;

                      setForm({
                        ...form,
                        sections: copy,
                      });
                    }}
                    className="border p-2 rounded md:col-span-2"
                  />
                </div>
                {["QUOTE", "IMAGE"].includes(section.type) && (
                  <div className="mt-4 border-t pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        const copy = [...form.sections];

                        copy[index].images = [
                          ...(copy[index].images || []),
                          {
                            imageUrl: "",
                            displayOrder: (copy[index].images?.length || 0) + 1,
                            layoutType: "FULL",
                          },
                        ];

                        setForm({
                          ...form,
                          sections: copy,
                        });
                      }}
                      className="
        bg-blue-600
        text-white
        px-3
        py-2
        rounded
      "
                    >
                      + Add Section Image
                    </button>

                    {(section.images || []).map((img, imgIndex) => (
                      <div
                        key={imgIndex}
                        className="
          grid
          md:grid-cols-5
          gap-3
          mt-3
        "
                      >
                        <img
                          src={
                            img.imageUrl
                              ? img.imageUrl.startsWith("http")
                                ? img.imageUrl
                                : `http://${import.meta.env.VITE_API_HOST}${img.imageUrl}`
                              : "/placeholder.jpg"
                          }
                          alt=""
                          className="
            w-24
            h-24
            object-cover
            border
            rounded
          "
                        />

                        <input
                          type="file"
                          accept="image/*"
                          onChange={async (e) => {
                            const data = new FormData();

                            data.append("file", e.target.files[0]);

                            const res = await API.post("/upload", data, {
                              headers: {
                                "Content-Type": "multipart/form-data",
                              },
                            });

                            const copy = [...form.sections];

                            copy[index].images[imgIndex].imageUrl = res.data;

                            setForm({
                              ...form,
                              sections: copy,
                            });
                          }}
                        />

                        <input
                          type="number"
                          value={img.displayOrder}
                          onChange={(e) => {
                            const copy = [...form.sections];

                            copy[index].images[imgIndex].displayOrder = Number(
                              e.target.value,
                            );

                            setForm({
                              ...form,
                              sections: copy,
                            });
                          }}
                          className="border p-2 rounded"
                        />

                        <select
                          value={img.layoutType}
                          onChange={(e) => {
                            const copy = [...form.sections];

                            copy[index].images[imgIndex].layoutType =
                              e.target.value;

                            setForm({
                              ...form,
                              sections: copy,
                            });
                          }}
                          className="border p-2 rounded"
                        >
                          <option value="FULL">FULL</option>
                          <option value="HALF">HALF</option>
                        </select>

                        <button
                          type="button"
                          onClick={() => {
                            const copy = [...form.sections];

                            copy[index].images.splice(imgIndex, 1);

                            setForm({
                              ...form,
                              sections: copy,
                            });
                          }}
                          className="
            bg-red-500
            text-white
            rounded
          "
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => {
                    const copy = [...form.sections];

                    copy.splice(index, 1);

                    setForm({
                      ...form,
                      sections: copy,
                    });
                  }}
                  className="
          mt-3
          bg-red-500
          text-white
          px-3
          py-1
          rounded
        "
                >
                  Remove Section
                </button>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <button
              onClick={saveLookbook}
              className="
                bg-green-600
                hover:bg-green-700
                text-white
                px-6
                py-3
                rounded-lg
              "
            >
              {editingId ? "Update Lookbook" : "Save Lookbook"}
            </button>
          </div>
        </div>
      )}

      {/* TABLE */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left">Title</th>

              <th className="p-4 text-left">Season</th>

              <th className="p-4 text-left">Year</th>

              <th className="p-4 text-left">Featured</th>

              <th className="p-4 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {lookbooks.map((item) => (
              <tr key={item.id} className="border-t">
                <td className="p-4">{item.title}</td>

                <td className="p-4">{item.season}</td>

                <td className="p-4">{item.year}</td>

                <td className="p-4">{item.featured ? "Yes" : "No"}</td>

                <td className="p-4">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(item)}
                      className="
        bg-blue-500
        text-white
        px-3
        py-1
        rounded
      "
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item.id)}
                      className="
        bg-red-500
        text-white
        px-3
        py-1
        rounded
      "
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminLookbookPage;
