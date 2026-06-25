import RowRenderer from "./RowRenderer";
import QuoteSection from "./QuoteSection";
import TextSection from "./TextSection";

export default function SectionRenderer({ section, getImageUrl }) {
  switch (section.type) {
    case "IMAGE":
      console.log("IMAGE SECTION =", section);
      console.log("IMAGE COUNT =", section.images?.length);
      return <RowRenderer images={section.images} getImageUrl={getImageUrl} />;

    case "QUOTE":
      return <QuoteSection section={section} />;

    case "TEXT":
      return <TextSection section={section} />;

    default:
      return null;
  }
}
