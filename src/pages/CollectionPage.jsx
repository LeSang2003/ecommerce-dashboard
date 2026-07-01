import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../api/api";

function CollectionPage() {
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState(null);

  useEffect(() => {
    loadCollection();
  }, [slug]);

  const loadCollection = async () => {
    try {
      const [collectionRes, productsRes] = await Promise.all([
        API.get(`/collections/slug/${slug}`),
        API.get(`/products/collection/${slug}`),
      ]);

      setCollection(collectionRes.data);
      setProducts(productsRes.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  const getImage = (p) => {
    const image = p.images?.length > 0 ? p.images[0].imageUrl : p.imageUrl;

    if (!image) {
      return "https://via.placeholder.com/600x800?text=No+Image";
    }

    return image.startsWith("http")
      ? image
      : `http://${import.meta.env.VITE_API_HOST}${image}`;
  };

  if (!collection) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="relative h-screen overflow-hidden">
        <img
          src={
            collection.bannerImage
              ? `http://${import.meta.env.VITE_API_HOST}${collection.bannerImage}`
              : "/placeholder.jpg"
          }
          alt={collection.name}
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/40" />

        <div className="relative z-10 h-full flex items-center justify-center">
          <div className="text-center text-white px-6">
            <p className="tracking-[8px] uppercase text-sm mb-6">
              {collection.season}
              {String(collection.year).slice(2)}
            </p>

            <h1
              className="
                text-6xl
                md:text-[120px]
                lg:text-[180px]
                font-light
                uppercase
                tracking-tight
              "
            >
              {collection.name}
            </h1>

            <p
              className="
                max-w-2xl
                mx-auto
                mt-8
                text-lg
                text-gray-200
              "
            >
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section className="max-w-7xl mx-auto px-6 py-24">
        <div className="flex justify-between items-end mb-16">
          <div>
            <p className="uppercase tracking-[6px] text-gray-500 text-sm">
              Collection
            </p>

            <h2 className="text-5xl font-bold mt-2">Featured Pieces</h2>
          </div>

          <p className="text-gray-500">{products.length} Products</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {products.map((p) => (
            <Link key={p.id} to={`/product/${p.id}`} className="group">
              <div className="overflow-hidden">
                <img
                  src={getImage(p)}
                  alt={p.name}
                  className="
                    w-full
                    h-[800px]
                    object-cover
                    object-top
                    group-hover:scale-105
                    transition
                    duration-700
                  "
                />
              </div>

              <div className="mt-5">
                <h3 className="font-semibold text-lg">{p.name}</h3>

                <p className="text-gray-500 text-sm mt-1">
                  {p.material || "Premium Fabric"}
                </p>

                <p className="mt-2 font-medium">
                  {p.price?.toLocaleString()} đ
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}

export default CollectionPage;
