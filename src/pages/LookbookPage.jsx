import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/api";

function LookbookPage() {
  const [lookbooks, setLookbooks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLookbooks();
  }, []);

  const loadLookbooks = async () => {
    try {
      const res = await API.get("/lookbooks");

      console.log("LOOKBOOKS =", res.data);

      setLookbooks(res.data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";

    return url.startsWith("http")
      ? url
      : `http://${import.meta.env.VITE_API_HOST}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-2xl font-bold">Loading Lookbooks...</div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* HERO */}
      <section className="py-24 text-center">
        <p className="uppercase tracking-[0.5em] text-sm text-gray-500 mb-4">
          HYNO
        </p>

        <h1 className="text-6xl md:text-8xl font-black uppercase">Lookbook</h1>

        <p className="mt-6 text-gray-500 max-w-2xl mx-auto">
          A visual exploration of luxury tailoring, modern silhouettes and
          contemporary elegance.
        </p>
      </section>

      {/* GRID */}
      <section className="max-w-[1400px] mx-auto px-6 pb-24">
        <div className="grid md:grid-cols-2 gap-24">
          {lookbooks.map((item) => (
            <Link
              key={item.id}
              to={`/lookbook/${item.slug}`}
              className="group block"
            >
              <div className="relative">
                <img
                  src={getImageUrl(item.coverImage)}
                  alt={item.title}
                  className="
                    w-full
                    h-auto
                    rounded-3xl
                    transition
                    duration-700
                    group-hover:scale-[1.02]
                  "
                />

                <div className="mt-6">
                  <p className="uppercase tracking-[0.3em] text-xs text-gray-500">
                    {item.season} {item.year}
                  </p>

                  <h2 className="text-4xl font-bold mt-2">{item.title}</h2>

                  <p className="text-gray-600 mt-4">{item.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default LookbookPage;
