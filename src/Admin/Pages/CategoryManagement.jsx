import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Trash2, Edit, Plus, Loader2, X, Upload, Check } from 'lucide-react';

const CategoryManagement = () => {
    const base_url = import.meta.env.VITE_BASE_URL;
    const imgbb_api_key = import.meta.env.VITE_IMGBB_API_KEY;

    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState([]);
    const [section, setSection] = useState('all-categories');
    const [editingId, setEditingId] = useState(null);
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        image: '',
        description: ''
    });

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const res = await axios.get(`${base_url}/categories`);
            setCategories(res.data);
        } catch (error) {
            alert('Error fetching categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (section === 'all-categories') fetchCategories();
    }, [section]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setUploading(true);
        const formDataImg = new FormData();
        formDataImg.append('image', file);

        try {
            const res = await axios.post(
                `https://api.imgbb.com/1/upload?key=${imgbb_api_key}`,
                formDataImg
            );
            setFormData(prev => ({ ...prev, image: res.data.data.url }));
        } catch (error) {
            alert('Image upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.name || !formData.image) {
            alert('Name and Image are required!');
            return;
        }

        try {
            if (editingId) {
                await axios.patch(`${base_url}/categories/${editingId}`, formData);
            } else {
                await axios.post(`${base_url}/categories`, formData);
            }

            setFormData({ name: '', image: '', description: '' });
            setEditingId(null);
            setSection('all-categories');
        } catch (error) {
            alert('Operation failed');
        }
    };

    const handleEdit = (cat) => {
        setFormData({
            name: cat.name,
            image: cat.image,
            description: cat.description || ''
        });
        setEditingId(cat._id);
        setSection('add-category');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category?')) return;
        try {
            await axios.delete(`${base_url}/categories/${id}`);
            fetchCategories();
        } catch (error) {
            alert('Delete failed');
        }
    };

    return (
        <div className='py-12'>
            {/* Mobile FAB */}
            <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                    setSection('add-category');
                    setEditingId(null);
                    setFormData({ name: '', image: '', description: '' });
                }}
                className="fixed bottom-18 right-6 z-50 bg-orange-500 text-white p-4 rounded-full shadow-2xl md:hidden flex items-center justify-center"
            >
                <Plus size={28} />
            </motion.button>

            <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-50">
                <div className="max-w-7xl mx-auto px-4 py-8 pb-24 md:pb-8">

                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <h1 className="text-4xl md:text-5xl font-bold text-orange-600">
                            Category Management
                        </h1>
                        <p className="text-orange-700 mt-2">Manage your store categories</p>
                    </motion.div>

                    {/* Desktop Tabs */}
                    <div className="hidden md:flex justify-center gap-8 mb-10 border-b-2 border-orange-200">
                        {['all-categories', 'add-category'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => {
                                    setSection(tab);
                                    if (tab === 'add-category') {
                                        setEditingId(null);
                                        setFormData({ name: '', image: '', description: '' });
                                    }
                                }}
                                className={`pb-3 px-6 text-lg font-semibold transition-all relative ${section === tab
                                    ? 'text-orange-600'
                                    : 'text-gray-600 hover:text-orange-500'
                                    }`}
                            >
                                {tab === 'all-categories' ? 'All Categories' : editingId ? 'Edit Category' : 'Add New'}
                                {section === tab && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute bottom-0 left-0 right-0 h-1 bg-orange-500 rounded-full"
                                    />
                                )}
                            </button>
                        ))}
                    </div>

                    {/* Mobile Bottom Nav */}
                    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-orange-200 md:hidden z-40">
                        <div className="flex">
                            <button
                                onClick={() => setSection('all-categories')}
                                className={`flex-1 py-4 text-center font-medium transition-all ${section === 'all-categories'
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-600'
                                    }`}
                            >
                                Categories
                            </button>
                            <button
                                onClick={() => {
                                    setSection('add-category');
                                    setEditingId(null);
                                    setFormData({ name: '', image: '', description: '' });
                                }}
                                className={`flex-1 py-4 text-center font-medium transition-all ${section === 'add-category'
                                    ? 'text-orange-600 bg-orange-50'
                                    : 'text-gray-600'
                                    }`}
                            >
                                {editingId ? 'Edit' : 'Add New'}
                            </button>
                        </div>
                    </div>

                    {/* Content */}
                    <AnimatePresence mode="wait">
                        {section === 'all-categories' && (
                            <motion.div
                                key="list"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                transition={{ duration: 0.3 }}
                            >
                                {loading ? (
                                    <div className="flex justify-center py-20">
                                        <Loader2 className="w-12 h-12 animate-spin text-orange-500" />
                                    </div>
                                ) : categories.length === 0 ? (
                                    <motion.div
                                        initial={{ scale: 0.8 }}
                                        animate={{ scale: 1 }}
                                        className="text-center py-20"
                                    >
                                        <div className="bg-orange-100 w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <Plus className="w-16 h-16 text-orange-400" />
                                        </div>
                                        <p className="text-xl text-orange-600 font-medium">
                                            No categories yet
                                        </p>
                                        <p className="text-orange-500">Tap the + button to add one!</p>
                                    </motion.div>
                                ) : (
                                    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                                        {categories.map((cat, index) => (
                                            <motion.div
                                                key={cat._id}
                                                initial={{ opacity: 0, y: 30 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                whileHover={{ y: -8 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                                            >
                                                <div className="h-40 bg-gradient-to-br from-orange-100 to-amber-100 relative">
                                                    <img
                                                        src={cat.image}
                                                        alt={cat.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                                                </div>
                                                <div className="p-4">
                                                    <h3 className="font-bold text-lg text-gray-800 truncate">
                                                        {cat.name}
                                                    </h3>
                                                    {cat.description && (
                                                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                            {cat.description}
                                                        </p>
                                                    )}
                                                    <div className="flex gap-2 mt-4">
                                                        <button
                                                            onClick={() => handleEdit(cat)}
                                                            className="flex-1 bg-orange-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-orange-600 transition"
                                                        >
                                                            <Edit size={16} />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(cat._id)}
                                                            className="flex-1 bg-red-500 text-white py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-1 hover:bg-red-600 transition"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        )}

                        {section === 'add-category' && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, x: 50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-10">
                                    <div className="flex justify-between items-center mb-8">
                                        <h2 className="text-2xl md:text-3xl font-bold text-orange-600">
                                            {editingId ? 'Edit Category' : 'Add New Category'}
                                        </h2>
                                        <button
                                            onClick={() => setSection('all-categories')}
                                            className="md:hidden p-2 hover:bg-orange-100 rounded-full"
                                        >
                                            <X size={24} className="text-orange-600" />
                                        </button>
                                    </div>

                                    <form onSubmit={handleSubmit} className="space-y-6">
                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-3">
                                                Category Name <span className="text-red-500">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                name="name"
                                                required
                                                value={formData.name}
                                                onChange={handleChange}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none transition text-lg"
                                                placeholder="e.g., Electronics"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-3">
                                                Category Image <span className="text-red-500">*</span>
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                    className="w-full px-5 py-4 rounded-xl border-2 border-dashed border-orange-300 bg-orange-50 file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600 cursor-pointer"
                                                />
                                                {uploading && (
                                                    <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
                                                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                                                    </div>
                                                )}
                                            </div>
                                            {formData.image && (
                                                <motion.div
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="mt-4"
                                                >
                                                    <img
                                                        src={formData.image}
                                                        alt="Preview"
                                                        className="w-full h-64 object-cover rounded-2xl shadow-lg"
                                                    />
                                                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                                                        <Check size={16} /> Image uploaded successfully
                                                    </p>
                                                </motion.div>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-gray-700 font-semibold mb-3">
                                                Description (Optional)
                                            </label>
                                            <textarea
                                                name="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                rows={4}
                                                className="w-full px-5 py-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none transition"
                                                placeholder="Brief description..."
                                            />
                                        </div>

                                        <div className="flex flex-col md:flex-row gap-4 pt-6">
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                type="submit"
                                                disabled={uploading}
                                                className="bg-gradient-to-r from-orange-500 to-amber-500 text-white font-bold py-5 rounded-2xl shadow-lg hover:shadow-xl transition flex items-center justify-center gap-3 text-lg"
                                            >
                                                <Plus size={24} />
                                                {editingId ? 'Update Category' : 'Create Category'}
                                            </motion.button>

                                            <button
                                                type="button"
                                                onClick={() => setSection('all-categories')}
                                                className="hidden md:block px-8 py-5 border-2 border-orange-300 text-orange-600 rounded-2xl font-semibold hover:bg-orange-50 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default CategoryManagement;