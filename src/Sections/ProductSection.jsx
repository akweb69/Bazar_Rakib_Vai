import axios from "axios";
import { useEffect, useState } from "react";
import ProductCard from "../Pages/ProductCard";

const ProductSection = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState(""); // "price-asc" | "price-desc" | "name-asc" | "name-desc" | "newest"

    const base_url = import.meta.env.VITE_BASE_URL;

    // Load products
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${base_url}/products`)
            .then((res) => {
                const data = res.data;
                setProducts(data);
                setFilteredProducts(data);
            })
            .catch(() => {
                setProducts([]);
                setFilteredProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [base_url]);

    // Search + Sort logic
    useEffect(() => {
        let result = [...products];

        if (searchTerm.trim()) {
            result = result.filter((product) =>
                product.name?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (sortBy) {
            result.sort((a, b) => {
                switch (sortBy) {
                    case "price-asc":
                        return a.price - b.price;
                    case "price-desc":
                        return b.price - a.price;
                    case "name-asc":
                        return a.name.localeCompare(b.name);
                    case "name-desc":
                        return b.name.localeCompare(a.name);
                    case "newest":
                        return new Date(b.createdAt) - new Date(a.createdAt);
                    default:
                        return 0;
                }
            });
        }

        setFilteredProducts(result);
    }, [searchTerm, sortBy, products]);

    return (
        <div className="w-full py-8">
            <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6 text-emerald-500 font2">
                Products
            </h2>

            {/* Search & Sort Controls */}
            <div className="w-full px-4 mb-8 grid grid-cols-2 gap-4">
                {/* Search Box */}
                <div className="relative w-full">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 pl-10 border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm focus:border-emerald-500"
                    />
                    <svg
                        className="absolute left-3 top-2.5 w-5 h-5 text-emerald-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>

                {/* Sort Dropdown */}
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-2 text-sm border border-emerald-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                >
                    <option value="">Default Sorting</option>
                    <option value="price-asc">Price: Low to High</option>
                    <option value="price-desc">Price: High to Low</option>
                    <option value="name-asc">Name: A to Z</option>
                    <option value="name-desc">Name: Z to A</option>
                    <option value="newest">Newest First</option>
                </select>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center py-12">
                    <span className="text-xl text-gray-600">Loading products...</span>
                </div>
            )}

            {/* No products found */}
            {!loading && filteredProducts.length === 0 && (
                <div className="text-center py-12">
                    <p className="text-xl text-gray-600">
                        {searchTerm ? "No products match your search." : "No products available."}
                    </p>
                </div>
            )}

            {/* Products Grid */}
            {!loading && filteredProducts.length > 0 && (
                <div className="w-full max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {filteredProducts.map((item) => (
                        <ProductCard key={item._id} product={item} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ProductSection;