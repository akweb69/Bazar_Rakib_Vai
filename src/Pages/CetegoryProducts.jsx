import axios from 'axios';
import React, { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, ChevronDown } from 'lucide-react';
import ProductCard from './ProductCard';

const CategoryProducts = () => {
    const { slug } = useParams();
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [priceRange, setPriceRange] = useState([0, 100000]);
    const [sortBy, setSortBy] = useState('featured');
    const [showFilters, setShowFilters] = useState(false);

    const base_url = import.meta.env.VITE_BASE_URL;

    // Fetch all products
    useEffect(() => {
        setLoading(true);
        axios
            .get(`${base_url}/products`)
            .then((res) => {
                const data = res.data;
                const categoryFiltered = data.filter((product) => {
                    const productCategorySlug = product.category
                        .trim()
                        .replace(/\s+/g, '-')
                        .toLowerCase();
                    return productCategorySlug === slug;
                });
                setProducts(categoryFiltered);
                setFilteredProducts(categoryFiltered);
            })
            .catch(() => {
                setProducts([]);
                setFilteredProducts([]);
            })
            .finally(() => setLoading(false));
    }, [slug, base_url]);

    // Filter & Sort Logic
    useMemo(() => {
        let filtered = [...products];

        // Search filter
        if (searchTerm) {
            filtered = filtered.filter((p) =>
                p.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        // Price range filter
        filtered = filtered.filter(
            (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
        );

        // Sorting
        switch (sortBy) {
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'name':
                filtered.sort((a, b) => a.name.localeCompare(b.name));
                break;
            default:
                // featured or default order
                break;
        }

        setFilteredProducts(filtered);
    }, [products, searchTerm, priceRange, sortBy]);

    // Get min/max prices for range slider
    const minPrice = Math.min(...products.map((p) => p.price), 0);
    const maxPrice = Math.max(...products.map((p) => p.price), 100000);

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 },
    };

    return (
        <div className="min-h-screen bg-gray-50 -my-4 w-full">
            <div className="w-11/12 max-w-7xl mx-auto py-8">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-8"
                >
                    <h1 className="text-3xl sm:text-4xl font-bold capitalize text-gray-900">
                        {slug.replace(/-/g, ' ')}
                    </h1>
                    <p className="text-gray-600 mt-2">
                        {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} found
                    </p>
                </motion.div>

                {/* Search & Filters Bar */}
                <div className="mb-8 space-y-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Search */}
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                            />
                            {searchTerm && (
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2"
                                >
                                    <X className="w-5 h-5 text-gray-500 hover:text-gray-700" />
                                </button>
                            )}
                        </div>

                        {/* Sort & Filter Toggle */}
                        <div className="flex gap-3">
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="featured">Featured</option>
                                <option value="price-low">Price: Low to High</option>
                                <option value="price-high">Price: High to Low</option>
                                <option value="newest">Newest First</option>
                                <option value="name">Name A-Z</option>
                            </select>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition sm:hidden"
                            >
                                <Filter className="w-5 h-5" />
                                Filters
                            </button>
                        </div>
                    </div>

                    {/* Price Range Filter (Desktop + Mobile Toggle) */}
                    <AnimatePresence>
                        {(showFilters || window.innerWidth >= 640) && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                            >
                                <div className="bg-white p-6 rounded-lg border border-gray-200">
                                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                                        <Filter className="w-5 h-5" />
                                        Price Range
                                    </h3>
                                    <div className="space-y-4">
                                        <input
                                            type="range"
                                            min={minPrice}
                                            max={maxPrice}
                                            value={priceRange[1]}
                                            onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                            className="w-full"
                                        />
                                        <div className="flex justify-between text-sm text-gray-600">
                                            <span>RM {priceRange[0].toLocaleString()}</span>
                                            <span>RM {priceRange[1].toLocaleString()}</span>
                                        </div>
                                        <div className="flex gap-3">
                                            <input
                                                type="number"
                                                value={priceRange[0]}
                                                onChange={(e) => setPriceRange([Number(e.target.value), priceRange[1]])}
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Min"
                                            />
                                            <input
                                                type="number"
                                                value={priceRange[1]}
                                                onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                                                className="w-full px-3 py-2 border rounded-md"
                                                placeholder="Max"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* Products Grid */}
                {loading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                        {[...Array(12)].map((_, i) => (
                            <div key={i} className="bg-white rounded-lg h-64 animate-pulse">
                                <div className="bg-gray-300 h-40 rounded-t-lg"></div>
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-300 rounded w-3/4"></div>
                                    <div className="h-4 bg-gray-300 rounded w-1/2"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : filteredProducts.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="text-gray-400 mb-4">
                            <Search className="w-20 h-20 mx-auto" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700">No products found</h2>
                        <p className="text-gray-500 mt-2">
                            Try adjusting your filters or search term.
                        </p>
                    </motion.div>
                ) : (
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6"
                    >
                        {filteredProducts.map((product) => (
                            <motion.div key={product._id} variants={itemVariants}>
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default CategoryProducts;