import { useEffect, useState } from "react";
import Select from "react-select";
import { toast } from "react-hot-toast";
import { getImageUrl } from "../utils/image";
function ProductModal({
  open,
  onClose,
  onSave,
  form,
  setForm,
  categories,
  collections,
  colors,
  sizes,
  setFile,
  setExtraFiles,
  extraFiles,
  existingImages,
}) {
  console.log("EXISTING =", existingImages);
  console.log("EXISTING LENGTH =", existingImages?.length);

  console.log("EXTRA =", extraFiles);
  console.log("EXTRA LENGTH =", extraFiles?.length);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState("");

  useEffect(() => {
    setPreview(getImageUrl(form.imageUrl));
  }, [form.imageUrl]);

  useEffect(() => {
    return () => {
      if (preview && preview.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  // close modal
  if (!open) return null;

  // upload image
  const handleImage = (e) => {
    const selectedFile = e.target.files[0];

    if (!selectedFile) return;

    if (selectedFile.size > 2 * 1024 * 1024) {
      toast.error("Image max 2MB");
      return;
    }

    // QUAN TRỌNG
    setFile(selectedFile);

    // preview local
    const previewUrl = URL.createObjectURL(selectedFile);

    setPreview(previewUrl);
  };
  const handleExtraImages = (e) => {
    const files = Array.from(e.target.files);

    console.log("NEW FILES =", files);

    setExtraFiles((prev) => {
      const result = [...prev, ...files];

      console.log("AFTER ADD =", result);

      return result;
    });
  };
  // save
  const handleSubmit = async () => {
    // chống double click
    if (loading) return;

    // validate
    if (!form.name?.trim()) {
      toast.error("Name required");
      return;
    }

    if (!form.price || Number(form.price) <= 0) {
      toast.error("Invalid price");
      return;
    }

    try {
      setLoading(true);

      console.log("SUBMIT START");

      // IMPORTANT
      await Promise.resolve(onSave());
      setPreview("");
      onClose();
      console.log("SUBMIT SUCCESS");
    } catch (err) {
      console.log("SUBMIT ERROR:", err);

      toast.error("Save failed");
    } finally {
      // LUÔN RESET
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh]">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            {form.id ? "Edit Product" : "Create Product"}
          </h2>

          <button
            onClick={onClose}
            className="text-3xl text-gray-500 hover:text-black transition"
          >
            ×
          </button>
        </div>

        {/* IMAGE */}
        <div className="mb-6 flex gap-4 items-center">
          {preview ? (
            <img
              src={preview}
              alt="preview"
              className="w-40 h-40 object-contain rounded-xl border bg-gray-50 p-2"
            />
          ) : (
            <div className="w-32 h-32 rounded-xl border flex items-center justify-center text-gray-400">
              No Image
            </div>
          )}

          <div className="flex flex-col gap-3">
            <div className="flex flex-col gap-3">
              <input type="file" onChange={handleImage} />

              <div>
                <p className="text-sm font-medium mb-2">Extra Images</p>

                <input type="file" multiple onChange={handleExtraImages} />
              </div>
            </div>
          </div>
        </div>
        {existingImages?.length > 0 && (
          <div className="mb-6">
            <p className="font-semibold mb-3">Existing Images</p>

            <div className="grid grid-cols-4 gap-4">
              {existingImages.map((img) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.imageUrl)}
                  alt=""
                  className="w-24 h-24 object-cover border rounded-xl"
                />
              ))}
            </div>
          </div>
        )}
        {extraFiles?.length > 0 && (
          <div className="mb-6">
            <p className="font-semibold mb-3">New Images Preview</p>

            <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
              {extraFiles.map((file, index) => (
                <div
                  key={index}
                  className="w-24 h-24 border rounded-xl overflow-hidden bg-gray-50"
                >
                  <img
                    src={URL.createObjectURL(file)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        )}
        {/* FORM */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* NAME */}
          <input
            placeholder="Product name"
            className="border p-3 rounded-xl"
            value={form.name || ""}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />

          {/* PRICE */}
          <input
            type="number"
            placeholder="Price"
            className="border p-3 rounded-xl"
            value={form.price || ""}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
          />

          {/* STOCK */}
          <input
            type="number"
            placeholder="Stock"
            className="border p-3 rounded-xl"
            value={form.stock || ""}
            onChange={(e) =>
              setForm({
                ...form,
                stock: e.target.value,
              })
            }
          />

          {/* CATEGORY */}
          <select
            className="border p-3 rounded-xl"
            value={form.categoryId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                categoryId: e.target.value,
              })
            }
          >
            <option value="">Select category</option>

            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* COLLECTION */}
          <select
            className="border p-3 rounded-xl"
            value={form.collectionId || ""}
            onChange={(e) =>
              setForm({
                ...form,
                collectionId: e.target.value,
              })
            }
          >
            <option value="">Select collection</option>

            {collections.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          {/* GENDER */}
          <select
            className="border p-3 rounded-xl"
            value={form.gender || ""}
            onChange={(e) =>
              setForm({
                ...form,
                gender: e.target.value,
              })
            }
          >
            <option value="">Select gender</option>

            <option value="MEN">Men</option>

            <option value="WOMEN">Women</option>

            <option value="UNISEX">Unisex</option>
          </select>

          {/* MATERIAL */}
          <input
            type="text"
            placeholder="Material"
            className="border p-3 rounded-xl"
            value={form.material || ""}
            onChange={(e) =>
              setForm({
                ...form,
                material: e.target.value,
              })
            }
          />
        </div>

        {/* DESCRIPTION */}
        <textarea
          placeholder="Description"
          className="border p-3 rounded-xl w-full mt-4 h-32"
          value={form.description || ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
        />

        {/* COLORS */}
        <div className="mt-6">
          <label className="font-semibold block mb-2">Colors</label>

          <Select
            isMulti
            options={colors.map((c) => ({
              value: c.id,
              label: c.name,
            }))}
            value={colors
              .filter((c) => form.colorIds?.includes(c.id))
              .map((c) => ({
                value: c.id,
                label: c.name,
              }))}
            onChange={(selected) =>
              setForm({
                ...form,
                colorIds: selected ? selected.map((s) => s.value) : [],
              })
            }
          />
        </div>

        {/* SIZES */}
        <div className="mt-6">
          <label className="font-semibold block mb-2">Sizes</label>

          <Select
            isMulti
            options={sizes.map((s) => ({
              value: s.id,
              label: s.name,
            }))}
            value={sizes
              .filter((s) => form.sizeIds?.includes(s.id))
              .map((s) => ({
                value: s.id,
                label: s.name,
              }))}
            onChange={(selected) =>
              setForm({
                ...form,
                sizeIds: selected ? selected.map((s) => s.value) : [],
              })
            }
          />
        </div>

        {/* FOOTER */}
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={onClose}
            className="px-5 py-3 rounded-xl border hover:bg-gray-100 transition"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={handleSubmit}
            className={`px-5 py-3 rounded-xl text-white transition ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-black hover:bg-gray-800"
            }`}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
