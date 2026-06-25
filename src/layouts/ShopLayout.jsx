import { Outlet, Link } from "react-router-dom";
import API from "../api/api";
import { useCart } from "../context/CartContext";
import { Heart, User, ShoppingBag, Menu } from "lucide-react";
import { useEffect, useState, useRef } from "react";
import BackToTop from "../components/BackToTop";
import NewsletterSection from "../components/NewsletterSection";
import Footer from "../components/Footer";

function ShopLayout() {
  const { totalItems } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef(null);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  const [collections, setCollections] = useState([]);

  const [menCategories, setMenCategories] = useState([]);
  const [womenCategories, setWomenCategories] = useState([]);

  useEffect(() => {
    API.get("/collections").then((res) => {
      setCollections(res.data);
    });

    API.get("/categories-by-gender", {
      params: {
        gender: "Men",
      },
    }).then((res) => {
      setMenCategories(res.data);
    });

    API.get("/categories-by-gender", {
      params: {
        gender: "Women",
      },
    }).then((res) => {
      setWomenCategories(res.data);
    });
  }, []);
  return (
    <div className="min-h-screen">
      {/* NAVBAR */}
      <header
        className={`
    fixed
    top-0
    left-0
    w-full
    z-50
    transition-all
    duration-300
    ${scrolled ? "bg-black/80 backdrop-blur-md" : "bg-transparent"}
    text-white
  `}
      >
        <div
          className="
    w-full
    flex
    items-center
    justify-between
    px-8
    lg:px-12
    py-6
  "
        >
          {/* LOGO */}
          <Link
            to="/"
            className="
      text-4xl
      font-black
      tracking-[0.15em]
      "
          >
            HYNO
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-6">
            <Link to="/wishlist">
              <Heart size={22} />
            </Link>

            <Link to="/cart" className="flex items-center gap-2">
              <ShoppingBag size={22} />
              <span>{totalItems}</span>
            </Link>

            <Link to="/user/profile">
              <User size={22} />
            </Link>
            <button onClick={() => setOpenMenu(!openMenu)}>
              <Menu size={24} />
            </button>
          </div>
        </div>
        {openMenu && (
          <div
            ref={menuRef}
            className="
              absolute
              right-10
              top-full
              mt-3
              w-[95vw] md:w-[900px]
              bg-black/95
              rounded-3xl
              shadow-2xl
              text-white
              p-8
            "
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {/* WOMEN */}
              <div>
                <h3 className="uppercase tracking-widest text-sm text-gray-400 mb-4">
                  Women
                </h3>

                {womenCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?gender=Women&categoryId=${category.id}`}
                    onClick={() => setOpenMenu(false)}
                    className="block py-2 hover:text-gray-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* MEN */}
              <div>
                <h3 className="uppercase tracking-widest text-sm text-gray-400 mb-4">
                  Men
                </h3>
                {menCategories.map((category) => (
                  <Link
                    key={category.id}
                    to={`/shop?gender=Men&categoryId=${category.id}`}
                    onClick={() => setOpenMenu(false)}
                    className="block py-2 hover:text-gray-300"
                  >
                    {category.name}
                  </Link>
                ))}
              </div>

              {/* COLLECTIONS */}
              <div>
                <h3 className="uppercase tracking-widest text-sm text-gray-400 mb-4">
                  Collections
                </h3>

                {collections.map((c) => (
                  <Link
                    key={c.id}
                    to={`/collection/${c.slug}`}
                    onClick={() => setOpenMenu(false)}
                    className="block py-2 hover:text-gray-300"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* PAGE */}
      <main>
        <Outlet />
      </main>
      <NewsletterSection />
      <Footer />
      <BackToTop />
    </div>
  );
}

export default ShopLayout;
