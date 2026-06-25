import { useEffect, useState, useRef } from "react";
import API from "../api/api";
import useDebounce from "../hooks/useDebounce";
import SkeletonRow from "../components/skeletons/SkeletonRow";
import { toast } from "react-toastify";
import ProductModal from "../components/ProductModal";
import { getImageUrl } from "../utils/image";
import ProductCardSkeleton from "../components/skeletons/ProductCardSkeleton";
function ProductPage() {
  const [products, setProducts] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [colors, setColors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [collections, setCollections] = useState([]);
  const [editing, setEditing] = useState(null);

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    categoryId: "",
    collectionId: "",
    material: "",
    gender: "",
    colorIds: [],
    sizeIds: [],
    imageUrl: "",
  });

  const [file, setFile] = useState(null);
  const [extraFiles, setExtraFiles] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const fileRef = useRef();

  // SELECT
  const [selectIds, setSelectIds] = useState([]);

  // FILTER
  const [keyword, setKeyword] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sort, setSort] = useState("");

  // PAGINATION
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const [loading, setLoading] = useState(false);

  const debouncedKeyword = useDebounce(keyword, 500);

  // =========================
  // LOAD STATIC
  // =========================
  useEffect(() => {
    API.get("/sizes").then((res) => setSizes(res.data));

    API.get("/colors").then((res) => setColors(res.data));

    API.get("/categories").then((res) => {
      const unique = res.data.filter(
        (item, index, self) =>
          index === self.findIndex((c) => c.name === item.name),
      );

      setCategories(unique);
    });
    API.get("/collections").then((res) => setCollections(res.data));
  }, []);

  // =========================
  // LOAD PRODUCTS
  // =========================
  const loadProducts = async () => {
    try {
      if (minPrice && maxPrice && Number(minPrice) > Number(maxPrice)) {
        toast.error("Min price cannot exceed max price");
        return;
      }

      setLoading(true);

      const res = await API.get("/admin/products/search", {
        params: {
          keyword: debouncedKeyword || undefined,
          categoryId: categoryId || undefined,
          minPrice: minPrice || undefined,
          maxPrice: maxPrice || undefined,
          page,
          size: 5,
          sort: sort || undefined,
        },
      });

      setProducts(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
    } catch (err) {
      console.log(err);
      toast.error("Load products failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
    setSelectIds([]);
  }, [page, debouncedKeyword, categoryId, minPrice, maxPrice, sort]);

  // =========================
  // SELECT
  // =========================
  const handleSelect = (id) => {
    setSelectIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSelectAll = () => {
    if (products.length > 0 && selectIds.length === products.length) {
      setSelectIds([]);
    } else {
      setSelectIds(products.map((p) => p.id));
    }
  };

  // =========================
  // DELETE
  // =========================
  const handleDelete = async (id) => {
    if (!window.confirm("Delete product?")) return;

    try {
      await API.delete(`/admin/products/${id}`);

      toast.success("Deleted!");

      loadProducts();
    } catch (err) {
      console.log(err);

      toast.error("Delete failed");
    }
  };

  const handleBulkDelete = async () => {
    if (selectIds.length === 0) {
      toast.warning("No products selected");
      return;
    }

    if (!window.confirm(`Delete ${selectIds.length} products?`)) return;

    try {
      await Promise.all(
        selectIds.map((id) => API.delete(`/admin/products/${id}`)),
      );

      toast.success("Deleted!");

      setSelectIds([]);

      loadProducts();
    } catch (err) {
      console.log(err);

      toast.error("Bulk delete failed");
    }
  };

  // =========================
  // UPLOAD IMAGE
  // =========================
  const uploadImage = async () => {
    try {
      // không chọn ảnh mới
      if (!file) {
        return form.imageUrl || "";
      }

      const fd = new FormData();

      fd.append("file", file);

      const res = await API.post("/upload", fd, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("UPLOAD SUCCESS:", res.data);

      return res.data;
    } catch (err) {
      console.log("UPLOAD ERROR:", err.response?.data || err);

      toast.error("Upload image failed");

      throw err;
    }
  };
  // =========================
  // EXTRA IMAGE
  // =========================
  const uploadExtraImages = async (productId) => {
    console.log("UPLOAD EXTRA =", extraFiles);
    if (extraFiles.length === 0) return;

    const fd = new FormData();

    extraFiles.forEach((file) => {
      console.log("APPEND =", file.name);
      fd.append("files", file);
    });

    await API.post(`/admin/products/${productId}/images`, fd, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log("UPLOAD EXTRA DONE");
  };
  // =========================
  // EDIT
  // =========================
  const handleEdit = (p) => {
    console.log("EDIT PRODUCT:", p);
    console.log("IMAGES =", p.images);
    console.log("IMAGES LENGTH =", p.images?.length);
    setFile(null);
    setExtraFiles([]);

    setExistingImages(p.images || []);

    setEditing(p.id);

    setForm({
      id: p.id,

      name: p.name || "",
      description: p.description || "",
      price: p.price || 0,
      stock: p.stock || 0,

      imageUrl: p.imageUrl || "",

      // category
      categoryId: p.category?.id ?? "",

      collectionId: p.collection?.id ?? "",
      material: p.material || "",
      gender: p.gender || "",
      // colors
      colorIds: Array.isArray(p.colors)
        ? p.colors.map((c) => Number(c.id))
        : [],

      // sizes
      sizeIds: Array.isArray(p.sizes) ? p.sizes.map((s) => Number(s.id)) : [],
    });
    // reset input file
    if (fileRef.current) {
      fileRef.current.value = "";
    }
  };

  // =========================
  // UPDATE
  // =========================
  const handleUpdate = async () => {
    try {
      const imageUrl = await uploadImage();

      const payload = {
        name: form.name?.trim() || "",
        description: form.description || "",
        price: Number(form.price) || 0,
        stock: Number(form.stock) || 0,
        collectionId: form.collectionId ? Number(form.collectionId) : null,

        material: form.material,
        gender: form.gender,
        imageUrl,

        categoryId: form.categoryId ? Number(form.categoryId) : null,

        colorIds: Array.isArray(form.colorIds) ? form.colorIds.map(Number) : [],

        sizeIds: Array.isArray(form.sizeIds) ? form.sizeIds.map(Number) : [],
      };

      console.log("UPDATE PAYLOAD:", payload);

      await API.put(`/admin/products/${editing}`, payload);

      await uploadExtraImages(editing);

      toast.success("Updated!");

      setEditing(null);
      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",

        categoryId: "",
        collectionId: "",

        material: "",
        gender: "",

        colorIds: [],
        sizeIds: [],

        imageUrl: "",
      });
      setFile(null);
      setExtraFiles([]);
      await loadProducts();

      return true;
    } catch (err) {
      console.log("UPDATE ERROR:", err.response?.data || err);

      toast.error("Update failed");

      throw err;
    }
  };
  // =========================
  // CREATE
  // =========================

  const handleCreate = async () => {
    try {
      const imageUrl = await uploadImage();

      const payload = {
        name: form.name,
        description: form.description,

        price: Number(form.price),
        stock: Number(form.stock),

        imageUrl,

        categoryId: Number(form.categoryId),

        collectionId: form.collectionId ? Number(form.collectionId) : null,

        material: form.material,

        gender: form.gender,

        colorIds: form.colorIds || [],
        sizeIds: form.sizeIds || [],
      };

      const res = await API.post("/admin/products", payload);

      await uploadExtraImages(res.data.id);

      toast.success("Created");

      setEditing(null);

      setForm({
        name: "",
        description: "",
        price: "",
        stock: "",

        categoryId: "",
        collectionId: "",

        material: "",
        gender: "",

        colorIds: [],
        sizeIds: [],

        imageUrl: "",
      });

      setFile(null);
      setExtraFiles([]);
      loadProducts();
    } catch (err) {
      console.log(err);

      toast.error("Create failed");
    }
  };
  return (
    <div className="p-6">
      {/* HEADER */}
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Product Management</h1>

        <div className="flex gap-3">
          {/* CREATE PRODUCT */}
          <button
            onClick={() => {
              setEditing("create");

              setForm({
                name: "",
                description: "",
                price: "",
                stock: "",

                categoryId: "",
                collectionId: "",

                material: "",
                gender: "",

                colorIds: [],
                sizeIds: [],

                imageUrl: "",
              });

              setFile(null);
              setExtraFiles([]);
              if (fileRef.current) {
                fileRef.current.value = "";
              }
            }}
            className="px-5 py-2 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition"
          >
            + Add Product
          </button>

          {/* DELETE SELECTED */}
          <button
            onClick={handleBulkDelete}
            disabled={selectIds.length === 0}
            className={`px-5 py-2 rounded-xl text-white font-medium transition ${
              selectIds.length === 0
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-red-500 hover:bg-red-600"
            }`}
          >
            Delete Selected ({selectIds.length})
          </button>
        </div>
      </div>
      {/* FILTER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <input
          placeholder="Search products..."
          value={keyword}
          onChange={(e) => {
            setKeyword(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm"
        />

        <select
          value={categoryId}
          onChange={(e) => {
            setCategoryId(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm"
        >
          <option value="">All Categories</option>

          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Min price"
          value={minPrice}
          onChange={(e) => {
            setMinPrice(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm"
        />

        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => {
            setMaxPrice(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm"
        />

        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            setPage(0);
          }}
          className="border border-gray-300 bg-white px-4 py-3 rounded-xl shadow-sm"
        >
          <option value="">Sort</option>

          <option value="price,asc">Price ↑</option>

          <option value="price,desc">Price ↓</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-4">
                <input
                  type="checkbox"
                  checked={
                    products.length > 0 && selectIds.length === products.length
                  }
                  onChange={handleSelectAll}
                />
              </th>

              <th className="p-4 text-left">Image</th>
              <th className="p-4 text-left">Name</th>
              <th className="p-4 text-left">Price</th>
              <th className="p-4 text-left">Stock</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Collection</th>

              <th className="p-4 text-left">Material</th>
              <th className="p-4 text-left">Colors</th>
              <th className="p-4 text-left">Sizes</th>
              <th className="p-4 text-left">Action</th>
            </tr>
          </thead>

          <tbody>
            {loading
              ? [...Array(5)].map((_, i) => <SkeletonRow key={i} />)
              : products.map((p) => (
                  <tr key={p.id} className="border-b hover:bg-gray-50">
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={selectIds.includes(p.id)}
                        onChange={() => handleSelect(p.id)}
                      />
                    </td>

                    <td className="p-4">
                      <img
                        src={getImageUrl(p.imageUrl)}
                        alt={p.name}
                        className="w-14 h-14 object-cover rounded-lg border"
                      />
                    </td>

                    <td className="p-4">{p.name}</td>

                    <td className="p-4 text-green-600 font-semibold">
                      {p.price?.toLocaleString()} đ
                    </td>

                    <td className="p-4">{p.stock}</td>

                    <td className="p-4">{p.category?.name}</td>
                    <td className="p-4">
                      <div className="text-sm">
                        <div>{p.collection?.name || "-"}</div>
                        <div className="text-gray-500">{p.gender || "-"}</div>
                      </div>
                    </td>
                    <td className="p-4">{p.material || "-"}</td>
                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {p.colors?.map((c) => (
                          <span
                            key={c.id}
                            className="bg-blue-100 text-blue-700 px-2 py-1 rounded-lg text-xs"
                          >
                            {c.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex flex-wrap gap-2">
                        {p.sizes?.map((s) => (
                          <span
                            key={s.id}
                            className="bg-purple-100 text-purple-700 px-2 py-1 rounded-lg text-xs"
                          >
                            {s.name}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(p)}
                          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDelete(p.id)}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
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

      {/* PAGINATION */}
      <div className="flex justify-center gap-2 mt-6">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`px-4 py-2 rounded-xl border ${
              page === i ? "bg-blue-500 text-white border-blue-500" : "bg-white"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* MODAL */}
      <ProductModal
        open={editing !== null}
        onClose={() => {
          setEditing(null);
          setFile(null);
          setExtraFiles([]);
          setExistingImages([]);

          if (fileRef.current) {
            fileRef.current.value = "";
          }
        }}
        onSave={editing === "create" ? handleCreate : handleUpdate}
        form={form}
        setForm={setForm}
        categories={categories}
        collections={collections}
        colors={colors}
        sizes={sizes}
        setFile={setFile}
        fileRef={fileRef}
        extraFiles={extraFiles}
        setExtraFiles={setExtraFiles}
        existingImages={existingImages}
      />
    </div>
  );
}

export default ProductPage;
