import { useEffect, useState } from "react";
import api from "../../services/api";
import {
    ResponsiveContainer,
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    BarChart,
    Bar,
    Legend,
} from "recharts";

function AdminDashboard({onViewOrders, onViewUsers}) {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchDashboard();
    }, []);

    async function fetchDashboard() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await api.get("/admin/dashboard", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.data.success) {
                setDashboard(response.data);
            } else {
                setError(response.data.message || "Failed to load dashboard");
            }
        } catch (error) {
            console.error("Dashboard error:", error);

            setError(
                error.response?.data?.message ||
                "Failed to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <p className="text-gray-500">Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="bg-red-50 text-red-600 rounded-lg p-4">
                {error}
            </div>
        );
    }

    if (!dashboard) {
        return null;
    }

    const { stats } = dashboard;
    console.log("Dashboard data:", dashboard);
    console.log("Revenue chart:", dashboard.revenueChart);

    const orderStatusData = [
        {
            status: "Pending",
            orders: dashboard.orderStats.pending,
        },
        {
            status: "Processing",
            orders: dashboard.orderStats.processing,
        },
        {
            status: "Shipped",
            orders: dashboard.orderStats.shipped,
        },
        {
            status: "Delivered",
            orders: dashboard.orderStats.delivered,
        },
        {
            status: "Cancelled",
            orders: dashboard.orderStats.cancelled,
        },
    ];

    const cards = [
        {
            title: "Total Users",
            value: stats.totalUsers,
            icon: "👥",
        },
        {
            title: "Total Products",
            value: stats.totalProducts,
            icon: "📚",
        },
        {
            title: "Total Orders",
            value: stats.totalOrders,
            icon: "🛒",
        },
        {
            title: "Total Revenue",
            value: `₹${Number(stats.totalRevenue).toFixed(2)}`,
            icon: "💰",
        },
    ];

    return (
        <div className="space-y-6">

            {/* Dashboard heading */}
            <div>
                <h2 className="text-2xl font-bold text-gray-800">
                    Dashboard
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                    Overview of your Bokifa store
                </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white rounded-xl shadow-sm border border-gray-100 p-5"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-500">
                                    {card.title}
                                </p>

                                <p className="text-2xl font-bold text-gray-800 mt-2">
                                    {card.value}
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-2xl">
                                {card.icon}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Revenue chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Revenue Overview
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Revenue and orders from the last 10 days
                        </p>
                    </div>

                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart
                                data={dashboard.revenueChart}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="date"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip />

                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke="#16a34a"
                                    strokeWidth={3}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Order status chart */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
                    <div className="mb-5">
                        <h3 className="text-lg font-semibold text-gray-800">
                            Order Status
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                            Current orders by status
                        </p>
                    </div>

                    <div className="w-full h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={orderStatusData}
                                margin={{
                                    top: 10,
                                    right: 20,
                                    left: 0,
                                    bottom: 5,
                                }}
                            >
                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis
                                    dataKey="status"
                                    tick={{ fontSize: 12 }}
                                />

                                <YAxis
                                    allowDecimals={false}
                                    tick={{ fontSize: 12 }}
                                />

                                <Tooltip />

                                <Legend />

                                <Bar
                                    dataKey="orders"
                                    name="Orders"
                                    fill="#2196f3"
                                    radius={[8, 8, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

            </div>

            {/* Recent activity */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">

                {/* Recent Orders */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Recent Orders
                            </h3>

                            <p className="text-sm text-gray-500 mt-0.5">
                                Latest orders from your store
                            </p>
                        </div>

                        <button
                            onClick={onViewOrders}
                            className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline transition cursor-pointer"
                        >
                            View all →
                        </button>
                    </div>

                    {dashboard.recentOrders.length === 0 ? (
                        <div className="py-10 text-center">
                            <div className="text-3xl mb-2">🛒</div>

                            <p className="text-sm font-medium text-gray-700">
                                No orders yet
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                New orders will appear here.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {dashboard.recentOrders.map((order) => (
                                <div
                                    key={order._id}
                                    className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
                                >

                                    {/* Customer */}
                                    <div className="flex items-center gap-3 min-w-0">

                                        <div className="w-10 h-10 rounded-full bg-green-50 text-green-700 flex items-center justify-center font-semibold shrink-0">
                                            {(order.user?.name || "U")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {order.user?.name || "Unknown Customer"}
                                            </p>

                                            <p className="text-xs text-gray-500 truncate">
                                                {order.user?.email || "No email"}
                                            </p>

                                            <p className="text-xs text-gray-400 mt-0.5">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Amount + status */}
                                    <div className="text-right shrink-0">

                                        <p className="font-semibold text-gray-800">
                                            ₹{Number(order.total || 0).toFixed(2)}
                                        </p>

                                        <span
                                            className={`inline-flex items-center mt-1 px-2.5 py-1 rounded-full text-xs font-medium capitalize
                  ${order.status === "pending"
                                                    ? "bg-yellow-50 text-yellow-700"
                                                    : order.status === "processing"
                                                        ? "bg-blue-50 text-blue-700"
                                                        : order.status === "shipped"
                                                            ? "bg-purple-50 text-purple-700"
                                                            : order.status === "delivered"
                                                                ? "bg-green-50 text-green-700"
                                                                : order.status === "cancelled"
                                                                    ? "bg-red-50 text-red-700"
                                                                    : "bg-gray-100 text-gray-600"
                                                }
                `}
                                        >
                                            {order.status}
                                        </span>

                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>


                {/* Recent Users */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">

                    {/* Header */}
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Recent Users
                            </h3>

                            <p className="text-sm text-gray-500 mt-0.5">
                                Recently registered customers
                            </p>
                        </div>

                        <button
                            onClick={onViewUsers}
                            className="text-sm font-medium text-green-700 hover:text-green-800 hover:underline transition cursor-pointer"
                        >
                            View all →
                        </button>
                    </div>

                    {dashboard.recentUsers.length === 0 ? (
                        <div className="py-10 text-center">
                            <div className="text-3xl mb-2">👥</div>

                            <p className="text-sm font-medium text-gray-700">
                                No users yet
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                                New customers will appear here.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {dashboard.recentUsers.map((user) => (
                                <div
                                    key={user._id}
                                    className="flex items-center justify-between gap-4 px-5 py-4 border-b border-gray-50 last:border-0 hover:bg-gray-50 transition"
                                >

                                    {/* User information */}
                                    <div className="flex items-center gap-3 min-w-0">

                                        <div className="w-10 h-10 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center font-semibold shrink-0">
                                            {(user.name || "U")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <div className="min-w-0">
                                            <p className="font-medium text-gray-800 truncate">
                                                {user.name}
                                            </p>

                                            <p className="text-sm text-gray-500 truncate">
                                                {user.email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Joined date */}
                                    <div className="text-right shrink-0">
                                        <p className="text-xs text-gray-400">
                                            Joined
                                        </p>

                                        <p className="text-sm font-medium text-gray-700 mt-0.5">
                                            {new Date(user.createdAt).toLocaleDateString()}
                                        </p>
                                    </div>

                                </div>
                            ))}
                        </div>
                    )}
                </div>

            </div>

        </div>
    );
}

export default AdminDashboard;
