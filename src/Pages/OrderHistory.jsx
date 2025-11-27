import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Loader from "../Common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Package,
    Search,
    Filter,
    Calendar,
    Download,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    ChevronRight,
    MapPin,
} from "lucide-react";

const OrderHistory = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");

    const base_url = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (user?.email) fetchOrders();
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${base_url}/orders/${user.email}`);
            const sorted = res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
            setOrders(sorted);
            setFilteredOrders(sorted);
        } catch (err) {
            toast.error("Failed to load order history");
        } finally {
            setLoading(false);
        }
    };

    // Search & Filter
    useEffect(() => {
        let filtered = orders;

        if (searchTerm) {
            filtered = filtered.filter(order =>
                order._id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                order.items.some(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
            );
        }

        if (statusFilter !== "all") {
            filtered = filtered.filter(order => order.status?.toLowerCase() === statusFilter);
        }

        setFilteredOrders(filtered);
    }, [searchTerm, statusFilter, orders]);

    const getStatusBadge = (status) => {
        const map = {
            delivered: { color: "bg-green-100 text-green-800", icon: CheckCircle },
            confirmed: { color: "bg-blue-100 text-blue-800", icon: Package },
            processing: { color: "bg-purple-100 text-purple-800", icon: Truck },
            pending: { color: "bg-yellow-100 text-yellow-800", icon: Clock },
            cancelled: { color: "bg-red-100 text-red-800", icon: XCircle },
        };
        const s = map[status?.toLowerCase()] || map.pending;
        const Icon = s.icon;
        return (
            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${s.color}`}>
                <Icon className="w-4 h-4" />
                {status || "Pending"}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    if (userLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <Loader />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-10"
                >
                    <h1 className="text-4xl md:text-5xl font-bold text-emerald-800 mb-3">
                        Order History
                    </h1>
                    <p className="text-emerald-600 text-lg">Track all your past and current orders</p>
                </motion.div>

                {/* Search & Filter Bar */}
                <div className="bg-white rounded-2xl shadow-xl p-5 mb-8 sticky top-4 z-10 border border-emerald-100">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by Order ID or Product name..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition text-gray-800 placeholder-gray-400"
                            />
                        </div>

                        <div className="flex items-center gap-3">
                            <Filter className="w-5 h-5 text-emerald-600" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-5 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-emerald-400 transition"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="processing">Processing</option>
                                <option value="delivered">Delivered</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex items-center justify-center text-gray-600">
                            <Calendar className="w-5 h-5 mr-2" />
                            <span className="font-medium">Total Orders: {filteredOrders.length}</span>
                        </div>
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20 bg-white rounded-3xl shadow-xl"
                    >
                        <Package className="w-28 h-28 text-emerald-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-bold text-gray-700 mb-3">
                            {searchTerm || statusFilter !== "all" ? "No orders found" : "No orders yet"}
                        </h2>
                        <p className="text-gray-500 mb-8">
                            {searchTerm || statusFilter !== "all"
                                ? "Try adjusting your filters"
                                : "Start shopping to see your order history!"}
                        </p>
                        {!searchTerm && statusFilter === "all" && (
                            <button
                                onClick={() => window.location.href = "/products"}
                                className="px-10 py-4 bg-emerald-600 text-white text-lg font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg"
                            >
                                Start Shopping
                            </button>
                        )}
                    </motion.div>
                ) : (
                    <div className="grid gap-6">
                        {filteredOrders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.08 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100 hover:shadow-2xl transition-shadow"
                            >
                                <div className="p-6">
                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                                        {/* Order Info */}
                                        <div className="md:col-span-3">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                                <div>
                                                    <div className="flex items-center gap-3">
                                                        <h3 className="text-xl font-bold text-gray-800">
                                                            Order #{order._id.slice(-10)}
                                                        </h3>
                                                        {getStatusBadge(order.status)}
                                                    </div>
                                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-2">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(order.orderDate)}
                                                    </p>
                                                </div>

                                                <div className="text-right">
                                                    <p className="text-3xl font-bold text-emerald-600">
                                                        RM {order.totalAmount?.toFixed(2)}
                                                    </p>
                                                    <p className="text-sm text-gray-500 mt-1">
                                                        {order.items.length} item{order.items.length > 1 ? "s" : ""}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* Items Preview */}
                                            <div className="mt-5 flex flex-wrap gap-3">
                                                {order.items.slice(0, 4).map((item, i) => (
                                                    <div key={i} className="flex items-center gap-3 bg-gray-50 px-4 py-3 rounded-xl">
                                                        <img
                                                            src={item.image}
                                                            alt={item.name}
                                                            className="w-12 h-12 object-cover rounded-lg border"
                                                        />
                                                        <div>
                                                            <p className="font-medium text-sm text-gray-800 truncate max-w-32">
                                                                {item.name}
                                                            </p>
                                                            <p className="text-xs text-gray-500">
                                                                {item.quantity} Kg
                                                            </p>
                                                        </div>
                                                    </div>
                                                ))}
                                                {order.items.length > 4 && (
                                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg text-gray-500 text-xs font-bold">
                                                        +{order.items.length - 4}
                                                    </div>
                                                )}
                                            </div>

                                            {/* Delivery Address */}
                                            <div className="mt-5 p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                                                <p className="flex items-center gap-2 text-sm font-medium text-emerald-800">
                                                    <MapPin className="w-4 h-4" />
                                                    Delivery Address
                                                </p>
                                                <p className="text-sm text-gray-700 mt-1">
                                                    {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-col justify-between gap-3">
                                            <button
                                                onClick={() => alert("Invoice download coming soon!")}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition font-medium"
                                            >
                                                <Download className="w-5 h-5" />
                                                Invoice
                                            </button>

                                            <button
                                                onClick={() => window.location.href = `/orders`}
                                                className="flex items-center justify-center gap-2 px-5 py-3 bg-gray-100 text-gray-800 rounded-xl hover:bg-gray-200 transition font-medium"
                                            >
                                                View Details
                                                <ChevronRight className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderHistory;