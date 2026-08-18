const categories = [
  "Gadget",
  "Appliances",
  "Refrigerators",
  "Others",
];

type CategoriesProps = {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
};

export default function Categories({
  selectedCategory,
  onCategoryChange,
}: CategoriesProps) {
  return (
    <section className="bg-white px-4 py-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex items-center justify-between gap-2">

          {/* Categories */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => onCategoryChange(category)}
                className={`whitespace-nowrap rounded-full border px-6 py-2.5 text-sm font-semibold transition ${
                  selectedCategory === category
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-green-200 bg-green-50 text-black hover:border-green-600 hover:bg-green-600 hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* See All */}
          <button className="hidden whitespace-nowrap rounded-full border border-gray-900 px-5 py-2 text-sm font-medium text-gray-900 transition hover:bg-gray-900 hover:text-white sm:block">
            See all
          </button>

        </div>
      </div>
    </section>
  );
}