import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";
import { Heart } from "lucide-react";
import { toast } from "react-toastify";

function Wishlist() {
  const [wishlist, setWishlist] = useState([]);

  // =========================
  // FETCH
  // =========================

  const fetchWishlist = async () => {
    try {
      const res = await API.get("/wishlist");

      setWishlist(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  // =========================
  // REMOVE
  // =========================

  const removeWishlist = async (productId) => {
    try {
      await API.delete(`/wishlist/${productId}`);

      toast.success("Removed from wishlist");

      fetchWishlist();
    } catch (err) {
      console.log(err);

      toast.error("Remove failed");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-4xl font-bold mb-10">My Wishlist ❤️</h1>

      {wishlist.length === 0 ? (
        <div
          className="
      flex
      flex-col
      items-center
      justify-center
      py-24
      text-center
    "
        >
          <div
            className="
        w-28
        h-28
        rounded-full
        bg-red-50
        flex
        items-center
        justify-center
        mb-6
      "
          >
            ❤️
          </div>

          <h2 className="text-3xl font-bold mb-3">Wishlist is Empty</h2>

          <p className="text-gray-500 max-w-md mb-8">
            Save your favorite products and find them here later.
          </p>

          <Link
            to="/shop"
            className="
        bg-black
        text-white
        px-8
        py-4
        rounded-2xl
        hover:bg-gray-800
        transition
      "
          >
            Explore Products
          </Link>
        </div>
      ) : (
        <div
          className="
          grid
          grid-cols-1
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-4
          gap-8
        "
        >
          {wishlist.map((item) => {
            if (!item.product) return null;

            const product = item.product;

            return (
              <div
                key={item.id}
                className="
                  bg-white
                  rounded-3xl
                  shadow-sm
                  border
                  overflow-hidden
                  hover:shadow-2xl
                  hover:-translate-y-2
                  duration-300
                  transition-all
                "
              >
                {/* IMAGE */}
                <Link to={`/product/${product.id}`}>
                  <div className="relative overflow-hidden aspect-[3/4] bg-[#f8f8f8]">
                    <img
                      src={
                        (product.images?.length > 0
                          ? product.images[0].imageUrl
                          : product.imageUrl
                        )?.startsWith("http")
                          ? product.images?.length > 0
                            ? product.images[0].imageUrl
                            : product.imageUrl
                          : `http://localhost:8085${
                              product.images?.length > 0
                                ? product.images[0].imageUrl
                                : product.imageUrl
                            }`
                      }
                      alt={product.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                    />
                  </div>
                </Link>

                {/* INFO */}
                <div className="p-5">
                  <h2
                    className="
                    font-bold
                    text-lg
                    mb-2
                    line-clamp-1
                  "
                  >
                    {product.name}
                  </h2>

                  <div
                    className="
                    text-green-600
                    font-bold
                    text-xl
                    mb-5
                  "
                  >
                    {product.price?.toLocaleString()} đ
                  </div>

                  {/* ACTIONS */}
                  <div className="flex justify-between items-center">
                    <Link
                      to={`/product/${product.id}`}
                      className="
                        bg-black
                        text-white
                        px-5
                        py-2
                        rounded-xl
                        hover:bg-gray-800
                        transition
                      "
                    >
                      View
                    </Link>

                    <button
                      onClick={() => removeWishlist(product.id)}
                      className="
                        text-red-500
                        hover:scale-110
                        transition
                      "
                    >
                      <Heart
                        className="
                          fill-red-500
                        "
                      />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Wishlist;
