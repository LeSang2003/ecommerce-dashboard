import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import ProductCard from "../components/ProductCard";
function Home() {
  const [products, setProducts] = useState([]);
  const [featuredCollection, setFeaturedCollection] = useState(null);
  const [featuredLookbook, setFeaturedLookbook] = useState(null);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const getImage = (p) => {
    const image = p.images?.length > 0 ? p.images[0].imageUrl : p.imageUrl;

    if (!image) {
      return "https://via.placeholder.com/600x800?text=No+Image";
    }

    return image.startsWith("http")
      ? image
      : `http://${import.meta.env.VITE_API_HOST}${image}`;
  };
  useEffect(() => {
    loadProducts();
    loadFeaturedCollection();
    loadFeaturedLookbook();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await API.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.log(err);
      toast.error("Error");
    }
  };
  const loadFeaturedCollection = async () => {
    try {
      const res = await API.get("/collections/featured");

      setFeaturedCollection(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const loadFeaturedLookbook = async () => {
    try {
      const res = await API.get("/lookbooks/featured");

      setFeaturedLookbook(res.data);
    } catch (err) {
      console.log(err);
    }
  };
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };
  const subscribeNewsletter = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }

    if (!isValidEmail(email)) {
      toast.error("Invalid email address");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/newsletter/subscribe", {
        email,
      });
      console.log("Newsletter response:", res.data);
      toast.success(res.data.message);

      setEmail("");
    } catch (err) {
      console.log(err);

      toast.error(err.response?.data?.message || "Subscription failed");
    } finally {
      setLoading(false);
    }
  };
  const newArrivals = [...products].sort((a, b) => b.id - a.id).slice(0, 4);

  const bestSeller = [...products]
    .sort((a, b) => (b.sold || 0) - (a.sold || 0))
    .slice(0, 4);
  return (
    <>
      {/* HERO */}
      <section className="relative h-screen -mt-[88px]">
        <img
          src="http://${import.meta.env.VITE_API_HOST}/uploads/banner1.jpg"
          alt=""
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-[120px] md:text-[240px] font-black tracking-tight uppercase hover:bg-transparent hover:text-white">
              HYNO
            </h1>

            <p className="text-lg md:text-2xl tracking-[8px] uppercase mt-4">
              Modern Fashion Collection
            </p>

            <Link
              to="/shop"
              className="
                inline-block
                mt-8
                bg-white
                text-black
                px-8
                py-4
                rounded-full
                font-semibold
                hover:bg-black
                hover:text-white
                border-2
                border-white
                transition
                duration-300
              "
            >
              Explore Collection →
            </Link>
          </div>
        </div>
      </section>
      {featuredLookbook && (
        <section className="py-32 bg-white">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <img
                src={`http://${import.meta.env.VITE_API_HOST}${featuredLookbook.coverImage}`}
                alt={featuredLookbook.title}
                className="
            h-[900px]
            w-full
            object-cover
            rounded-2xl
          "
              />

              <div>
                <p className="tracking-[8px] uppercase text-gray-400 mb-4">
                  Featured Lookbook
                </p>

                <h2 className="text-7xl font-bold uppercase mb-6">
                  {featuredLookbook.title}
                </h2>

                <p className="text-gray-500 mb-10">
                  {featuredLookbook.description}
                </p>

                <Link
                  to="/lookbook"
                  className="
              border
              border-black
              px-8
              py-4
              uppercase
              tracking-widest
            "
                >
                  View Lookbook →
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}
      {/* FEATURED COLLECTION */}

      {featuredCollection && (
        <section className="py-32">
          <div className="max-w-[1600px] mx-auto px-6">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <div>
                <p className="text-xs tracking-[6px] uppercase text-gray-400 mb-4">
                  Latest Collection
                </p>

                <h2 className="text-7xl md:text-[120px] leading-none font-light uppercase">
                  {featuredCollection?.name}
                </h2>

                <p className="text-gray-500 mt-6 max-w-xl">
                  Inspired by modern tailoring and contemporary luxury
                  aesthetics.
                </p>

                <Link
                  to={`/collection/${featuredCollection?.slug}`}
                  className="inline-block mt-10 border border-black px-8 py-4 uppercase tracking-widest"
                >
                  Explore Collection →
                </Link>
              </div>

              <img
                src={
                  featuredCollection.bannerImage.startsWith("http")
                    ? featuredCollection.bannerImage
                    : `http://${import.meta.env.VITE_API_HOST}${featuredCollection.bannerImage}`
                }
                alt={featuredCollection.name}
                className="
    h-[800px]
    w-full
    object-cover
    rounded-2xl
    shadow-xl
  "
              />
            </div>
          </div>
        </section>
      )}
      {/* NEW ARRIVALS */}
      <section className="max-w-[1600px] mx-auto px-6 py-32">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-5xl font-bold">New Arrivals</h2>

          <Link
            to="/shop"
            className="uppercase tracking-widest text-sm hover:underline"
          >
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
      {/* BEST SELLER */}
      <section className="bg-[#f7f5f2] py-32">
        <div className="max-w-[1600px] mx-auto px-6">
          <div className="flex justify-between items-center mb-12">
            <h2 className="text-5xl font-bold">Best Seller</h2>

            <Link
              to="/shop?sort=bestseller"
              className="uppercase tracking-widest text-sm"
            >
              View All
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
            {bestSeller.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default Home;
