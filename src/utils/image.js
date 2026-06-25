export const getImageUrl = (url) => {
  if (!url) {
    return "https://placehold.co/100x100?text=No+Image";
  }

  if (url.startsWith("http")) {
    return url;
  }

  return `${import.meta.env.VITE_API_HOST}${url}`;
};
