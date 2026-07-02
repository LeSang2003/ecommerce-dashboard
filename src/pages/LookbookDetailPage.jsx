import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/api";
import { motion } from "framer-motion";

import HeroSection from "../components/lookbook/HeroSection";
import IntroSection from "../components/lookbook/IntroSection";

import EndingSection from "../components/lookbook/EndingSection";
import EditorialSection from "../components/lookbook/EditorialSection";
function LookbookDetailPage() {
  const { slug } = useParams();

  const [lookbook, setLookbook] = useState(null);
  const [loading, setLoading] = useState(true);
  const getImageUrl = (url) => {
    if (!url) return "/placeholder.jpg";

    return url.startsWith("http")
      ? url
      : `${import.meta.env.VITE_API_HOST}${url}`;
  };

  useEffect(() => {
    const loadLookbook = async () => {
      try {
        const res = await API.get(`/lookbooks/${slug}`);
        console.log(res.data);
        setLookbook(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadLookbook();
  }, [slug]);

  if (loading) {
    return <>Loading...</>;
  }

  if (!lookbook) {
    return <>Lookbook not found</>;
  }

  const endingSection = {
    image: lookbook?.coverImage
      ? getImageUrl(lookbook.coverImage)
      : "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f",

    title: lookbook?.title,

    description:
      lookbook?.description ||
      "Every collection tells a story. Discover the next chapter.",

    buttonText: "Explore Collection",

    buttonLink: "/collections",
  };
  console.log("SLUG =", slug);
  console.log("LOOKBOOK =", lookbook);
  console.log("SECTIONS =", lookbook.sections);
  return (
    <div className="bg-white">
      {/* HERO */}
      <HeroSection lookbook={lookbook} getImageUrl={getImageUrl} />
      <IntroSection lookbook={lookbook} />

      {/* EDITORIAL IMAGES */}
      <EditorialSection
        sections={lookbook.sections}
        getImageUrl={getImageUrl}
      />
      <EndingSection section={endingSection} />
    </div>
  );
}

export default LookbookDetailPage;
