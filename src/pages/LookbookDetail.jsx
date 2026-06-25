import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";

function LookbookDetail() {
  const { slug } = useParams();

  const [lookbook, setLookbook] = useState(null);

  useEffect(() => {
    loadLookbook();
  }, [slug]);

  const loadLookbook = async () => {
    try {
      const res = await API.get(`/lookbooks/${slug}`);

      setLookbook(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  if (!lookbook) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <>
      {/* HERO */}
      <section className="text-center py-24">
        <p className="tracking-[8px] text-sm uppercase text-gray-500">
          {lookbook.season}
        </p>

        <h1 className="text-6xl md:text-8xl font-black mt-6 uppercase">
          {lookbook.title}
        </h1>

        <p className="max-w-3xl mx-auto mt-8 text-gray-600 leading-8">
          {lookbook.description}
        </p>
      </section>

      {/* EDITORIAL IMAGES */}
      <section className="max-w-[1600px] mx-auto px-6 pb-32">
        <div className="grid md:grid-cols-2 gap-8">
          {lookbook.images?.map((image) => (
            <div
              key={image.id}
              className={
                image.layoutType === "FULL" ? "md:col-span-2" : "md:col-span-1"
              }
            >
              <img
                src={`http://localhost:8085${image.imageUrl}`}
                alt=""
                className="
                  w-full
                  object-cover
                  rounded-2xl
                "
              />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

export default LookbookDetail;
