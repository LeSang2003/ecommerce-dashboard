import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { toast } from "react-toastify";

function ProductCard({ product }) {
  const image =
    product.images?.length > 0 ? product.images[0].imageUrl : product.imageUrl;

  const imageUrl = image?.startsWith("http")
    ? image
    : `http://${import.meta.env.VITE_API_HOST}${image}`;

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative overflow-hidden">
        <img
          src={imageUrl}
          alt={product.name}
          className="
            w-full
            h-[550px]
            object-cover
            transition
            duration-700
            group-hover:scale-105
          "
        />

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            bg-black
            text-white
            text-center
            py-4
            uppercase
            tracking-[4px]
            translate-y-full
            group-hover:translate-y-0
            transition
          "
        >
          Quick View
        </div>
      </div>

      <div className="mt-5">
        <h3
          className="
            uppercase
            tracking-wide
            text-sm
            font-medium
          "
        >
          {product.name}
        </h3>

        <p className="text-gray-500 text-xs mt-2">Premium Luxury Wear</p>

        <p className="mt-3 text-sm font-semibold">
          {product.price?.toLocaleString()} đ
        </p>
      </div>
    </Link>
  );
}

export default ProductCard;
