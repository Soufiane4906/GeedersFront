import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Users, Award, Star, ThumbsUp, Download, Filter, ChevronDown, ArrowUpRight, ArrowDownRight, Compass } from 'lucide-react';

const AdminDashboard = () => {
    const [timeRange, setTimeRange] = useState('month');
    const [loading, setLoading] = useState(true);
    const [ambassadorData, setAmbassadorData] = useState({
        topAmbassadors: [],
        performanceByCity: [],
        ratingTrends: [],
        bookingConversion: [],
        categoryPerformance: []
    });
    const [selectedCity, setSelectedCity] = useState('All Cities');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        // In a real implementation, this would fetch data from your API
        const fetchData = async () => {
            setLoading(true);

            try {
                // Simulate API call with timeout
                setTimeout(() => {
                    setAmbassadorData(generateFakeData(timeRange));
                    setLoading(false);
                }, 800);
            } catch (error) {
                console.error('Error fetching ambassador data:', error);
                setLoading(false);
            }
        };

        fetchData();
    }, [timeRange]);

    const generateFakeData = (period) => {
        // Generate different data based on selected time period
        const monthMultiplier = period === 'year' ? 12 : period === 'quarter' ? 3 : 1;

        // Generate top ambassadors
        const topAmbassadors = [
            { id: 1, name: 'Sophie Martin', location: 'Paris', rating: 4.9, bookings: 78 * monthMultiplier, revenue: 5840 * monthMultiplier, avatar: '/api/placeholder/40/40' },
            { id: 2, name: 'Marco Rossi', location: 'Rome', rating: 4.8, bookings: 65 * monthMultiplier, revenue: 4875 * monthMultiplier, avatar: '/api/placeholder/40/40' },
            { id: 3, name: 'Elena Lopez', location: 'Barcelona', rating: 4.9, bookings: 59 * monthMultiplier, revenue: 4425 * monthMultiplier, avatar: '/api/placeholder/40/40' },
            { id: 4, name: 'Thomas Müller', location: 'Berlin', rating: 4.7, bookings: 52 * monthMultiplier, revenue: 3900 * monthMultiplier, avatar: '/api/placeholder/40/40' },
            { id: 5, name: 'Anna Kowalski', location: 'Warsaw', rating: 4.8, bookings: 47 * monthMultiplier, revenue: 3525 * monthMultiplier, avatar: '/api/placeholder/40/40' }
        ];

        // Generate performance by city
        const cities = ['Paris', 'Rome', 'Barcelona', 'Berlin', 'London', 'Amsterdam', 'Prague'];
        const performanceByCity = cities.map(city => {
            const baseBookings = Math.floor(Math.random() * 100) + 50;
            const baseRevenue = baseBookings * 75;
            const baseAmbassadors = Math.floor(Math.random() * 15) + 5;

            return {
                city,
                bookings: baseBookings * monthMultiplier,
                revenue: baseRevenue * monthMultiplier,
                ambassadors: baseAmbassadors,
                avgRating: (4 + Math.random()).toFixed(1),
                growth: ((Math.random() * 30) - 10).toFixed(1)
            };
        }).sort((a, b) => b.bookings - a.bookings);

        // Generate rating trends
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentMonth = new Date().getMonth();

        let ratingTrends = [];
        if (period === 'week') {
            const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            ratingTrends = days.map(day => ({
                name: day,
                rating: (4 + Math.random()).toFixed(2),
                bookings: Math.floor(Math.random() * 30) + 10
            }));
        } else if (period === 'month') {
            ratingTrends = Array.from({ length: 4 }, (_, i) => ({
                name: `Week ${i + 1}`,
                rating: (4 + Math.random()).toFixed(2),
                bookings: Math.floor(Math.random() * 120) + 40
            }));
        } else if (period === 'quarter') {
            const recentMonths = months.slice(Math.max(0, currentMonth - 2), currentMonth + 1);
            ratingTrends = recentMonths.map(month => ({
                name: month,
                rating: (4 + Math.random()).toFixed(2),
                bookings: Math.floor(Math.random() * 300) + 100
            }));
        } else {
            ratingTrends = months.map(month => ({
                name: month,
                rating: (4 + Math.random()).toFixed(2),
                bookings: Math.floor(Math.random() * 500) + 200
            }));
        }

        // Generate booking conversion funnel
        const baseViews = Math.floor(Math.random() * 5000) + 10000;
        const bookingConversion = {
            profileViews: baseViews * monthMultiplier,
            inquiries: Math.floor(baseViews * 0.35) * monthMultiplier,
            bookingRequests: Math.floor(baseViews * 0.18) * monthMultiplier,
            confirmedBookings: Math.floor(baseViews * 0.09) * monthMultiplier,
            completedTours: Math.floor(baseViews * 0.085) * monthMultiplier
        };

        // Generate category performance
        const categories = ['City Tours', 'Cultural Experiences', 'Food Tours', 'Adventure', 'Nightlife', 'Transportation'];
        const categoryPerformance = categories.map(category => ({
            category,
            bookings: Math.floor(Math.random() * 200 + 50) * monthMultiplier,
            revenue: Math.floor(Math.random() * 15000 + 3750) * monthMultiplier,
            ambassadors: Math.floor(Math.random() * 15) + 3,
            satisfaction: (4 + Math.random()).toFixed(1)
        })).sort((a, b) => b.bookings - a.bookings);

        return {
            topAmbassadors,
            performanceByCity,
            ratingTrends,
            bookingConversion,
            categoryPerformance
        };
    };

    const handleExportData = () => {
        alert('Exporting ambassador performance data...');
    };

    const isPositiveGrowth = (value) => parseFloat(value) >= 0;

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64 bg-white rounded-xl shadow-sm">
                <div className="flex flex-col items-center">
                    <div className="w-8 h-8 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
                    <p className="mt-4 text-sm text-gray-600">Loading ambassador data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900">Ambassador Performance</h2>
                        <p className="text-gray-600 text-sm">Track ambassador activity, ratings, and bookings</p>
                    </div>
                    <div className="flex items-center space-x-3 mt-4 md:mt-0">
                        <div className="relative">
                            <button
                                className="flex items-center px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50"
                                onClick={() => setIsOpen(!isOpen)}
                            >
                                <Filter size={16} className="text-gray-500 mr-2" />
                                <span className="text-gray-700">{timeRange === 'week' ? 'Last Week' : timeRange === 'month' ? 'Last Month' : timeRange === 'quarter' ? 'Last Quarter' : 'Last Year'}</span>
                                <ChevronDown size={16} className="text-gray-500 ml-2" />
                            </button>

                            {isOpen && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-md z-10">
                                    <div className="py-1">
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                            onClick={() => {
                                                setTimeRange('week');
                                                setIsOpen(false);
                                            }}
                                        >
                                            Last Week
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                            onClick={() => {
                                                setTimeRange('month');
                                                setIsOpen(false);
                                            }}
                                        >
                                            Last Month
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                            onClick={() => {
                                                setTimeRange('quarter');
                                                setIsOpen(false);
                                            }}
                                        >
                                            Last Quarter
                                        </button>
                                        <button
                                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700"
                                            onClick={() => {
                                                setTimeRange('year');
                                                setIsOpen(false);
                                            }}
                                        >
                                            Last Year
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <button
                            className="flex items-center px-3 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700"
                            onClick={handleExportData}
                        >
                            <Download size={16} className="mr-2" />
                            Export
                        </button>
                    </div>
                </div>

                {/* Performance Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-indigo-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-medium">Total Ambassadors</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {ambassadorData.performanceByCity.reduce((total, city) => total + city.ambassadors, 0)}
                                </h3>
                                <div className="flex items-center mt-1 text-xs">
                  <span className={`flex items-center ${isPositiveGrowth('12.4') ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveGrowth('12.4') ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                      12.4%
                  </span>
                                    <span className="text-gray-500 ml-1">vs previous period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-indigo-100">
                                <Users size={18} className="text-indigo-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-cyan-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-medium">Total Bookings</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {ambassadorData.topAmbassadors.reduce((total, ambassador) => total + ambassador.bookings, 0)}
                                </h3>
                                <div className="flex items-center mt-1 text-xs">
                  <span className={`flex items-center ${isPositiveGrowth('8.7') ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveGrowth('8.7') ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                      8.7%
                  </span>
                                    <span className="text-gray-500 ml-1">vs previous period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-cyan-100">
                                <Compass size={18} className="text-cyan-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-green-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-medium">Average Rating</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    {(ambassadorData.topAmbassadors.reduce((sum, ambassador) => sum + ambassador.rating, 0) / ambassadorData.topAmbassadors.length).toFixed(1)}
                                </h3>
                                <div className="flex items-center mt-1 text-xs">
                  <span className={`flex items-center ${isPositiveGrowth('3.2') ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveGrowth('3.2') ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                      3.2%
                  </span>
                                    <span className="text-gray-500 ml-1">vs previous period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-green-100">
                                <Star size={18} className="text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm p-4 border-l-4 border-amber-600">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-gray-500 text-xs uppercase font-medium">Total Revenue</p>
                                <h3 className="text-2xl font-bold text-gray-900 mt-1">
                                    €{ambassadorData.topAmbassadors.reduce((total, ambassador) => total + ambassador.revenue, 0).toLocaleString()}
                                </h3>
                                <div className="flex items-center mt-1 text-xs">
                  <span className={`flex items-center ${isPositiveGrowth('15.8') ? 'text-green-600' : 'text-red-600'}`}>
                    {isPositiveGrowth('15.8') ? <ArrowUpRight size={12} className="mr-1" /> : <ArrowDownRight size={12} className="mr-1" />}
                      15.8%
                  </span>
                                    <span className="text-gray-500 ml-1">vs previous period</span>
                                </div>
                            </div>
                            <div className="p-3 rounded-lg bg-amber-100">
                                <Award size={18} className="text-amber-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Top Ambassadors and Performance by City */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Top Ambassadors */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Top Ambassadors</h3>
                        </div>
                        <div className="p-4">
                            <div className="overflow-x-auto">
                                <table className="min-w-full">
                                    <thead>
                                    <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        <th className="px-4 py-3">Ambassador</th>
                                        <th className="px-4 py-3">Bookings</th>
                                        <th className="px-4 py-3">Rating</th>
                                        <th className="px-4 py-3 text-right">Revenue</th>
                                    </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                    {ambassadorData.topAmbassadors.map((ambassador) => (
                                        <tr key={ambassador.id} className="hover:bg-gray-50">
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <div className="h-8 w-8 rounded-full bg-gray-200 flex-shrink-0 mr-3">
                                                        <img src={ambassador.avatar} alt={ambassador.name} className="h-8 w-8 rounded-full" />
                                                    </div>
                                                    <div>
                                                        <div className="font-medium text-gray-900">{ambassador.name}</div>
                                                        <div className="text-xs text-gray-500">{ambassador.location}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm">{ambassador.bookings}</td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center">
                                                    <Star size={14} className={`text-amber-500 mr-1`} fill="#f59e0b" />
                                                    <span className="text-sm">{ambassador.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-4 py-3 text-sm text-right">€{ambassador.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                                    View All Ambassadors
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Performance by City */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold text-gray-900">Performance by City</h3>
                                <div className="relative">
                                    <select
                                        value={selectedCity}
                                        onChange={(e) => setSelectedCity(e.target.value)}
                                        className="text-sm border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                                    >
                                        <option value="All Cities">All Cities</option>
                                        {ambassadorData.performanceByCity.map(city => (
                                            <option key={city.city} value={city.city}>{city.city}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={220}>
                                <BarChart
                                    data={selectedCity === 'All Cities'
                                        ? ambassadorData.performanceByCity
                                        : ambassadorData.performanceByCity.filter(c => c.city === selectedCity)}
                                    margin={{ top: 10, right: 10, left: 10, bottom: 20 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="city" tick={{fontSize: 12}} />
                                    <YAxis yAxisId="left" orientation="left" tick={{fontSize: 12}} />
                                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={{borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        formatter={(value, name) => [name === 'revenue' ? `€${value.toLocaleString()}` : value, name === 'revenue' ? 'Revenue' : 'Bookings']}
                                    />
                                    <Legend wrapperStyle={{fontSize: 12}} />
                                    <Bar yAxisId="left" dataKey="bookings" name="Bookings" fill="#4f46e5" radius={[4, 4, 0, 0]} />
                                    <Bar yAxisId="right" dataKey="revenue" name="Revenue" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Rating Trends and Booking Conversion */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Rating Trends */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Rating & Booking Trends</h3>
                        </div>
                        <div className="p-4">
                            <ResponsiveContainer width="100%" height={250}>
                                <LineChart data={ambassadorData.ratingTrends} margin={{ top: 5, right: 20, left: 20, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="name" tick={{fontSize: 12}} />
                                    <YAxis yAxisId="left" orientation="left" domain={[3.5, 5]} tick={{fontSize: 12}} />
                                    <YAxis yAxisId="right" orientation="right" tick={{fontSize: 12}} />
                                    <Tooltip
                                        contentStyle={{borderRadius: '8px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'}}
                                        formatter={(value, name) => [name === 'rating' ? value : value.toLocaleString(), name === 'rating' ? 'Avg. Rating' : 'Bookings']}
                                    />
                                    <Legend wrapperStyle={{fontSize: 12}} />
                                    <Line
                                        yAxisId="left"
                                        type="monotone"
                                        dataKey="rating"
                                        name="Avg. Rating"
                                        stroke="#10b981"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                    <Line
                                        yAxisId="right"
                                        type="monotone"
                                        dataKey="bookings"
                                        name="Bookings"
                                        stroke="#4f46e5"
                                        strokeWidth={3}
                                        dot={{ r: 4 }}
                                        activeDot={{ r: 6 }}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Booking Conversion */}
                    <div className="bg-white rounded-xl shadow-sm">
                        <div className="p-4 border-b border-gray-100">
                            <h3 className="text-lg font-semibold text-gray-900">Booking Conversion Funnel</h3>
                        </div>
                        <div className="p-4">
                            <div className="space-y-4">
                                <div>
                                    <div className="flex justify-between mb-1">
                                        <div className="text-sm font-medium">Profile Views</div>
                                        <div className="text-sm text-gray-500">{ambassadorData.bookingConversion.profileViews.toLocaleString()}</div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full">
                                        <div className="h-4 bg-indigo-600 rounded-full" style={{ width: '100%' }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <div className="text-sm font-medium">Inquiries</div>
                                        <div className="text-sm text-gray-500">
                                            {ambassadorData.bookingConversion.inquiries.toLocaleString()}
                                            <span className="text-xs ml-1 text-gray-400">
                        ({((ambassadorData.bookingConversion.inquiries / ambassadorData.bookingConversion.profileViews) * 100).toFixed(1)}%)
                      </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full">
                                        <div className="h-4 bg-indigo-500 rounded-full" style={{ width: `${(ambassadorData.bookingConversion.inquiries / ambassadorData.bookingConversion.profileViews) * 100}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <div className="text-sm font-medium">Booking Requests</div>
                                        <div className="text-sm text-gray-500">
                                            {ambassadorData.bookingConversion.bookingRequests.toLocaleString()}
                                            <span className="text-xs ml-1 text-gray-400">
                        ({((ambassadorData.bookingConversion.bookingRequests / ambassadorData.bookingConversion.profileViews) * 100).toFixed(1)}%)
                      </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full">
                                        <div className="h-4 bg-indigo-400 rounded-full" style={{ width: `${(ambassadorData.bookingConversion.bookingRequests / ambassadorData.bookingConversion.profileViews) * 100}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <div className="text-sm font-medium">Confirmed Bookings</div>
                                        <div className="text-sm text-gray-500">
                                            {ambassadorData.bookingConversion.confirmedBookings.toLocaleString()}
                                            <span className="text-xs ml-1 text-gray-400">
                        ({((ambassadorData.bookingConversion.confirmedBookings / ambassadorData.bookingConversion.profileViews) * 100).toFixed(1)}%)
                      </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full">
                                        <div className="h-4 bg-indigo-300 rounded-full" style={{ width: `${(ambassadorData.bookingConversion.confirmedBookings / ambassadorData.bookingConversion.profileViews) * 100}%` }}></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between mb-1">
                                        <div className="text-sm font-medium">Completed Tours</div>
                                        <div className="text-sm text-gray-500">
                                            {ambassadorData.bookingConversion.completedTours.toLocaleString()}
                                            <span className="text-xs ml-1 text-gray-400">
                        ({((ambassadorData.bookingConversion.completedTours / ambassadorData.bookingConversion.profileViews) * 100).toFixed(1)}%)
                      </span>
                                        </div>
                                    </div>
                                    <div className="w-full h-4 bg-gray-100 rounded-full">
                                        <div className="h-4 bg-indigo-200 rounded-full" style={{ width: `${(ambassadorData.bookingConversion.completedTours / ambassadorData.bookingConversion.profileViews) * 100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-xs text-gray-500">
                                <p>* Conversion rates shown as percentage of initial profile views</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Category Performance */}
                <div className="bg-white rounded-xl shadow-sm mb-6">
                    <div className="p-4 border-b border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900">Category Performance</h3>
                    </div>
                    <div className="p-4">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead>
                                <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    <th className="px-4 py-3">Catégorie</th>
                                    <th className="px-4 py-3">Réservations</th>
                                    <th className="px-4 py-3">Revenus</th>
                                    <th className="px-4 py-3">Ambassadeurs</th>
                                    <th className="px-4 py-3">Satisfaction</th>
                                </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200">
                                {ambassadorData.categoryPerformance.map((category, idx) => (
                                    <tr key={idx} className="hover:bg-gray-50">
                                        <td className="px-4 py-3">
                                            <div className="font-medium text-gray-900">{category.category}</div>
                                        </td>
                                        <td className="px-4 py-3 text-sm">{category.bookings.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm">€{category.revenue.toLocaleString()}</td>
                                        <td className="px-4 py-3 text-sm">{category.ambassadors}</td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center">
                                                <Star size={14} className="text-amber-500 mr-1" fill="#f59e0b" />
                                                <span className="text-sm">{category.satisfaction}</span>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
