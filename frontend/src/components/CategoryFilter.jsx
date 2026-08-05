function CategoryFilter({
  categories,
  selectedCategory,
  setSelectedCategory,
}) {
  return (
    <div>

      <h2 className="text-xl font-serif mb-6">
        Product Categories
      </h2>

      <ul className="space-y-4">

        <li>

          <button
            onClick={() => setSelectedCategory("All")}
            className={`cursor-pointer flex justify-between w-full text-left transition ${
              selectedCategory === "All"
                ? "text-[#1a6b3a] font-semibold"
                : "text-gray-600 hover:text-[#1a6b3a]"
            }`}
          >
            <span>All Books</span>

          </button>

        </li>

        {categories.map((category) => (

          <li key={category}>

            <button
              onClick={() => setSelectedCategory(category)}
              className={`cursor-pointer flex justify-between w-full text-left transition ${
                selectedCategory === category
                  ? "text-[#1a6b3a] font-semibold"
                  : "text-gray-600 hover:text-[#1a6b3a]"
              }`}
            >
              <span>{category}</span>

            </button>

          </li>

        ))}

      </ul>

    </div>
  );
}

export default CategoryFilter;