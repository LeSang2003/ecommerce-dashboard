export function buildSections(images = []) {
  const sections = [];

  for (let i = 0; i < images.length; i++) {
    const current = images[i];

    switch (current.layoutType) {
      case "FULL":
        sections.push({
          type: "IMAGE",
          row: {
            type: "FULL",
            images: [current],
          },
        });

        break;

      case "HALF":
        if (images[i + 1] && images[i + 1].layoutType === "HALF") {
          sections.push({
            type: "IMAGE",
            row: {
              type: "HALF",
              images: [current, images[i + 1]],
            },
          });

          i++;
        } else {
          sections.push({
            type: "IMAGE",
            row: {
              type: "FULL",
              images: [current],
            },
          });
        }
        break;

      case "TRIPLE":
        if (
          images[i + 1]?.layoutType === "TRIPLE" &&
          images[i + 2]?.layoutType === "TRIPLE"
        ) {
          sections.push({
            type: "IMAGE",
            row: {
              type: "TRIPLE",
              images: [current, images[i + 1], images[i + 2]],
            },
          });

          i += 2;
        } else {
          sections.push({
            type: "IMAGE",
            row: {
              type: "FULL",
              images: [current],
            },
          });
        }
        break;

      case "GRID":
        if (
          images[i + 1]?.layoutType === "GRID" &&
          images[i + 2]?.layoutType === "GRID" &&
          images[i + 3]?.layoutType === "GRID"
        ) {
          sections.push({
            type: "IMAGE",
            row: {
              type: "GRID",
              images: [current, images[i + 1], images[i + 2], images[i + 3]],
            },
          });

          i += 3;
        } else {
          sections.push({
            type: "IMAGE",
            row: {
              type: "FULL",
              images: [current],
            },
          });
        }
        break;

      default:
        sections.push({
          type: "IMAGE",
          row: {
            type: "FULL",
            images: [current],
          },
        });
    }
  }

  return sections;
}
