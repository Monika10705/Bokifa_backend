import { useEffect, useMemo, useState } from "react";
import ProductGrid from "../components/ProductGrid";
import CategoryFilter from "../components/CategoryFilter";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);
    const [sortBy, setSortBy] = useState("default");

    const PRODUCTS_PER_PAGE = 12;

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            const res = await fetch(`${API_BASE}/api/products`);
            const data = await res.json();

            setProducts(data.products || data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    }

    // Search
    const searchedProducts = useMemo(() => {
        return products.filter((product) =>
            product.title.toLowerCase().includes(search.toLowerCase())
        );
    }, [products, search]);

    // Category Filter
    const filteredProducts = useMemo(() => {
        if (selectedCategory === "All") return searchedProducts;

        return searchedProducts.filter((product) =>
            product.category?.includes(selectedCategory)
        );
    }, [searchedProducts, selectedCategory]);

    const sortedProducts = useMemo(() => {
        const sorted = [...filteredProducts];

        switch (sortBy) {
            case "priceLow":
                sorted.sort((a, b) => a.price - b.price);
                break;

            case "priceHigh":
                sorted.sort((a, b) => b.price - a.price);
                break;

            case "rating":
                sorted.sort((a, b) => b.rating - a.rating);
                break;

            case "name":
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;

            default:
                break;
        }

        return sorted;
    }, [filteredProducts, sortBy]);

    // Categories
    const categories = useMemo(() => {
        const list = [];

        products.forEach((product) => {
            product.category?.forEach((cat) => {
                if (!list.includes(cat)) {
                    list.push(cat);
                }
            });
        });

        return list;
    }, [products]);

    // Pagination
    const totalPages = Math.ceil(
        sortedProducts.length / PRODUCTS_PER_PAGE
    );

    const paginatedProducts = sortedProducts.slice(
        (currentPage - 1) * PRODUCTS_PER_PAGE,
        currentPage * PRODUCTS_PER_PAGE
    );

    return (
        <section className="max-w-[1450px] mx-auto px-6 py-10">

            {/* Breadcrumb */}

            <div className="text-sm text-gray-500 mb-3">
                Home / Products
            </div>

            <h1 className="text-5xl font-serif mb-10">
                Products
            </h1>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Sidebar */}

                <aside className="lg:col-span-3">

                    <input
                        type="text"
                        placeholder="Search books..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                        className="border rounded-lg w-full p-3 mb-8"
                    />

                    <CategoryFilter
                        categories={categories}
                        selectedCategory={selectedCategory}
                        setSelectedCategory={(category) => {
                            setSelectedCategory(category);
                            setCurrentPage(1);
                        }}
                    />

                </aside>

                {/* Products */}

                <main className="lg:col-span-9">

                    <div className="flex justify-between items-center mb-8">

                        <p className="text-gray-600">
                            {sortedProducts.length} Products
                        </p>

                        <select
                            value={sortBy}
                            onChange={(e) => {
                                setSortBy(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="border rounded-md px-4 py-2 outline-none"
                        >
                            <option value="default">Default</option>
                            <option value="priceLow">Price: Low to High</option>
                            <option value="priceHigh">Price: High to Low</option>
                            <option value="rating">Highest Rating</option>
                            <option value="name">Name (A-Z)</option>
                        </select>

                    </div>

                    <ProductGrid
                        products={paginatedProducts}
                        loading={loading}
                    />

                    {/* Pagination */}

                    <div className="flex justify-center gap-3 mt-14">

                        {Array.from({ length: totalPages }).map((_, index) => (

                            <button
                                key={index}
                                onClick={() => setCurrentPage(index + 1)}
                                className={`w-10 h-10 rounded-full border transition ${currentPage === index + 1
                                    ? "bg-[#1a6b3a] text-white"
                                    : "hover:bg-gray-100"
                                    }`}
                            >
                                {index + 1}
                            </button>

                        ))}

                    </div>

                </main>

            </div>

        </section>
    );
}

export default Shop;