import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Common/Loader";

const ProductsManagement = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // নতুন: Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Form states (shared for Add & Edit)
    const [editMode, setEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const [productName, setProductName] = useState("");
    const [priceType, setPriceType] = useState("single");
    const [singlePrice, setSinglePrice] = useState("");
    const [sizes, setSizes] = useState([{ size: "", price: "" }]);
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [existingImage, setExistingImage] = useState("");

    const base_url = import.meta.env.VITE_BASE_URL;
    const imgbb_api_key = import.meta.env.VITE_IMGBB_API_KEY;

    // Fetch products
    useEffect(() => {
        if (activeTab === 1) {
            fetchProducts();
        }
    }, [activeTab]);

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${base_url}/products`);
            setProducts(res.data);
        } catch (err) {
            toast.error("Failed to load products");
        } finally {
            setFetching(false);
        }
    };

    // নতুন: Search + Filter logic (useMemo দিয়ে performance ভালো রাখা হয়েছে)
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;

        const query = searchQuery.toLowerCase();
        return products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    // Image upload
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
            formData
        );
        return res.data.data.url;
    };

    // Dynamic size handlers
    const addSizeField = () => setSizes([...sizes, { size: "", price: "" }]);
    const removeSizeField = (index) => setSizes(sizes.filter((_, i) => i !== index));
    const updateSize = (index, field, value) => {
        const updated = [...sizes];
        updated[index][field] = value;
        setSizes(updated);
    };

    // Start Edit Mode
    const startEdit = (product) => {
        setEditMode(true);
        setEditingProductId(product._id);
        setProductName(product.name);
        setExistingImage(product.image);
        setImagePreview(product.image);

        if (product.price.type === "single") {
            setPriceType("single");
            setSinglePrice(product.price.price.toString());
            setSizes([{ size: "", price: "" }]);
        } else {
            setPriceType("multiple");
            setSinglePrice("");
            setSizes(product.price.sizes.map(s => ({ size: s.size, price: s.price.toString() })));
        }

        setActiveTab(2);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    // Cancel Edit
    const cancelEdit = () => {
        setEditMode(false);
        setEditingProductId(null);
        resetForm();
    };

    // Reset form
    const resetForm = () => {
        setProductName("");
        setPriceType("single");
        setSinglePrice("");
        setSizes([{ size: "", price: "" }]);
        setImage(null);
        setImagePreview("");
        setExistingImage("");
    };

    // Submit (Add or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productName) return toast.error("Product name is required");

        setLoading(true);
        try {
            let imageUrl = existingImage;

            if (image) {
                toast.loading("Uploading new image...");
                imageUrl = await uploadImage(image);
                toast.dismiss();
            }

            const priceData =
                priceType === "single"
                    ? { type: "single", price: Number(singlePrice) }
                    : {
                        type: "multiple",
                        sizes: sizes
                            .filter(s => s.size && s.price)
                            .map(s => ({ size: s.size, price: Number(s.price) }))
                    };

            const productData = {
                name: productName,
                price: priceData,
                image: imageUrl,
            };

            if (editMode) {
                await axios.patch(`${base_url}/products/${editingProductId}`, productData);
                toast.success("Product updated successfully!");
            } else {
                productData.createdAt = new Date();
                await axios.post(`${base_url}/products`, productData);
                toast.success("Product added successfully!");
            }

            resetForm();
            setEditMode(false);
            setEditingProductId(null);
            fetchProducts();
        } catch (err) {
            toast.error(editMode ? "Failed to update" : "Failed to add product");
        } finally {
            setLoading(false);
        }
    };

    // Delete
    const deleteProduct = async (id) => {
        if (!confirm("ডিলিট করবেন?")) return;
        try {
            await axios.delete(`${base_url}/products/${id}`);
            toast.success("Product deleted");
            fetchProducts();
        } catch (err) {
            toast.error("Delete failed");
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-16 pb-24 w-full">
            <Toaster position="top-right" />
            <div className="w-11/12 mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold mb-8 text-orange-600">Product Management</h1>

                {/* Tabs */}
                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button
                        onClick={() => setActiveTab(1)}
                        className={`py-4 rounded-xl font-semibold transition-all ${activeTab === 1
                            ? "bg-orange-500 text-white shadow-lg"
                            : "bg-white text-orange-500 border border-orange-200"
                            }`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => { setActiveTab(2); if (!editMode) cancelEdit(); }}
                        className={`py-4 rounded-xl font-semibold transition-all ${activeTab === 2
                            ? "bg-orange-500 text-white shadow-lg"
                            : "bg-white text-orange-500 border border-orange-200"
                            }`}
                    >
                        {editMode ? "Edit Product" : "Add New Product"}
                    </button>
                </div>

                {/* All Products Tab */}
                {activeTab === 1 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {/* নতুন: Search Bar */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search products by name..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-5 py-4 pl-12 text-lg border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500 transition-all"
                                />
                                <svg
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500"
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
                            {searchQuery && (
                                <p className="mt-2 text-sm text-gray-600">
                                    {filteredProducts.length} of {products.length} products found
                                </p>
                            )}
                        </div>

                        {fetching ? (
                            <div className="h-[50vh] flex items-center justify-center">
                                <Loader />
                            </div>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-center py-16 text-gray-500 text-xl">
                                {searchQuery ? "No products match your search." : "No products yet."}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div
                                        key={product._id}
                                        className="border border-orange-100 rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow"
                                    >
                                        <img
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg truncate">{product.name}</h3>

                                            {product.price.type === "single" ? (
                                                <p className="text-orange-600 font-bold text-lg">৳{product.price.price}</p>
                                            ) : (
                                                <div className="text-sm space-y-1 mt-1">
                                                    {product.price.sizes.slice(0, 3).map((s, i) => (
                                                        <p key={i}>
                                                            <span className="font-medium">{s.size}:</span> ৳{s.price}
                                                        </p>
                                                    ))}
                                                    {product.price.sizes.length > 3 && (
                                                        <p className="text-gray-500">
                                                            +{product.price.sizes.length - 3} more
                                                        </p>
                                                    )}
                                                </div>
                                            )}

                                            <div className="mt-4 flex gap-2">
                                                <button
                                                    onClick={() => startEdit(product)}
                                                    className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm font-medium transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => deleteProduct(product._id)}
                                                    className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm font-medium transition"
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Add / Edit Form – একদম আগের মতো */}
                {activeTab === 2 && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-orange-600 mb-6">
                            {editMode ? "Edit Product" : "Add New Product"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Name */}
                            <div>
                                <label className="block font-medium mb-2">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Enter Product Name"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Price Type */}
                            <div>
                                <label className="block font-medium mb-3">Price Type</label>
                                <div className="flex gap-8">
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="priceType"
                                            value="single"
                                            checked={priceType === "single"}
                                            onChange={(e) => setPriceType(e.target.value)}
                                            className="w-5 h-5 text-orange-500"
                                        />
                                        <span>Single Size</span>
                                    </label>
                                    <label className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="priceType"
                                            value="multiple"
                                            checked={priceType === "multiple"}
                                            onChange={(e) => setPriceType(e.target.value)}
                                            className="w-5 h-5 text-orange-500"
                                        />
                                        <span>Multiple Sizes</span>
                                    </label>
                                </div>
                            </div>

                            {/* Single Price */}
                            {priceType === "single" && (
                                <div>
                                    <label className="block font-medium mb-2">Price (৳)</label>
                                    <input
                                        type="number"
                                        required
                                        placeholder="Enter Product Price"
                                        value={singlePrice}
                                        onChange={(e) => setSinglePrice(e.target.value)}
                                        className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:ring-orange-500 focus:outline-none"
                                    />
                                </div>
                            )}

                            {/* Multiple Sizes */}
                            {priceType === "multiple" && (
                                <div>
                                    <label className="block font-medium mb-3">Sizes & Prices</label>
                                    {sizes.map((item, index) => (
                                        <div key={index} className="flex gap-3 mb-3 items-center">
                                            <input
                                                type="text"
                                                placeholder="Size"
                                                value={item.size}
                                                onChange={(e) => updateSize(index, "size", e.target.value)}
                                                className="w-full px-4 py-3 border border-orange-300 rounded-lg"
                                                required
                                            />
                                            <input
                                                type="number"
                                                placeholder="Price (৳)"
                                                value={item.price}
                                                onChange={(e) => updateSize(index, "price", e.target.value)}
                                                className="w-full px-4 py-3 border border-orange-300 rounded-lg text-gray-900"
                                                required
                                            />
                                            {sizes.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() => removeSizeField(index)}
                                                    className="text-red-500 text-2xl"
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={addSizeField}
                                        className="text-orange-600 font-semibold"
                                    >
                                        + Add Size
                                    </button>
                                </div>
                            )}

                            {/* Image */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Product Image {editMode && "(leave unchanged if same)"}
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        const file = e.target.files[0];
                                        if (file) {
                                            setImage(file);
                                            setImagePreview(URL.createObjectURL(file));
                                        }
                                    }}
                                    className="w-full border-orange-500 border rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="w-64 h-64 object-cover rounded-lg border"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 text-white py-4 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-70"
                                >
                                    {loading ? "Saving..." : editMode ? "Update Product" : "Add Product"}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-8 py-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProductsManagement;