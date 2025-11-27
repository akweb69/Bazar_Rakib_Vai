import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../Context/AuthContext";
import Loader from "../Common/Loader";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import {
    Package,
    Clock,
    CheckCircle,
    XCircle,
    Truck,
    MapPin,
    Calendar,
    ChevronDown,
    ChevronUp,
} from "lucide-react";

const MyOrders = () => {
    const { user, loading: userLoading } = useContext(AuthContext);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const base_url = import.meta.env.VITE_BASE_URL;

    useEffect(() => {
        if (user?.email) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        try {
            const res = await axios.get(`${base_url}/orders/${user.email}`);
            // Sort by latest first
            setOrders(res.data.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate)));
        } catch (err) {
            toast.error("Failed to load orders");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return "bg-green-100 text-green-800";
            case "confirmed":
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
                return <CheckCircle className="w-5 h-5" />;
            case "confirmed":
            case "processing":
                return <Package className="w-5 h-5" />;
            case "pending":
                return <Clock className="w-5 h-5" />;
            case "cancelled":
                return <XCircle className="w-5 h-5" />;
            default:
                return <Truck className="w-5 h-5" />;
        }
    };

    if (userLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader />
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-50 to-teal-50">
                <div className="text-center">
                    <Package className="w-24 h-24 text-emerald-400 mx-auto mb-6" />
                    <h2 className="text-3xl font-bold text-gray-800">Please Login First</h2>
                    <button
                        onClick={() => window.location.href = "/login"}
                        className="mt-6 px-8 py-4 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition text-lg font-medium"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-teal-50 py-8 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl md:text-5xl font-bold text-center text-emerald-800 mb-10"
                >
                    My Orders
                </motion.h1>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20 bg-white rounded-3xl shadow-xl"
                    >
                        <Package className="w-32 h-32 text-emerald-300 mx-auto mb-6" />
                        <h2 className="text-3xl font-semibold text-gray-700 mb-4">
                            No Orders Yet
                        </h2>
                        <p className="text-gray-500 mb-8">Start shopping and place your first order!</p>
                        <button
                            onClick={() => window.location.href = "/products"}
                            className="px-10 py-4 bg-emerald-600 text-white text-lg font-medium rounded-xl hover:bg-emerald-700 transition shadow-lg"
                        >
                            Shop Now
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-6">
                        {orders.map((order, index) => (
                            <motion.div
                                key={order._id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white rounded-2xl shadow-xl overflow-hidden border border-emerald-100"
                            >
                                {/* Order Header */}
                                <div
                                    className="p-5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white cursor-pointer"
                                    onClick={() => setExpandedOrder(expandedOrder === order._id ? null : order._id)}
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div>
                                            <p className="text-sm opacity-90">Order ID</p>
                                            <p className="font-bold text-lg">{order._id.slice(-8)}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right">
                                                <p className="text-sm opacity-90">Total Amount</p>
                                                <p className="font-bold text-2xl">RM {order.totalAmount?.toFixed(2)}</p>
                                            </div>
                                            <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${getStatusColor(order.status)} text-white`}>
                                                {getStatusIcon(order.status)}
                                                <span className="font-medium capitalize">{order.status || "Pending"}</span>
                                            </div>
                                            {expandedOrder === order._id ? (
                                                <ChevronUp className="w-6 h-6" />
                                            ) : (
                                                <ChevronDown className="w-6 h-6" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Details */}
                                {expandedOrder === order._id && (
                                    <div className="p-6 border-t-4 border-emerald-200">
                                        <div className="grid md:grid-cols-2 gap-6">
                                            {/* Order Items */}
                                            <div>
                                                <h3 className="font-bold text-lg text-emerald-700 mb-4">Order Items</h3>
                                                <div className="space-y-3">
                                                    {order.items.map((item, i) => (
                                                        <div key={i} className="flex items-center gap-4 bg-gray-50 p-4 rounded-xl">
                                                            <img
                                                                src={item.image}
                                                                alt={item.name}
                                                                className="w-16 h-16 object-cover rounded-lg border"
                                                            />
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-800">{item.name}</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {item.quantity} Kg × RM {item.price}
                                                                </p>
                                                            </div>
                                                            <p className="font-bold text-emerald-600">
                                                                RM {(item.price * item.quantity).toFixed(2)}
                                                            </p>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Delivery Info */}
                                            <div>
                                                <h3 className="font-bold text-lg text-emerald-700 mb-4 flex items-center gap-2">
                                                    <MapPin className="w-5 h-5" />
                                                    Delivery Address
                                                </h3>
                                                <div className="bg-emerald-50 p-5 rounded-xl border border-emerald-200">
                                                    <p className="font-semibold">{order.name}</p>
                                                    <p className="text-gray-700 mt-1">
                                                        {order.deliveryAddress.street}, {order.deliveryAddress.city}
                                                        <br />
                                                        {order.deliveryAddress.state} - {order.deliveryAddress.zipCode}
                                                        <br />
                                                        {order.deliveryAddress.country}
                                                    </p>
                                                    <p className="mt-3 font-bold text-emerald-700">
                                                        Phone: {order.deliveryAddress.phone}
                                                    </p>
                                                </div>

                                                <div className="mt-6 flex items-center gap-2 text-gray-600">
                                                    <Calendar className="w-5 h-5" />
                                                    <span>Ordered on: {new Date(order.orderDate).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;