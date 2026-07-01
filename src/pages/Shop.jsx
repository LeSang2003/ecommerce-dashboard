import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { Heart } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import bannerShop from "../assets/bannerShop.jpg";
import { Clock3 } from "lucide-react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css";
import { Search, X } from "lucide-react";
function Shop() {
  const [products, setProducts] = useState([]);

  // SEARCH
  const [search, setSearch] = useState("");
  const [searchHistory, setSearchHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestions = products
    .filter((p) => {
      const keyword = search.toLowerCase();

      return (
        p.name?.toLowerCase().includes(keyword) ||
        p.collection?.name?.toLowerCase().includes(keyword) ||
        p.category?.name?.toLowerCase().includes(keyword) ||
        p.gender?.toLowerCase().includes(keyword)
      );
    })
    .slice(0, 8);
  const [openSearch, setOpenSearch] = useState(false);
  const [openFilter, setOpenFilter] = useState(false);
  // SORT
  const [sort, setSort] = useState("");
  const [category, setCategory] = useState("");
  const [collection, setCollection] = useState("");
  const [collections, setCollections] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 8;
  const [searchParams] = useSearchParams();
  const genderParam = searchParams.get("gender");
  const categoryIdParam = searchParams.get("categoryId");
  useEffect(() => {
    loadProducts();
    loadWishlist();
  }, []);
  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    setSearchHistory(history);
  }, []);
  useEffect(() => {
    const collectionParam = searchParams.get("collection");
    const sortParam = searchParams.get("sort");
    const categoryParam = searchParams.get("categoryId");

    if (collectionParam) setCollection(collectionParam);
    else setCollection("");

    if (sortParam) setSort(sortParam);
    else setSort("");

    if (categoryParam) {
      const found = categories.find(
        (c) =>
          products.find((p) => p.category?.id === Number(categoryParam))
            ?.category?.name === c,
      );

      if (found) setCategory(found);
    } else {
      setCategory("");
    }
  }, [searchParams, products]);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, category, collection, sort]);
  const loadProducts = async () => {
    try {
      const [productsRes, collectionsRes] = await Promise.all([
        API.get("/products"),
        API.get("/collections"),
      ]);

      setProducts(productsRes.data || []);
      setCollections(collectionsRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };
  const categories = [
    ...new Set(products.map((p) => p.category?.name).filter(Boolean)),
  ];

  const toggleWishlist = async (productId) => {
    try {
      const res = await API.post(`/wishlist/${productId}`);

      setWishlistIds((prev) => {
        const next = new Set(prev);

        if (next.has(productId)) {
          next.delete(productId);
        } else {
          next.add(productId);
        }

        return next;
      });

      toast.success(res.data);
    } catch (err) {
      console.log(err);
      toast.error("Wishlist failed");
    }
  };
  const loadWishlist = async () => {
    try {
      const res = await API.get("/wishlist");

      const ids = new Set(
        res.data.filter((item) => item.product).map((item) => item.product.id),
      );

      setWishlistIds(ids);
    } catch (err) {
      console.log(err);
    }
  };
  const saveSearchHistory = (keyword) => {
    if (!keyword.trim()) return;

    let history = JSON.parse(localStorage.getItem("searchHistory")) || [];

    history = history.filter(
      (item) => item.toLowerCase() !== keyword.toLowerCase(),
    );

    history.unshift(keyword);

    history = history.slice(0, 5);

    localStorage.setItem("searchHistory", JSON.stringify(history));

    setSearchHistory(history);
  };

  // =========================
  // FILTER PRODUCTS
  // =========================
  console.log("genderParam =", genderParam);
  console.log(
    products.map((p) => ({
      id: p.id,
      gender: p.gender,
      category: p.category?.id,
    })),
  );
  const filteredProducts = products
    .filter((p) => {
      const keyword = search.toLowerCase();

      return (
        p.name?.toLowerCase().includes(keyword) ||
        p.category?.name?.toLowerCase().includes(keyword) ||
        p.collection?.name?.toLowerCase().includes(keyword) ||
        p.gender?.toLowerCase().includes(keyword)
      );
    })
    .filter((p) =>
      genderParam
        ? p.gender?.toUpperCase() === genderParam.toUpperCase()
        : true,
    )
    .filter((p) =>
      categoryIdParam
        ? p.category?.id === Number(categoryIdParam)
        : category
          ? p.category?.name === category
          : true,
    )
    .filter((p) =>
      collection ? p.collection?.id === Number(collection) : true,
    )
    .filter((p) => p.price >= priceRange[0] && p.price <= priceRange[1])
    .sort((a, b) => {
      if (sort === "price_asc") return a.price - b.price;
      if (sort === "price_desc") return b.price - a.price;
      if (sort === "newest") return b.id - a.id;
      if (sort === "best_seller") return (b.sold || 0) - (a.sold || 0);
      if (sort === "best_rating") return (b.rating || 0) - (a.rating || 0);

      return 0;
    });

  console.log(filteredProducts);
  // =========================
  // PAGINATION
  // =========================

  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const startIndex = (currentPage - 1) * productsPerPage;

  const currentProducts = filteredProducts.slice(
    startIndex,
    startIndex + productsPerPage,
  );
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false);
      setShowHistory(false);
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, []);
  return (
    <>
      {openSearch && (
        <div
          className="
      fixed
      inset-0
      bg-white
      z-[9999]
      p-8
      md:p-16
    "
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-xl uppercase tracking-[0.3em]">Search</h2>

            <button onClick={() => setOpenSearch(false)}>
              <X size={28} />
            </button>
          </div>

          {/* INPUT */}
          <input
            autoFocus
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="
        w-full
        text-3xl
        md:text-5xl
        border-b
        border-black
        pb-4
        outline-none
        font-light
      "
          />

          {/* SUGGESTIONS */}
          {search && suggestions.length > 0 && (
            <div className="mt-10 space-y-4">
              {suggestions.map((p) => (
                <button
                  key={p.id}
                  onClick={() => {
                    setSearch(p.name);
                    saveSearchHistory(p.name);
                    setOpenSearch(false);
                  }}
                  className="
              block
              text-left
              text-xl
              hover:opacity-60
              transition
            "
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* HISTORY */}
          {!search && searchHistory.length > 0 && (
            <div className="mt-10">
              <p className="text-sm text-gray-400 mb-4 uppercase">
                Recent Searches
              </p>

              <div className="space-y-3">
                {searchHistory.map((item, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSearch(item);
                    }}
                    className="
                block
                text-left
                text-lg
                hover:opacity-60
              "
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {/* HERO BANNER */}

      <div className="relative h-[700px] rounded-3xl overflow-hidden mb-16">
        <img
          src={bannerShop}
          alt="Shop Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* HEADER */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* SHOP HEADER */}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold">Shop</h1>

          <button
            onClick={() => setOpenSearch(true)}
            className="
      flex
      items-center
      gap-2
      uppercase
      tracking-[0.2em]
      text-sm
      hover:opacity-60
      transition
    "
          >
            <Search size={18} />
            Search
          </button>
        </div>

        {/* FILTER / SORT BAR */}

        <div className="flex justify-between items-center border-b pb-4 mb-8">
          <button
            onClick={() => setOpenFilter(!openFilter)}
            className="
      flex
      items-center
      gap-2
      uppercase
      tracking-[0.2em]
      text-sm
      hover:opacity-60
    "
          >
            ☰ Filter
          </button>

          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className="
      bg-transparent
      uppercase
      tracking-[0.2em]
      text-sm
      border-none
      outline-none
      cursor-pointer
    "
          >
            <option value="">Sort By</option>
            <option value="newest">Newest</option>
            <option value="best_seller">Best Seller</option>
            <option value="best_rating">Highest Rating</option>
            <option value="price_asc">Price ↑</option>
            <option value="price_desc">Price ↓</option>
          </select>
        </div>
        {openFilter && (
          <div
            className="
      max-w-md
      mb-12
      space-y-6
      animate-fadeIn
    "
          >
            {/* CATEGORY */}
            <div>
              <p className="text-sm mb-2">Category</p>

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="
          w-full
          border
          rounded-xl
          p-3
        "
              >
                <option value="">All Categories</option>

                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* COLLECTION */}
            <div>
              <p className="text-sm mb-2">Collection</p>

              <select
                value={collection}
                onChange={(e) => setCollection(e.target.value)}
                className="
          w-full
          border
          rounded-xl
          p-3
        "
              >
                <option value="">All Collections</option>

                {collections.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* PRICE RANGE */}
            <div>
              <p className="text-sm mb-3">Price Range</p>

              <Slider
                range
                min={0}
                max={20000000}
                step={100000}
                value={priceRange}
                onChange={(value) => setPriceRange(value)}
              />

              <div className="flex justify-between mt-3 text-sm text-gray-500">
                <span>{priceRange[0].toLocaleString()} đ</span>
                <span>{priceRange[1].toLocaleString()} đ</span>
              </div>
            </div>

            {/* RESET */}
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setCollection("");
                setSort("");
                setPriceRange([0, 20000000]);
              }}
              className="
        border
        px-5
        py-3
        rounded-xl
        hover:bg-black
        hover:text-white
        transition
      "
            >
              Clear All
            </button>
          </div>
        )}

        {/* PRODUCTS */}

        {filteredProducts.length === 0 ? (
          <div
            className="
          bg-white
          rounded-3xl
          shadow
          p-16
          text-center
        "
          >
            <h2 className="text-2xl font-bold mb-2">No products found</h2>

            <p className="text-gray-500">Try another keyword</p>
          </div>
        ) : (
          <div
            className="
          grid
          grid-cols-2
          
          lg:grid-cols-4
          gap-x-6
          gap-y-12
        "
          >
            {currentProducts.map((p) => (
              <Link key={p.id} to={`/product/${p.id}`} className="group block">
                {/* IMAGE */}

                <div className="relative overflow-hidden aspect-[3/4] bg-[#f8f8f8]">
                  {/* Wishlist */}
                  <button
                    onClick={async (e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      // addToWishlist(p)
                      await toggleWishlist(p.id);
                    }}
                    className="
    absolute
    top-4
    right-4
    z-20
    opacity-0
    group-hover:opacity-100
    transition-opacity
    duration-300
  "
                  >
                    <Heart
                      size={18}
                      strokeWidth={1.5}
                      className={`
    transition-all
    duration-200
    ${
      wishlistIds.has(p.id)
        ? "fill-black text-black"
        : "text-black hover:fill-black"
    }
  `}
                    />
                  </button>

                  {/* Image 1 */}
                  <img
                    src={
                      (p.images?.length > 0
                        ? p.images[0].imageUrl
                        : p.imageUrl
                      )?.startsWith("http")
                        ? p.images?.length > 0
                          ? p.images[0].imageUrl
                          : p.imageUrl
                        : `http://${import.meta.env.VITE_API_HOST}${
                            p.images?.length > 0
                              ? p.images[0].imageUrl
                              : p.imageUrl
                          }`
                    }
                    alt={p.name}
                    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      object-top
      transition-all
      duration-500
      group-hover:opacity-0
      group-hover:scale-105
    "
                  />

                  {/* Image 2 */}
                  <img
                    src={
                      (p.images?.length > 1
                        ? p.images[1].imageUrl
                        : p.imageUrl
                      )?.startsWith("http")
                        ? p.images?.length > 1
                          ? p.images[1].imageUrl
                          : p.imageUrl
                        : `http://${import.meta.env.VITE_API_HOST}${
                            p.images?.length > 1
                              ? p.images[1].imageUrl
                              : p.imageUrl
                          }`
                    }
                    alt={p.name}
                    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
      object-top
      opacity-0
      transition-all
      duration-500
      group-hover:opacity-100
      group-hover:scale-100
    "
                  />
                </div>
                {/* CONTENT */}

                <div className="pt-3 pb-6">
                  {p.collection && (
                    <div className="text-[10px] uppercase tracking-[0.25em] text-gray-400 mb-1">
                      {p.collection.name}
                    </div>
                  )}

                  <h2 className="text-sm uppercase tracking-wide font-medium">
                    {p.name}
                  </h2>

                  <div className="mt-1 text-sm text-gray-500">
                    {p.price?.toLocaleString()} đ
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <button
              onClick={() => {
                setCurrentPage((p) => Math.max(p - 1, 1));
                window.scrollTo({ top: 700, behavior: "smooth" });
              }}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-xl disabled:opacity-40"
            >
              Prev
            </button>

            {[...Array(totalPages)].map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentPage(index + 1);
                  window.scrollTo({ top: 700, behavior: "smooth" });
                }}
                className={`w-10 h-10 rounded-xl transition
          ${
            currentPage === index + 1
              ? "bg-black text-white"
              : "border hover:bg-gray-100"
          }`}
              >
                {index + 1}
              </button>
            ))}

            <button
              onClick={() => {
                setCurrentPage((p) => Math.min(p + 1, totalPages));
                window.scrollTo({ top: 700, behavior: "smooth" });
              }}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-xl disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </>
  );
}

export default Shop;
