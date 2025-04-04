import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, ShoppingBag, DollarSign, AlertCircle, Filter, Home, ChevronRight, RefreshCw, Download, Info, Activity, Settings, Bell, Search } from 'lucide-react';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAmbassadors: 0,
        totalGuests: 0,
        totalGigs: 0,
        totalOrders: 0,
        pendingVerifications: 0,
        revenue: 0
    });
    const [timePeriod, setTimePeriod] = useState('month');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [analyticsData, setAnalyticsData] = useState({
        userGrowth: [],
        revenueByMonth: [],
        ordersByCategory: [],
        topCountries: [],
        servicePerformance: []
    });
    const [dashboardRefreshing, setDashboardRefreshing] = useState(false);
    const [retentionData, setRetentionData] = useState([
        {"cohort":"Jan 2025","month0":100,"month1":88.8,"month2":79.5,"month3":74.2,"month4":68.2,"month5":65.4,"month6":59.4,"totalUsers":2854},
        {"cohort":"Feb 2025","month0":100,"month1":89.2,"month2":80.6,"month3":72.1,"month4":65.3,"month5":62.3,"month6":null,"totalUsers":2960},
        {"cohort":"Mar 2025","month0":100,"month1":90.1,"month2":81.5,"month3":75.6,"month4":68.9,"month5":null,"month6":null,"totalUsers":3120},
        {"cohort":"Apr 2025","month0":100,"month1":87.5,"month2":78.3,"month3":73.2,"month4":null,"month5":null,"month6":null,"totalUsers":2975}
    ]);
    const [activeTab, setActiveTab] = useState('overview');

    const navigate = useNavigate();
    const COLORS = ['#4f46e5', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

    useEffect(() => {
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));

        // Redirect if not admin
        if (!currentUser || !currentUser.isAdmin) {
            navigate("/login");
            return;
        }

        fetchDashboardData();
    }, [navigate, timePeriod]);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Fetch dashboard stats
            const statsResponse = await newRequest.get("/admin/dashboard-stats");
            setStats(statsResponse.data);

            // For demonstration, we'll use mock data
            const analyticsResponse = await newRequest.get(`/admin/analytics?period=${timePeriod}`).catch(() => {
                return {
                    data: getMockAnalyticsData()
                };
            });

            setAnalyticsData(analyticsResponse.data);

            // Fetch retention data
            await newRequest.get(`/admin/retention-data?period=${timePeriod}`).catch(() => {
                // Retention data remains the same for now
            });

            setLoading(false);
        } catch (err) {
            console.error("Error fetching admin stats:", err);
            setError("Failed to load admin dashboard data");
            setLoading(false);
        }
    };

    const refreshDashboard = async () => {
        setDashboardRefreshing(true);
        await fetchDashboardData();
        setTimeout(() => setDashboardRefreshing(false), 800);
    };

    // Mock data generator for demonstration
    const getMockAnalyticsData = () => {
        return {
            userGrowth: [
                {name: 'Jan', guests: 40, ambassadors: 24},
                {name: 'Feb', guests: 30, ambassadors: 13},
                {name: 'Mar', guests: 20, ambassadors: 28},
                {name: 'Apr', guests: 27, ambassadors: 39},
                {name: 'May', guests: 18, ambassadors: 48},
                {name: 'Jun', guests: 23, ambassadors: 38},
            ],
            revenueByMonth: [
                {name: 'Jan', revenue: 4000},
                {name: 'Feb', revenue: 3000},
                {name: 'Mar', revenue: 5000},
                {name: 'Apr', revenue: 2780},
                {name: 'May', revenue: 1890},
                {name: 'Jun', revenue: 2390},
            ],
            ordersByCategory: [
                {name: 'City Tours', value: 400},
                {name: 'Adventure', value: 300},
                {name: 'Cultural', value: 300},
                {name: 'Nightlife', value: 200},
                {name: 'Food', value: 278},
                {name: 'Transportation', value: 189},
            ],
            topCountries: [
                {name: 'France', orders: 400},
                {name: 'Italy', orders: 300},
                {name: 'Spain', orders: 300},
                {name: 'Germany', orders: 200},
                {name: 'UK', orders: 278},
            ],
            servicePerformance: [
                {name: 'Car Tours', bookings: 400, revenue: 2400},
                {name: 'Walking Tours', bookings: 300, revenue: 1398},
                {name: 'Scooter Tours', bookings: 200, revenue: 9800},
                {name: 'Museum Guides', bookings: 278, revenue: 3908},
                {name: 'Food Tours', bookings: 189, revenue: 4800},
            ],
        };
    };

    // Function to get color based on retention percentage
    const getRetentionColor = (value) => {
        if (value === null) return '#f3f4f6';

        // Blue color scale from light to dark
        if (value >= 90) return '#1d4ed8';
        if (value >= 80) return '#2563eb';
        if (value >= 70) return '#3b82f6';
        if (value >= 60) return '#60a5fa';
        if (value >= 50) return '#93c5fd';
        if (value >= 40) return '#bfdbfe';
        if (value >= 30) return '#dbeafe';
        if (value >= 20) return '#eff6ff';
        return '#f8fafc';
    };

    const getRetentionTextColor = (value) => {
        if (value === null) return '#9ca3af';
        return value >= 60 ? 'white' : '#1f2937';
    };

    const handleNavigate = (path) => {
        navigate(path);
    };

    const handlePeriodChange = (period) => {
        setTimePeriod(period);
    };

    const handleExportData = () => {
        // In a real app, this would trigger a CSV or PDF download
        alert("Exporting dashboard data...");
    };

    if (loading && !dashboardRefreshing) return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
            <div className="flex flex-col items-center">
                <div className="w-12 h-12 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
                <p className="mt-4 text-gray-600">Loading dashboard data...</p>
            </div>
        </div>
    );

    if (error) return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
            <AlertCircle size={48} className="text-red-500" />
            <p className="mt-4 text-lg text-gray-700">{error}</p>
            <button
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                onClick={refreshDashboard}
            >
                Try Again
            </button>
        </div>
    );

    // Get all month keys for retention data
    const monthKeys = Object.keys(retentionData[0])
        .filter(key => key.startsWith('month'))
        .sort((a, b) => parseInt(a.slice(5)) - parseInt(b.slice(5)));

    return (
        <div className=" container flex h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="hidden md:flex flex-col w-64 bg-indigo-700 text-white">
                <div className="flex items-center justify-center h-16 border-b border-indigo-800">
                    <h1 className="text-xl font-bold">Admin Portal</h1>
                </div>

            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Top Navigation */}
                <header className="bg-white shadow-sm z-10">
                    <div className="flex items-center justify-between h-16 px-6">
                        <div className="flex items-center">
                            <button className="md:hidden mr-4 text-gray-500">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                                    <Search size={18} className="text-gray-400" />
                                </span>
                                <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 w-64 rounded-lg bg-gray-100 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 text-sm" />
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                                <Bell size={20} />
                                <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full"></span>
                            </button>
                            <div className="border-l border-gray-200 h-6 mx-2"></div>
                            <button
                                className={`flex items-center px-3 py-1.5 rounded text-sm ${dashboardRefreshing ? 'bg-indigo-100 text-indigo-700' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
                                onClick={refreshDashboard}
                                disabled={dashboardRefreshing}
                            >
                                <RefreshCw size={16} className={`mr-2 ${dashboardRefreshing ? 'animate-spin' : ''}`} />
                                {dashboardRefreshing ? 'Refreshing...' : 'Refresh'}
                            </button>
                            <button
                                className="flex items-center px-3 py-1.5 bg-indigo-600 text-white rounded text-sm hover:bg-indigo-700"
                                onClick={handleExportData}
                            >
                                <Download size={16} className="mr-2" />
                                Export
                            </button>
                        </div>
                    </div>
                </header>

                {/* Content Area */}
                <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
                    <div className="max-w-7xl mx-auto">
                        {/* Page Header */}
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                            <div>
                                <div className="flex items-center text-sm text-gray-500 mb-2">
                                    <span className="hover:text-indigo-600 cursor-pointer" onClick={() => navigate("/")}>Home</span>
                                    <ChevronRight size={14} className="mx-2" />
                                    <span className="text-gray-900">Admin Dashboard</span>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
                                <p className="text-gray-600 mt-1">Monitor and manage your platform's performance</p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <div className="flex items-center px-3 py-2 bg-white border border-gray-200 rounded-lg shadow-sm">
                                    <Filter size={16} className="text-gray-500 mr-2" />
                                    <select
                                        value={timePeriod}
                                        onChange={(e) => handlePeriodChange(e.target.value)}
                                        className="text-sm text-gray-700 bg-transparent focus:outline-none"
                                    >
                                        <option value="week">Last Week</option>
                                        <option value="month">Last Month</option>
                                        <option value="quarter">Last Quarter</option>
                                        <option value="year">Last Year</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Stats Overview */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer border-t-4 border-indigo-600" onClick={() => handleNavigate('/adminUsers/users')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Total Users</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalUsers.toLocaleString()}</h3>
                                        <div className="mt-2 text-xs text-gray-600">
                                            <span className="font-medium">{stats.totalAmbassadors.toLocaleString()}</span> Ambassadors •
                                            <span className="font-medium ml-1">{stats.totalGuests.toLocaleString()}</span> Guests
                                        </div>
                                    </div>
                                    <div className="bg-indigo-100 p-3 rounded-lg">
                                        <Users size={20} className="text-indigo-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleNavigate('/admin/gigs')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Services</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalGigs.toLocaleString()}</h3>
                                        <div className="mt-2 text-xs text-indigo-600 font-medium">View all services</div>
                                    </div>
                                    <div className="bg-cyan-100 p-3 rounded-lg">
                                        <ShoppingBag size={20} className="text-cyan-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleNavigate('/admin/orders')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Orders</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.totalOrders.toLocaleString()}</h3>
                                        <div className="mt-2 text-xs text-indigo-600 font-medium">View all orders</div>
                                    </div>
                                    <div className="bg-green-100 p-3 rounded-lg">
                                        <Calendar size={20} className="text-green-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleNavigate('/admin/verifications')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Pending Verifications</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">{stats.pendingVerifications.toLocaleString()}</h3>
                                        {stats.pendingVerifications > 0 ? (
                                            <div className="mt-2 text-xs font-medium px-2 py-1 bg-red-100 text-red-600 rounded-full inline-block">Action Required</div>
                                        ) : (
                                            <div className="mt-2 text-xs font-medium px-2 py-1 bg-green-100 text-green-600 rounded-full inline-block">All Verified</div>
                                        )}
                                    </div>
                                    <div className="bg-amber-100 p-3 rounded-lg">
                                        <AlertCircle size={20} className="text-amber-600" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer" onClick={() => handleNavigate('/admin/revenue')}>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <p className="text-gray-500 text-sm font-medium">Revenue</p>
                                        <h3 className="text-2xl font-bold text-gray-900 mt-2">${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</h3>
                                        <div className="mt-2 text-xs text-indigo-600 font-medium">View financial details</div>
                                    </div>
                                    <div className="bg-purple-100 p-3 rounded-lg">
                                        <DollarSign size={20} className="text-purple-600" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* User Retention */}
                        <div className="bg-white rounded-xl shadow-sm mb-8">
                            <div className="p-6 border-b border-gray-100">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-lg font-semibold text-gray-900">User Retention</h2>
                                    <button className="p-2 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full">
                                        <Info size={18} />
                                    </button>
                                </div>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-end mb-4">
                                    <div className="flex flex-col items-end">
                                        <div className="h-2 w-32 bg-gradient-to-r from-blue-50 to-blue-700 rounded-full"></div>
                                        <div className="flex justify-between w-32 mt-1 text-xs text-gray-500">
                                            <span>0%</span>
                                            <span>50%</span>
                                            <span>100%</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead>
                                        <tr>
                                            <th className="px-4 py-3 text-left font-medium text-gray-500 bg-gray-50 rounded-l">Cohort</th>
                                            <th className="px-4 py-3 text-right font-medium text-gray-500 bg-gray-50">Users</th>
                                            {monthKeys.map((month) => (
                                                <th key={month} className="px-4 py-3 text-center font-medium text-gray-500 bg-gray-50">
                                                    Month {month.slice(5)}
                                                </th>
                                            ))}
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {retentionData.map((row, idx) => (
                                            <tr key={row.cohort} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-4 py-3 font-medium text-gray-900">{row.cohort}</td>
                                                <td className="px-4 py-3 text-right text-gray-900">{row.totalUsers.toLocaleString()}</td>
                                                {monthKeys.map((month) => (
                                                    <td
                                                        key={month}
                                                        className="px-4 py-3 text-center"
                                                        style={{
                                                            backgroundColor: getRetentionColor(row[month]),
                                                            color: getRetentionTextColor(row[month])
                                                        }}
                                                    >
                                                        {row[month] !== null ? `${row[month].toFixed(1)}%` : '—'}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>

                                <p className="text-xs text-gray-500 italic mt-4">
                                    Shows percentage of users who continue to engage with the platform over time, grouped by cohort month.
                                </p>
                            </div>
                        </div>

                        {/* Analytics Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">User Growth</h2>
                                </div>
                                <div className="p-4">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart data={analyticsData.userGrowth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                                            <YAxis tick={{fontSize: 12}} />
                                            <Tooltip contentStyle={{borderRadius: '8px'}} />
                                            <Legend wrapperStyle={{fontSize: 12}} />
                                            <Bar dataKey="guests" fill="#10b981" name="Guests" radius={[4, 4, 0, 0]} />
                                            <Bar dataKey="ambassadors" fill="#4f46e5" name="Ambassadors" radius={[4, 4, 0, 0]} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">Revenue Trends</h2>
                                </div>
                                <div className="p-4">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <LineChart data={analyticsData.revenueByMonth}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                            <XAxis dataKey="name" tick={{fontSize: 12}} />
                                            <YAxis tick={{fontSize: 12}} />
                                            <Tooltip
                                                contentStyle={{borderRadius: '8px'}}
                                                formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']}
                                            />
                                            <Legend wrapperStyle={{fontSize: 12}} />
                                            <Line
                                                type="monotone"
                                                dataKey="revenue"
                                                stroke="#4f46e5"
                                                strokeWidth={3}
                                                dot={{r: 4}}
                                                activeDot={{r: 8}}
                                            />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">Orders by Category</h2>
                                </div>
                                <div className="p-4">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <PieChart>
                                            <Pie
                                                data={analyticsData.ordersByCategory}
                                                cx="50%"
                                                cy="50%"
                                                labelLine={false}
                                                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                                outerRadius={80}
                                                fill="#8884d8"
                                                dataKey="value"
                                            >
                                                {analyticsData.ordersByCategory.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{borderRadius: '8px'}}
                                                formatter={(value) => [value.toLocaleString(), 'Orders']}
                                            />
                                            <Legend layout="vertical" align="right" verticalAlign="middle" wrapperStyle={{fontSize: 12, paddingLeft: '10px'}} />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            <div className="bg-white rounded-xl shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-semibold text-gray-900">Top Countries</h2>
                                </div>
                                <div className="p-4">
                                    <ResponsiveContainer width="100%" height={250}>
                                        <BarChart
                                            data={analyticsData.topCountries}
                                            layout="vertical"
                                            margin={{top: 5, right: 30, left: 20, bottom: 5}}
                                        >
                                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
                                            <XAxis type="number" tick={{fontSize: 12}} />
                                            <YAxis dataKey="name" type="category" tick={{fontSize: 12}} width={80} />
                                            <Tooltip contentStyle={{borderRadius: '8px'}} />
                                            <Bar
                                                dataKey="orders"
                                                fill="#06b6d4"
                                                radius={[0, 4, 4, 0]}
                                                barSize={24}
                                                name="Orders"
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>

                        {/* Service Performance */}
                        <div className="bg-white rounded-xl shadow-sm mb-8">
                            <div className="p-6 border-b border-gray-100">
                                <h2 className="text-lg font-semibold text-gray-900">Service Performance</h2>
                            </div>
                            <div className="p-6">
                                <div className="overflow-x-auto">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead>
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Service Type</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Revenue</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Growth</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                        </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                        {analyticsData.servicePerformance.map((service, index) => (
                                            <tr key={service.name} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{service.bookings.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">${service.revenue.toLocaleString()}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className={`text-sm ${index % 3 === 0 ? 'text-green-600' : index % 3 === 1 ? 'text-red-600' : 'text-amber-600'}`}>
                                                        {index % 3 === 0 ? '+' : index % 3 === 1 ? '-' : ''}
                                                        {(Math.random() * 10).toFixed(1)}%
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                                                            ${index % 3 === 0
                                                            ? 'bg-green-100 text-green-800'
                                                            : index % 3 === 1
                                                                ? 'bg-red-100 text-red-800'
                                                                : 'bg-amber-100 text-amber-800'}`}>
                                                            {index % 3 === 0 ? 'Growing' : index % 3 === 1 ? 'Declining' : 'Stable'}
                                                        </span>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Footer */}
                        <footer className="mt-8 text-center">
                            <p className="text-sm text-gray-500">© 2025 Admin Dashboard. All rights reserved.</p>
                        </footer>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminDashboard;