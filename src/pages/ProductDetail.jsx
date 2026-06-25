import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";
import { Star, Heart } from "lucide-react";
import ProductCard from "../components/ProductCard";
import ProductDetailSkeleton from "../components/skeletons/ProductDetailSkelelton";
function ProductDetail() {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [quantity, setQuantity] = useState(1);

  const [selectedColor, setSelectedColor] = useState("");

  const [selectedSize, setSelectedSize] = useState("");

  const [mainImage, setMainImage] = useState("");

  const [showGallery, setShowGallery] = useState(false);

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const [relatedProducts, setRelatedProducts] = useState([]);

  const [recentProducts, setRecentProducts] = useState([]);

  const [showSizeGuide, setShowSizeGuide] = useState(false);

  const [activeTab, setActiveTab] = useState("description");

  // REVIEW
  const [reviews, setReviews] = useState([]);

  const [averageRating, setAverageRating] = useState(0);

  const [rating, setRating] = useState(5);

  const [hoverRating, setHoverRating] = useState(0);

  const [comment, setComment] = useState("");

  const [reviewImage, setReviewImage] = useState("");

  const [uploadingReview, setUploadingReview] = useState(false);

  const [editImage, setEditImage] = useState("");

  const [reviewOrderId, setReviewOrderId] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const [editingReviewId, setEditingReviewId] = useState(null);

  const [editRating, setEditRating] = useState(5);

  const [editComment, setEditComment] = useState("");

  const [reviewPage, setReviewPage] = useState(1);
  const REVIEWS_PER_PAGE = 5;

  const reviewStats = {
    5: reviews.filter((r) => r.rating === 5).length,
    4: reviews.filter((r) => r.rating === 4).length,
    3: reviews.filter((r) => r.rating === 3).length,
    2: reviews.filter((r) => r.rating === 2).length,
    1: reviews.filter((r) => r.rating === 1).length,
  };
  const totalPages = Math.ceil(reviews.length / REVIEWS_PER_PAGE);

  const currentReviews = reviews.slice(
    (reviewPage - 1) * REVIEWS_PER_PAGE,
    reviewPage * REVIEWS_PER_PAGE,
  );
  const myReview = reviews.find((r) => r.userId === currentUser?.id);
  //WISHLIST
  const [isWishlisted, setIsWishlisted] = useState(false);

  const { addToCart } = useCart();
  const allImages = product
    ? [
        {
          imageUrl: product.imageUrl,
        },
        ...(product.images || []),
      ]
    : [];
  useEffect(() => {
    if (product) {
      console.log("MAIN =", product.imageUrl);
      console.log("IMAGES =", product.images);
      console.log("COUNT =", product.images?.length);
    }
  }, [product]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showGallery || allImages.length === 0) return;

      if (e.key === "ArrowRight") {
        setCurrentImageIndex((prev) => (prev + 1) % allImages.length);
      }

      if (e.key === "ArrowLeft") {
        setCurrentImageIndex(
          (prev) => (prev - 1 + allImages.length) % allImages.length,
        );
      }

      if (e.key === "Escape") {
        setShowGallery(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [showGallery, allImages]);
  // =========================
  // FETCH PRODUCT
  // =========================

  const fetchProduct = async () => {
    try {
      const res = await API.get(`/products/${id}`);

      setProduct(res.data);
      // ===== SAVE RECENTLY VIEWED =====
      const recent = JSON.parse(localStorage.getItem("recentProducts") || "[]");

      // bỏ sản phẩm hiện tại nếu đã tồn tại
      const filtered = recent.filter((item) => item.id !== res.data.id);

      // thêm sản phẩm mới lên đầu
      const updated = [res.data, ...filtered].slice(0, 8);

      // lưu tối đa 8 sản phẩm
      localStorage.setItem("recentProducts", JSON.stringify(updated));

      // cập nhật state (không hiển thị chính nó)
      setRecentProducts(updated.filter((item) => item.id !== res.data.id));

      setMainImage(
        res.data.imageUrl?.startsWith("http")
          ? res.data.imageUrl
          : `http://localhost:8085${res.data.imageUrl}`,
      );
    } catch (err) {
      console.log(err);
      toast.error("Failed to load product");
    }
  };

  // =========================
  // FETCH RELATED
  // =========================
  const fetchRelatedProducts = async () => {
    try {
      const res = await API.get(`/products/${id}/related`);
      setRelatedProducts(res.data);
    } catch (err) {
      console.log("RELATED ERROR:", err);
      toast.error("Failed to load related products");
      setRelatedProducts([]);
    }
  };
  // =========================
  // FETCH REVIEWS
  // =========================

  const fetchReviews = async () => {
    try {
      const reviewRes = await API.get(`/reviews/product/${id}`);

      setReviews(reviewRes.data);

      const avgRes = await API.get(`/reviews/product/${id}/average`);

      setAverageRating(avgRes.data);
    } catch (err) {
      console.log(err);
      toast.error("Failed to load reviews");
    }
  };

  // =========================
  // FIND ORDER
  // =========================

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await API.get("/orders/my-orders?page=0&size=1000");
      console.log("MY ORDERS:", res.data);
      console.log("PRODUCT ID =", Number(id));
      const completedOrder = res.data.content.find(
        (order) =>
          order.status === "COMPLETED" &&
          order.items?.some((item) => item.productId === Number(id)),
      );
      console.log("FOUND ORDER:", completedOrder);

      if (completedOrder) {
        setReviewOrderId(completedOrder.orderId);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await API.get("/users/me");

      setCurrentUser(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // USE EFFECT
  // =========================

  useEffect(() => {
    window.scrollTo(0, 0);

    setProduct(null);
    setSelectedColor("");
    setSelectedSize("");
    setQuantity(1);
    setMainImage("");
    setReviewOrderId(null);
    setReviews([]);
    setAverageRating(0);
    setComment("");

    fetchProduct();
    fetchReviews();
    fetchMyOrders();
    fetchCurrentUser();
    fetchWishlistStatus();
    fetchRelatedProducts();
  }, [id]);

  // =========================
  // CHECK WISHLIST
  // =========================

  const fetchWishlistStatus = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) return;

      const res = await API.get("/wishlist");

      const exists = res.data.some((item) => item.product.id === Number(id));

      setIsWishlisted(exists);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // TOGGLE WISHLIST
  // =========================

  const handleWishlist = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        toast.error("Please login first");

        return;
      }

      if (isWishlisted) {
        await API.delete(`/wishlist/${id}`);

        setIsWishlisted(false);

        toast.success("Removed from wishlist");
      } else {
        await API.post(`/wishlist/${id}`);

        setIsWishlisted(true);

        toast.success("Added to wishlist");
      }
    } catch (err) {
      console.log(err);

      toast.error("Wishlist failed");
    }
  };

  // =========================
  // ADD TO CART
  // =========================

  const handleAdd = () => {
    if (!selectedColor) {
      toast.error("Please select color");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select size");
      return;
    }

    if (product.stock <= 0) {
      toast.error("Out of stock");
      return;
    }

    addToCart(product, quantity, selectedColor, selectedSize);

    toast.success("Added to cart");
  };

  // =========================
  // CREATE REVIEW
  // =========================

  const handleReview = async () => {
    try {
      if (!reviewOrderId) {
        toast.error("You must buy and complete this product first");

        return;
      }

      if (!comment.trim()) {
        toast.error("Please enter review comment");

        return;
      }

      const payload = {
        productId: Number(id),
        orderId: reviewOrderId,
        rating,
        comment,
        imageUrl: reviewImage,
      };

      console.log("REVIEW PAYLOAD:", payload);

      await API.post("/reviews", payload);

      toast.success("Review added");

      setComment("");

      setRating(5);
      setReviewImage("");

      fetchReviews();
    } catch (err) {
      console.log(err);

      toast.error(
        err.response?.data?.message || err.response?.data || "Review failed",
      );
    }
  };
  const uploadReviewImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      setUploadingReview(true);

      const form = new FormData();

      form.append("file", file);

      const res = await API.post("/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setReviewImage(res.data);

      toast.success("Image uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    } finally {
      setUploadingReview(false);
    }
  };

  const uploadEditImage = async (e) => {
    try {
      const file = e.target.files[0];

      if (!file) return;

      const form = new FormData();

      form.append("file", file);

      const res = await API.post("/upload", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setEditImage(res.data);

      toast.success("Image uploaded");
    } catch (err) {
      console.log(err);
      toast.error("Upload failed");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete this review?")) {
      return;
    }
    try {
      await API.delete(`/reviews/${reviewId}`);

      toast.success("Review deleted");

      fetchReviews();
    } catch (err) {
      console.log(err);

      toast.error("Delete failed");
    }
  };

  const handleUpdateReview = async (reviewId) => {
    console.log("UPDATE IMAGE =", editImage);

    try {
      await API.put(`/reviews/${reviewId}`, {
        rating: editRating,
        comment: editComment,
        imageUrl: editImage,
      });

      toast.success("Review updated");

      setEditingReviewId(null);
      setEditImage("");
      fetchReviews();
    } catch (err) {
      console.log(err);

      toast.error("Update failed");
    }
  };

  // =========================
  // STARS
  // =========================

  const renderStars = (value, size = 20) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={
              star <= value
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }
          />
        ))}
      </div>
    );
  };

  useEffect(() => {
    if (!showGallery || allImages.length === 0) return;

    const img = allImages[currentImageIndex];

    const url = img.imageUrl?.startsWith("http")
      ? img.imageUrl
      : `http://localhost:8085${img.imageUrl}`;

    setMainImage(url);
  }, [showGallery, currentImageIndex, allImages]);

  if (!product) {
    return <ProductDetailSkeleton />;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 md:p-10">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="mt-10 mb-6 border px-4 py-2 rounded-xl hover:bg-gray-100 transition"
      >
        ← Back
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14">
        {/* IMAGE */}
        <div>
          {/* MAIN IMAGE */}

          <div className="flex gap-4">
            {/* THUMBNAILS */}
            <div className="flex flex-col gap-3">
              {allImages.map((img, index) => {
                const imageSrc = img.imageUrl?.startsWith("http")
                  ? img.imageUrl
                  : `http://localhost:8085${img.imageUrl}`;

                return (
                  <button
                    key={index}
                    onMouseEnter={() => setMainImage(imageSrc)}
                    onClick={() => setMainImage(imageSrc)}
                    className={`
            w-20 h-24
            overflow-hidden
            border
            transition
            ${
              mainImage === imageSrc
                ? "border-black"
                : "border-gray-200 hover:border-gray-500"
            }
          `}
                  >
                    <img
                      src={imageSrc}
                      className="w-full h-full object-cover"
                    />
                  </button>
                );
              })}
            </div>

            {/* MAIN IMAGE */}
            {/* MAIN IMAGE */}
            <div
              className="flex-1 rounded-3xl overflow-hidden cursor-zoom-in"
              onClick={() => {
                const index = allImages.findIndex((img) => {
                  const url = img.imageUrl?.startsWith("http")
                    ? img.imageUrl
                    : `http://localhost:8085${img.imageUrl}`;
                  return url === mainImage;
                });

                setCurrentImageIndex(index >= 0 ? index : 0);
                setShowGallery(true);
              }}
            >
              <img
                src={mainImage}
                alt={product.name}
                className="
      w-full
      h-[750px]
      object-cover
      transition-transform
      duration-700
      hover:scale-105
    "
              />
            </div>
          </div>
        </div>

        {/* INFO */}
        <div>
          {product.collection && (
            <Link
              to={`/collection/${product.collection.slug}`}
              className="
                 uppercase
                  tracking-[0.35em]
                  text-xs
                  text-gray-500
                  font-medium
                  hover:text-black
              "
            >
              {product.collection.name}
            </Link>
          )}

          <h1 className="text-5xl font-bold mb-5">{product.name}</h1>

          {/* PRICE */}
          <div className="text-3xl text-green-600 font-bold mb-2">
            {product.price?.toLocaleString()} đ
          </div>

          <div className="text-sm text-gray-500 mb-4">
            Stock: {product.stock}
          </div>

          {/* AVG */}
          <div className="flex items-center gap-4 mb-6">
            {renderStars(Math.round(averageRating), 24)}

            <div className="font-semibold text-lg">
              {averageRating?.toFixed(1)} / 5
            </div>

            <div className="text-gray-500">({reviews.length} reviews)</div>
          </div>

          {/* DESCRIPTION */}
          <div className="mb-10">
            <div className="flex gap-6 border-b mb-5">
              <button
                onClick={() => setActiveTab("description")}
                className={`pb-3 ${
                  activeTab === "description"
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
              >
                Description
              </button>

              <button
                onClick={() => setActiveTab("materials")}
                className={`pb-3 ${
                  activeTab === "materials"
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
              >
                Materials
              </button>

              <button
                onClick={() => setActiveTab("shipping")}
                className={`pb-3 ${
                  activeTab === "shipping"
                    ? "border-b-2 border-black font-bold"
                    : ""
                }`}
              >
                Shipping
              </button>
            </div>

            {activeTab === "description" && (
              <p className="text-gray-600 leading-8">{product.description}</p>
            )}

            {activeTab === "materials" && (
              <div className="text-gray-600 leading-8 whitespace-pre-line">
                {product.material || "No material information available."}
              </div>
            )}

            {activeTab === "shipping" && (
              <div className="text-gray-600 leading-8">
                Free shipping for orders over 1,000,000đ.
                <br />
                Delivery time: 2-5 business days.
              </div>
            )}
          </div>

          {/* COLORS */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-lg">Colors</h3>

            <div className="flex gap-3 flex-wrap">
              {product.colors?.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setSelectedColor(c.name)}
                  className={`px-5 py-3 rounded-2xl border transition-all ${
                    selectedColor === c.name
                      ? "bg-black text-white scale-105"
                      : "bg-white hover:bg-gray-100"
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>

          {/* SIZES */}
          <div className="mb-6">
            <h3 className="font-bold mb-3 text-lg">Sizes</h3>

            <div className="flex gap-3 flex-wrap">
              {[...(product.sizes || [])]
                .sort((a, b) => {
                  const order = ["S", "M", "L", "XL"];
                  return order.indexOf(a.name) - order.indexOf(b.name);
                })
                .map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setSelectedSize(s.name)}
                    className={`px-5 py-3 rounded-2xl border transition-all ${
                      selectedSize === s.name
                        ? "bg-black text-white scale-105"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {s.name}
                  </button>
                ))}
            </div>
          </div>

          {/* QUANTITY */}
          <div className="mb-8">
            <h3 className="font-bold mb-3 text-lg">Quantity</h3>

            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => {
                const value = Math.max(1, parseInt(e.target.value) || 1);

                setQuantity(value);
              }}
              className="
                border
                p-4
                rounded-2xl
                w-28
                text-center
                text-lg
              "
            />
          </div>

          {/* ACTIONS */}
          <div className="flex gap-4">
            {/* ADD CART */}
            <button
              onClick={handleAdd}
              disabled={product.stock <= 0}
              className={`
                px-10
                py-4
                rounded-2xl
                transition
                text-lg
                font-semibold
                shadow-lg
                    ${
                      product.stock <= 0
                        ? "bg-gray-400 cursor-not-allowed text-white"
                        : "bg-black hover:bg-gray-800 text-white"
                    }
                `}
            >
              {product.stock <= 0 ? "Out of Stock" : "Add To Cart"}
            </button>

            {/* WISHLIST */}
            <button
              onClick={handleWishlist}
              className={`
                border
                px-5
                py-4
                rounded-2xl
                transition
                shadow-sm
              ${
                isWishlisted
                  ? "bg-red-500 text-white border-red-500"
                  : "bg-white hover:bg-gray-100"
              }
              `}
            >
              <Heart size={24} className={isWishlisted ? "fill-white" : ""} />
            </button>
          </div>

          {/* REVIEW FORM */}

          {reviewOrderId && !myReview ? (
            <div className="mt-14 border-t pt-8">
              <h2 className="text-3xl font-bold mb-6">Write Review</h2>

              {/* STARS */}
              <div className="mb-6">
                <h3 className="font-semibold mb-3">Your Rating</h3>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      onClick={() => setRating(star)}
                      className="transition hover:scale-125"
                    >
                      <Star
                        size={34}
                        className={
                          star <= (hoverRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* COMMENT */}

              <textarea
                placeholder="Write your review..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="
        border
        p-5
        rounded-2xl
        w-full
        h-36
        focus:outline-none
        focus:ring-2
        focus:ring-black
      "
              />
              <input
                type="file"
                accept="image/*"
                onChange={uploadReviewImage}
                className="mb-4"
              />
              {reviewImage && (
                <img
                  src={
                    reviewImage.startsWith("http")
                      ? reviewImage
                      : `http://localhost:8085${reviewImage}`
                  }
                  alt=""
                  className="
      mt-4
      w-32
      h-32
      object-cover
      rounded-xl
      border
    "
                />
              )}

              <button
                onClick={handleReview}
                disabled={uploadingReview}
                className="
    mt-5
    bg-yellow-500
    hover:bg-yellow-600
    text-white
    px-8
    py-4
    rounded-2xl
    transition
    font-semibold
    disabled:opacity-50
  "
              >
                {uploadingReview ? "Uploading..." : "Submit Review"}
              </button>
            </div>
          ) : myReview ? (
            <div
              className="
      mt-14
      bg-green-50
      border
      border-green-200
      text-green-700
      px-6
      py-5
      rounded-3xl
    "
            >
              Thank you for your review ❤️
              <div className="text-sm mt-2">
                You can edit or delete your review below.
              </div>
            </div>
          ) : (
            <div
              className="
      mt-14
      bg-yellow-50
      border
      border-yellow-200
      text-yellow-700
      px-6
      py-5
      rounded-3xl
    "
            >
              You need to purchase and complete this product before reviewing.
            </div>
          )}

          {/* REVIEWS */}
          <div className="mt-14">
            <h2 className="text-3xl font-bold mb-8">Customer Reviews</h2>
            <div className="mb-8 bg-gray-50 p-5 rounded-2xl">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className="flex items-center gap-3 mb-2">
                  <span className="w-12">{star} ★</span>

                  <div className="flex-1 bg-gray-200 h-2 rounded">
                    <div
                      className="bg-yellow-400 h-2 rounded"
                      style={{
                        width:
                          reviews.length === 0
                            ? "0%"
                            : `${(reviewStats[star] / reviews.length) * 100}%`,
                      }}
                    />
                  </div>

                  <span className="w-8 text-right">{reviewStats[star]}</span>
                </div>
              ))}
            </div>
            {reviews.length === 0 ? (
              <div className="text-gray-500">No reviews yet</div>
            ) : (
              <div className="space-y-6">
                {currentReviews.map((r) => (
                  <div
                    key={r.id}
                    className="
                      bg-white
                      border
                      border-gray-100
                      rounded-3xl
                      p-6
                      shadow-sm
                      hover:shadow-xl
                      hover:-translate-y-1
                      transition-all
                      duration-300
                    "
                  >
                    {/* TOP */}
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        {/* AVATAR */}
                        <img
                          src={
                            r.avatar
                              ? r.avatar.startsWith("http")
                                ? r.avatar
                                : `http://localhost:8085${r.avatar}`
                              : `https://ui-avatars.com/api/?name=${r.username}`
                          }
                          alt={r.username}
                          className="
                            w-14
                            h-14
                            rounded-full
                            object-cover
                            border
                          "
                        />

                        <div>
                          {/* USERNAME */}
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-lg">{r.username}</h3>

                            <span
                              className="
                                text-xs
                                bg-green-100
                                text-green-700
                                px-2
                                py-1
                                rounded-full
                                font-medium
                              "
                            >
                              Verified Purchase
                            </span>
                          </div>

                          {/* STARS */}
                          <div className="flex items-center gap-1 mt-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={18}
                                className={
                                  star <= r.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* DATE */}
                      <div className="text-right">
                        <div className="text-sm text-gray-400">
                          {new Date(r.createdAt).toLocaleDateString()}
                        </div>

                        {currentUser?.id === r.userId && (
                          <div className="flex gap-2 mt-2 justify-end">
                            <button
                              onClick={() => {
                                setEditingReviewId(r.id);
                                setEditRating(r.rating);
                                setEditComment(r.comment);
                                setEditImage(r.imageUrl || "");
                              }}
                              className="text-blue-500 text-sm"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteReview(r.id)}
                              className="text-red-500 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* COMMENT */}
                    {editingReviewId === r.id ? (
                      <div className="mt-5">
                        <textarea
                          value={editComment}
                          onChange={(e) => setEditComment(e.target.value)}
                          className="border p-3 rounded-xl w-full"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={uploadEditImage}
                          className="mt-3"
                        />
                        {editImage && (
                          <img
                            src={
                              editImage.startsWith("http")
                                ? editImage
                                : `http://localhost:8085${editImage}`
                            }
                            alt=""
                            className="
      mt-3
      w-32
      h-32
      object-cover
      rounded-xl
      border
    "
                          />
                        )}

                        <div className="flex gap-2 mt-3">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => setEditRating(star)}
                            >
                              <Star
                                size={24}
                                className={
                                  star <= editRating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                                }
                              />
                            </button>
                          ))}
                        </div>

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => handleUpdateReview(r.id)}
                            className="bg-green-500 text-white px-4 py-2 rounded-xl"
                          >
                            Save
                          </button>

                          <button
                            onClick={() => setEditingReviewId(null)}
                            className="bg-gray-300 px-4 py-2 rounded-xl"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="mt-5 text-gray-700 leading-8 text-[15px]">
                          {r.comment}
                        </div>

                        {r.imageUrl && (
                          <img
                            src={
                              r.imageUrl.startsWith("http")
                                ? r.imageUrl
                                : `http://localhost:8085${r.imageUrl}`
                            }
                            alt="Review"
                            className="
          mt-4
          w-40
          h-40
          object-cover
          rounded-xl
          border
        "
                          />
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setReviewPage(index + 1)}
                    className={`px-4 py-2 rounded ${
                      reviewPage === index + 1
                        ? "bg-black text-white"
                        : "border"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      {/* FULLSCREEN GALLERY */}
      {showGallery && (
        <div
          className="
      fixed
      inset-0
      bg-black/95
      z-[9999]
      flex
      items-center
      justify-center
    "
        >
          {/* CLOSE */}
          <button
            onClick={() => setShowGallery(false)}
            className="
        absolute
        top-8
        right-8
        text-white
        text-5xl
        hover:opacity-70
      "
          >
            ×
          </button>

          {/* PREV */}
          <button
            onClick={() =>
              setCurrentImageIndex(
                (prev) => (prev - 1 + allImages.length) % allImages.length,
              )
            }
            className="
        absolute
        left-8
        text-white
        text-5xl
      "
          >
            ‹
          </button>

          {/* IMAGE */}
          <img
            src={
              allImages[currentImageIndex].imageUrl.startsWith("http")
                ? allImages[currentImageIndex].imageUrl
                : `http://localhost:8085${allImages[currentImageIndex].imageUrl}`
            }
            className="
        max-h-[90vh]
        max-w-[85vw]
        object-contain
      "
            alt=""
          />

          {/* NEXT */}
          <button
            onClick={() =>
              setCurrentImageIndex((prev) => (prev + 1) % allImages.length)
            }
            className="
        absolute
        right-8
        text-white
        text-5xl
      "
          >
            ›
          </button>
        </div>
      )}
      {/* RELATED PRODUCTS */}
      <div className="mt-24">
        <h2 className="text-4xl font-bold tracking-wide mb-10">
          You May Also Like
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {relatedProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      </div>

      {/* RECENTLY VIEWED */}
      {recentProducts.length > 0 && (
        <div className="mt-24">
          <h2 className="text-4xl font-bold tracking-wide mb-10">
            Recently Viewed
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProducts
              .filter((item) => !relatedProducts.some((r) => r.id === item.id))
              .slice(0, 4)
              .map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;
