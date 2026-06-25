import SectionRenderer from "./SectionRenderer";

export default function EditorialSection({ sections, getImageUrl }) {
  if (!sections?.length) return null;

  return (
    <section className="max-w-[1600px] mx-auto px-6 pb-32">
      {sections
        .sort((a, b) => a.displayOrder - b.displayOrder)
        .map((section) => (
          <SectionRenderer
            key={section.id}
            section={section}
            getImageUrl={getImageUrl}
          />
        ))}
    </section>
  );
}
