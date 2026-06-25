export default function RowRenderer({ images, getImageUrl }) {
  if (!images?.length) return null;

  const rows = [];

  for (let i = 0; i < images.length; i++) {
    const current = images[i];

    if (
      current.layoutType === "HALF" &&
      images[i + 1] &&
      images[i + 1].layoutType === "HALF"
    ) {
      rows.push({
        type: "HALF",
        images: [current, images[i + 1]],
      });

      i++;
    } else {
      rows.push({
        type: "FULL",
        images: [current],
      });
    }
  }

  return (
    <div className="space-y-8">
      {rows.map((row, index) => {
        if (row.type === "HALF") {
          return (
            <div key={index} className="grid md:grid-cols-2 gap-8">
              {row.images.map((img) => (
                <img
                  key={img.id}
                  src={getImageUrl(img.imageUrl)}
                  alt=""
                  className="
                    w-full
                    h-auto
                    object-cover
                  "
                />
              ))}
            </div>
          );
        }

        return (
          <img
            key={index}
            src={getImageUrl(row.images[0].imageUrl)}
            alt=""
            className="
              w-full
              h-auto
              object-cover
            "
          />
        );
      })}
    </div>
  );
}
