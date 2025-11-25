import { useState, useEffect, useMemo } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../../Common/Loader";

const ProductsManagement = () => {
    const [activeTab, setActiveTab] = useState(1);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);

    // Search state
    const [searchQuery, setSearchQuery] = useState("");

    // Form states
    const [editMode, setEditMode] = useState(false);
    const [editingProductId, setEditingProductId] = useState(null);

    const [productName, setProductName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [existingImage, setExistingImage] = useState("");
    const [categories, setCategories] = useState([]);

    const base_url = import.meta.env.VITE_BASE_URL;
    const imgbb_api_key = import.meta.env.VITE_IMGBB_API_KEY;

    // Fetch products & categories
    useEffect(() => {
        if (activeTab === 1) {
            fetchProducts();
        }
    }, [activeTab]);

    useEffect(() => {
        axios
            .get(`${base_url}/categories`)
            .then((res) => setCategories(res.data))
            .catch((err) => {
                console.error("Failed to load categories", err);
                toast.error("ক্যাটেগরি লোড করতে সমস্যা হয়েছে", { id: "category-error" });
            });
    }, [base_url]);

    const fetchProducts = async () => {
        setFetching(true);
        try {
            const res = await axios.get(`${base_url}/products`);
            setProducts(res.data);
        } catch (err) {
            toast.error("প্রোডাক্ট লোড করতে ব্যর্থ হয়েছে", { id: "fetch-products-error" });
        } finally {
            setFetching(false);
        }
    };

    // Search filter
    const filteredProducts = useMemo(() => {
        if (!searchQuery.trim()) return products;
        const query = searchQuery.toLowerCase();
        return products.filter((product) =>
            product.name.toLowerCase().includes(query)
        );
    }, [products, searchQuery]);

    // Image upload to imgbb
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await axios.post(
            `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
            formData
        );
        return res.data.data.url;
    };

    // Start Edit
    const startEdit = (product) => {
        setEditMode(true);
        setEditingProductId(product._id);

        setProductName(product.name);
        setPrice(product.price);
        setCategory(product.category || "");
        setExistingImage(product.image);
        setImagePreview(product.image);

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
        setPrice("");
        setCategory("");
        setImage(null);
        setImagePreview("");
        setExistingImage("");
    };

    // Submit (Add / Update)
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!productName) return toast.error("প্রোডাক্টের নাম দিতে হবে", { id: "name-error" });
        if (!price) return toast.error("দাম দিতে হবে", { id: "price-error" });
        if (!category) return toast.error("ক্যাটেগরি বাছাই করুন", { id: "category-error" });

        setLoading(true);
        const loadingToastId = toast.loading("ইমেজ আপলোড হচ্ছে...");

        try {
            let imageUrl = existingImage;

            if (image) {
                imageUrl = await uploadImage(image);
                toast.dismiss(loadingToastId);
            } else {
                toast.dismiss(loadingToastId);
            }

            const productData = {
                name: productName,
                price: Number(price),
                category: category,
                image: imageUrl,
            };

            if (editMode) {
                await axios.patch(`${base_url}/products/${editingProductId}`, productData);
                toast.success("প্রোডাক্ট সফলভাবে আপডেট হয়েছে!", { id: "update-success" });
            } else {
                productData.createdAt = new Date();
                await axios.post(`${base_url}/products`, productData);
                toast.success("নতুন প্রোডাক্ট যোগ হয়েছে!", { id: "add-success" });
            }

            resetForm();
            setEditMode(false);
            setEditingProductId(null);
            fetchProducts();
        } catch (err) {
            console.error(err);
            toast.error(editMode ? "আপডেট করতে ব্যর্থ হয়েছে" : "প্রোডাক্ট যোগ করতে ব্যর্থ হয়েছে", {
                id: "submit-error",
            });
        } finally {
            setLoading(false);
        }
    };

    // Delete
    const deleteProduct = async (id) => {
        if (!window.confirm("এই প্রোডাক্টটি ডিলিট করবেন?")) return;

        try {
            await axios.delete(`${base_url}/products/${id}`);
            toast.success("প্রোডাক্ট ডিলিট হয়েছে", { id: `delete-${id}` });
            fetchProducts();
        } catch (err) {
            toast.error("ডিলিট করতে ব্যর্থ হয়েছে", { id: "delete-error" });
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
                            : "bg-white text-orange-500 border border-orange-200"}`}
                    >
                        All Products
                    </button>
                    <button
                        onClick={() => { setActiveTab(2); if (!editMode) cancelEdit(); }}
                        className={`py-4 rounded-xl font-semibold transition-all ${activeTab === 2
                            ? "bg-orange-500 text-white shadow-lg"
                            : "bg-white text-orange-500 border border-orange-200"}`}
                    >
                        {editMode ? "Edit Product" : "Add New Product"}
                    </button>
                </div>

                {/* All Products Tab */}
                {activeTab === 1 && (
                    <div className="bg-white rounded-xl shadow-md p-6">
                        {/* Search */}
                        <div className="mb-8">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="প্রোডাক্টের নাম দিয়ে সার্চ করুন..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-5 py-4 pl-12 text-lg border border-orange-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {fetching ? (
                            <div className="h-[50vh] flex items-center justify-center"><Loader /></div>
                        ) : filteredProducts.length === 0 ? (
                            <p className="text-center py-16 text-gray-500 text-xl">
                                {searchQuery ? "কোনো প্রোডাক্ট পাওয়া যায়নি।" : "এখনো কোনো প্রোডাক্ট নেই।"}
                            </p>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                                {filteredProducts.map((product) => (
                                    <div key={product._id} className="border border-orange-100 rounded-xl overflow-hidden shadow-lg bg-white hover:shadow-xl transition-shadow">
                                        <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                                        <div className="p-4">
                                            <h3 className="font-bold text-lg truncate">{product.name}</h3>
                                            <p className="text-sm text-gray-600">{product.category || "Uncategorized"}</p>
                                            <p className="text-orange-600 font-bold text-lg mt-1">৳{product.price}</p>

                                            <div className="mt-4 flex gap-2">
                                                <button onClick={() => startEdit(product)} className="flex-1 bg-blue-500 text-white py-2 rounded hover:bg-blue-600 text-sm font-medium">
                                                    Edit
                                                </button>
                                                <button onClick={() => deleteProduct(product._id)} className="flex-1 bg-red-500 text-white py-2 rounded hover:bg-red-600 text-sm font-medium">
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

                {/* Add / Edit Form */}
                {activeTab === 2 && (
                    <div className="bg-white rounded-xl shadow-md p-8">
                        <h2 className="text-2xl font-bold text-orange-600 mb-6">
                            {editMode ? "Edit Product" : "Add New Product"}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Product Name */}
                            <div>
                                <label className="block font-medium mb-2">Product Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="প্রোডাক্টের নাম লিখুন"
                                    value={productName}
                                    onChange={(e) => setProductName(e.target.value)}
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Category Select */}
                            <div>
                                <label className="block font-medium mb-2">Category</label>
                                <select
                                    required
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="">ক্যাটেগরি বাছাই করুন</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat.name}>
                                            {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price */}
                            <div>
                                <label className="block font-medium mb-2">Price (৳)</label>
                                <input
                                    type="number"
                                    required
                                    placeholder="দাম লিখুন"
                                    value={price}
                                    onChange={(e) => setPrice(e.target.value)}
                                    className="w-full px-4 py-3 border border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            {/* Image */}
                            <div>
                                <label className="block font-medium mb-2">
                                    Product Image {editMode && "(বর্তমান ইমেজ রাখতে ফাঁকা রাখুন)"}
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
                                    className="w-full border border-orange-300 rounded-lg py-2 px-4 focus:outline-none focus:ring-2 focus:ring-orange-500"
                                />
                                {imagePreview && (
                                    <div className="mt-4">
                                        <img src={imagePreview} alt="Preview" className="w-64 h-64 object-cover rounded-lg border" />
                                    </div>
                                )}
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex gap-4">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="flex-1 bg-orange-500 text-white py-4 rounded-lg font-bold hover:bg-orange-600 disabled:opacity-70"
                                >
                                    {loading ? "সেভ হচ্ছে..." : editMode ? "আপডেট করুন" : "প্রোডাক্ট যোগ করুন"}
                                </button>
                                {editMode && (
                                    <button
                                        type="button"
                                        onClick={cancelEdit}
                                        className="px-8 py-4 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
                                    >
                                        বাতিল
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