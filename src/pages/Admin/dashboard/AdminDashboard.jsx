import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import newRequest from '../../../utils/newRequest.js';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users, ShoppingBag, DollarSign, AlertCircle, Filter, Home, ChevronRight, RefreshCw, Download, Info } from 'lucide-react';

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

    const navigate = useNavigate();
    const COLORS = ['#ff681a', '#37d4d9', '#fec624', '#28a745', '#8884d8', '#82ca9d'];

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

            // In a real implementation, you would fetch this data from your API
            // For demonstration, we'll use mock data
            const analyticsResponse = await newRequest.get(`/admin/analytics?period=${timePeriod}`).catch(() => {
                // Fallback to mock data if endpoint doesn't exist yet
                return {
                    data: getMockAnalyticsData()
                };
            });

            setAnalyticsData(analyticsResponse.data);
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
        setTimeout(() => setDashboardRefreshing(false), 800); // Show refresh animation for at least 800ms
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
        <div className="admin-loading">
            <div className="loading-spinner"></div>
            <p>Loading dashboard data...</p>
        </div>
    );

    if (error) return (
        <div className="admin-error">
            <AlertCircle size={48} />
            <p>{error}</p>
            <button className="retry-btn" onClick={refreshDashboard}>Try Again</button>
        </div>
    );

    return (
        <div className="admin-dashboard">
            <div className="container">
                <div className="dashboard-header">
                    <div className="header-left">
                        <div className="breadcrumb">
                            <span className="breadcrumb-item" onClick={() => navigate("/")}><Home size={14} /> Home</span>
                            <ChevronRight size={14} className="breadcrumb-separator" />
                            <span className="breadcrumb-item active">Admin Dashboard</span>
                        </div>
                        <h1 className="dashboard-title">Admin Dashboard</h1>
                        <p className="dashboard-subtitle">Overview of your platform's performance</p>
                    </div>
                    <div className="header-actions">
                        <button
                            className={`refresh-btn ${dashboardRefreshing ? 'refreshing' : ''}`}
                            onClick={refreshDashboard}
                            disabled={dashboardRefreshing}
                        >
                            <RefreshCw size={16} />
                            <span>{dashboardRefreshing ? 'Refreshing...' : 'Refresh'}</span>
                        </button>
                        <button className="export-btn" onClick={handleExportData}>
                            <Download size={16} />
                            <span>Export</span>
                        </button>
                        <div className="period-selector">
                            <Filter className="filter-icon" size={16} />
                            <select
                                value={timePeriod}
                                onChange={(e) => handlePeriodChange(e.target.value)}
                                className="period-select"
                                aria-label="Select time period"
                            >
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="quarter">Last Quarter</option>
                                <option value="year">Last Year</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="dashboard-overview">
                    <h2 className="section-title">Overview</h2>
                    <div className="stats-cards">
                        <div className="stat-card" onClick={() => handleNavigate('/adminUsers/users')}>
                            <div className="stat-icon">
                                <Users size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Users</h3>
                                <div className="stat-value">{stats.totalUsers.toLocaleString()}</div>
                                <div className="stat-details">
                                    <div className="stat-detail-item">
                                        <span className="detail-label">Ambassadors:</span>
                                        <span className="detail-value">{stats.totalAmbassadors.toLocaleString()}</span>
                                    </div>
                                    <div className="stat-detail-item">
                                        <span className="detail-label">Guests:</span>
                                        <span className="detail-value">{stats.totalGuests.toLocaleString()}</span>
                                    </div>
                                </div>
                                <div className="stat-footer">
                                    <span className="view-more">View Details</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card" onClick={() => handleNavigate('/admin/gigs')}>
                            <div className="stat-icon">
                                <ShoppingBag size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Services</h3>
                                <div className="stat-value">{stats.totalGigs.toLocaleString()}</div>
                                <div className="stat-footer">
                                    <span className="view-more">View Details</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card" onClick={() => handleNavigate('/admin/orders')}>
                            <div className="stat-icon">
                                <Calendar size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Orders</h3>
                                <div className="stat-value">{stats.totalOrders.toLocaleString()}</div>
                                <div className="stat-footer">
                                    <span className="view-more">View Details</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card highlight" onClick={() => handleNavigate('/admin/verifications')}>
                            <div className="stat-icon">
                                <AlertCircle size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Pending Verifications</h3>
                                <div className="stat-value">{stats.pendingVerifications.toLocaleString()}</div>
                                <div className="stat-badge">
                                    {stats.pendingVerifications > 0 ? 'Action Required' : 'All Verified'}
                                </div>
                                <div className="stat-footer">
                                    <span className="view-more">View Details</span>
                                </div>
                            </div>
                        </div>

                        <div className="stat-card" onClick={() => handleNavigate('/admin/revenue')}>
                            <div className="stat-icon">
                                <DollarSign size={24} />
                            </div>
                            <div className="stat-content">
                                <h3>Revenue</h3>
                                <div className="stat-value">${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}</div>
                                <div className="stat-footer">
                                    <span className="view-more">View Details</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="analytics-section">
                    <div className="section-header">
                        <h2 className="section-title">Performance Analytics</h2>
                        <div className="section-actions">
                            <button className="info-btn" title="About these analytics">
                                <Info size={16} />
                            </button>
                        </div>
                    </div>

                    <div className="analytics-grid">
                        <div className="analytics-card">
                            <div className="card-header">
                                <h3>User Growth</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={analyticsData.userGrowth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip />
                                        <Legend />
                                        <Bar dataKey="guests" fill="#37d4d9" name="Guests" />
                                        <Bar dataKey="ambassadors" fill="#ff681a" name="Ambassadors" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="card-header">
                                <h3>Revenue Trends</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <LineChart data={analyticsData.revenueByMonth}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis />
                                        <Tooltip formatter={(value) => ['$' + value.toLocaleString(), 'Revenue']} />
                                        <Legend />
                                        <Line type="monotone" dataKey="revenue" stroke="#ff681a" strokeWidth={2} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="card-header">
                                <h3>Orders by Category</h3>
                            </div>
                            <div className="chart-container">
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
                                        <Tooltip formatter={(value, name, props) => [`${value.toLocaleString()} orders`, props.payload.name]} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="analytics-card">
                            <div className="card-header">
                                <h3>Top Countries</h3>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart
                                        layout="vertical"
                                        data={analyticsData.topCountries}
                                        margin={{
                                            top: 5,
                                            right: 30,
                                            left: 60,
                                            bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis type="number" />
                                        <YAxis dataKey="name" type="category" />
                                        <Tooltip formatter={(value) => [value.toLocaleString(), 'Orders']} />
                                        <Legend />
                                        <Bar dataKey="orders" fill="#37d4d9" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="analytics-card full-width">
                            <div className="card-header">
                                <h3>Service Performance</h3>
                                <div className="card-actions">
                                    <span className="card-metric active">Bookings</span>
                                    <span className="card-metric">Revenue</span>
                                </div>
                            </div>
                            <div className="chart-container">
                                <ResponsiveContainer width="100%" height={250}>
                                    <BarChart data={analyticsData.servicePerformance}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis dataKey="name" />
                                        <YAxis yAxisId="left" />
                                        <YAxis yAxisId="right" orientation="right" />
                                        <Tooltip
                                            formatter={(value, name) => [
                                                name === 'Bookings' ? value.toLocaleString() : `$${value.toLocaleString()}`,
                                                name
                                            ]}
                                        />
                                        <Legend />
                                        <Bar yAxisId="left" dataKey="bookings" fill="#ff681a" name="Bookings" />
                                        <Bar yAxisId="right" dataKey="revenue" fill="#37d4d9" name="Revenue ($)" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="admin-actions">
                    <div className="section-header">
                        <h2 className="section-title">Quick Actions</h2>
                    </div>
                    <div className="action-buttons">
                        <button className="admin-btn primary" onClick={() => handleNavigate('/adminUsers/users')}>
                            <Users size={18} className="btn-icon" />
                            Manage Users
                        </button>
                        <button className="admin-btn" onClick={() => handleNavigate('/admin/gigs')}>
                            <ShoppingBag size={18} className="btn-icon" />
                            Manage Services
                        </button>
                        <button className="admin-btn" onClick={() => handleNavigate('/admin/orders')}>
                            <Calendar size={18} className="btn-icon" />
                            View Orders
                        </button>
                        <button className="admin-btn accent" onClick={() => handleNavigate('/admin/verifications')}>
                            <AlertCircle size={18} className="btn-icon" />
                            Verify Ambassadors
                        </button>
                        <button className="admin-btn" onClick={() => handleNavigate('/admin/countries')}>
                            <TrendingUp size={18} className="btn-icon" />
                            Manage Countries
                        </button>
                        <button className="admin-btn" onClick={() => handleNavigate('/admin/reports')}>
                            <TrendingUp size={18} className="btn-icon" />
                            Advanced Reports
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;