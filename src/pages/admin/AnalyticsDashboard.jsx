import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  DollarSign,
  Users,
  Package,
  ShoppingBag,
  Calendar,
  Download,
  RefreshCw,
  ArrowLeft,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAnalytics } from '../../context/AnalyticsContext';
import apiService from '../../services/api';

const AnalyticsDashboard = () => {
  const { analytics, getRevenueGrowth, getVisitorGrowth } = useAnalytics();
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [actionLoading, setActionLoading] = useState({});

  useEffect(() => {
    fetchAnalytics();
  }, [selectedTimeframe]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await apiService.adminGetAnalytics({ timeframe: selectedTimeframe });
      setAnalyticsData(response.analytics || analytics);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
      // Use context analytics as fallback
      setAnalyticsData(analytics);
    } finally {
      setLoading(false);
    }
  };

  const handleExportReport = async (reportType) => {
    try {
      setActionLoading(prev => ({ ...prev, [reportType]: 'exporting' }));
      
      let csvContent = '';
      let filename = '';

      switch (reportType) {
        case 'sales':
          csvContent = [
            ['Date', 'Sales', 'Revenue'].join(','),
            ...analyticsData.sales[selectedTimeframe].map((sale, index) => [
              `Day ${index + 1}`,
              sale,
              sale * 150 // Estimated revenue per sale
            ].join(','))
          ].join('\n');
          filename = `sales-report-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'visitors':
          csvContent = [
            ['Date', 'Visitors'].join(','),
            ...analyticsData.visitors[selectedTimeframe].map((visitors, index) => [
              `Day ${index + 1}`,
              visitors
            ].join(','))
          ].join('\n');
          filename = `visitors-report-${selectedTimeframe}-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        case 'products':
          csvContent = [
            ['Product', 'Sales', 'Revenue'].join(','),
            ...analyticsData.topProducts.map(product => [
              `"${product.name}"`,
              product.sales,
              product.revenue
            ].join(','))
          ].join('\n');
          filename = `top-products-${new Date().toISOString().split('T')[0]}.csv`;
          break;
        default:
          return;
      }

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export report:', error);
      alert('Failed to export report');
    } finally {
      setActionLoading(prev => ({ ...prev, [reportType]: null }));
    }
  };

  const currentData = analyticsData || analytics;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 mr-3">
                <ArrowLeft className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
                <p className="text-gray-600 mt-2">Comprehensive business insights and performance metrics</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <select
                value={selectedTimeframe}
                onChange={(e) => setSelectedTimeframe(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-2"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <button
                onClick={fetchAnalytics}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${currentData.sales[selectedTimeframe]?.slice(-1)[0] || 0}
                </p>
                <p className="text-sm text-green-600">+{getRevenueGrowth()}% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Visitors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {currentData.visitors[selectedTimeframe]?.slice(-1)[0] || 0}
                </p>
                <p className="text-sm text-blue-600">+{getVisitorGrowth()}% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <ShoppingBag className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Conversion Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.2%</p>
                <p className="text-sm text-purple-600">+0.5% from last period</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-orange-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Avg. Order Value</p>
                <p className="text-2xl font-bold text-gray-900">
                  ${currentData.customerMetrics?.averageOrderValue || 185.50}
                </p>
                <p className="text-sm text-orange-600">+12% from last period</p>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Sales Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-600" />
                Sales Analytics
              </h3>
              <button
                onClick={() => handleExportReport('sales')}
                disabled={actionLoading.sales}
                className="text-blue-600 hover:text-blue-700 flex items-center text-sm"
              >
                {actionLoading.sales ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Export
              </button>
            </div>
            <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <BarChart3 className="h-16 w-16 text-blue-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Sales Trend</p>
                <p className="text-sm text-gray-500">
                  Current: ${currentData.sales[selectedTimeframe]?.slice(-1)[0] || 0}
                </p>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {currentData.sales[selectedTimeframe]?.map((value, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 rounded-sm"
                      style={{ height: `${(value / Math.max(...currentData.sales[selectedTimeframe])) * 40}px` }}
                      title={`Day ${index + 1}: $${value}`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Visitor Analytics */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-600" />
                Visitor Analytics
              </h3>
              <button
                onClick={() => handleExportReport('visitors')}
                disabled={actionLoading.visitors}
                className="text-green-600 hover:text-green-700 flex items-center text-sm"
              >
                {actionLoading.visitors ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Export
              </button>
            </div>
            <div className="h-64 bg-gradient-to-br from-green-50 to-emerald-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Activity className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">Visitor Trend</p>
                <p className="text-sm text-gray-500">
                  Growth: +{getVisitorGrowth()}%
                </p>
                <div className="mt-4 grid grid-cols-7 gap-1">
                  {currentData.visitors[selectedTimeframe]?.map((value, index) => (
                    <div
                      key={index}
                      className="bg-green-500 rounded-sm"
                      style={{ height: `${(value / Math.max(...currentData.visitors[selectedTimeframe])) * 40}px` }}
                      title={`Day ${index + 1}: ${value} visitors`}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Products and Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Products */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <Package className="h-5 w-5 mr-2 text-purple-600" />
                Top Products
              </h3>
              <button
                onClick={() => handleExportReport('products')}
                disabled={actionLoading.products}
                className="text-purple-600 hover:text-purple-700 flex items-center text-sm"
              >
                {actionLoading.products ? (
                  <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-1" />
                )}
                Export
              </button>
            </div>
            <div className="space-y-4">
              {currentData.topProducts?.map((product, index) => (
                <div key={product.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <span className="text-sm font-bold text-purple-600">#{index + 1}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{product.name}</h4>
                      <p className="text-sm text-gray-500">{product.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600">${product.revenue}</p>
                    <p className="text-xs text-gray-500">Revenue</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Categories */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <PieChart className="h-5 w-5 mr-2 text-orange-600" />
                Top Categories
              </h3>
            </div>
            <div className="space-y-4">
              {currentData.topCategories?.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-4 h-4 rounded-full mr-3" style={{
                      backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 4]
                    }}></div>
                    <div>
                      <h4 className="font-medium text-gray-900">{category.name}</h4>
                      <p className="text-sm text-gray-500">{category.sales} sales</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">{category.percentage}%</p>
                    <div className="w-20 bg-gray-200 rounded-full h-2 mt-1">
                      <div 
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${category.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Customer Metrics */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-6 flex items-center">
            <Users className="h-5 w-5 mr-2 text-blue-600" />
            Customer Metrics
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {currentData.customerMetrics?.totalCustomers || 0}
              </div>
              <div className="text-sm text-gray-600">Total Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {currentData.customerMetrics?.newCustomers || 0}
              </div>
              <div className="text-sm text-gray-600">New Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {currentData.customerMetrics?.returningCustomers || 0}
              </div>
              <div className="text-sm text-gray-600">Returning Customers</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                ${currentData.customerMetrics?.averageOrderValue || 0}
              </div>
              <div className="text-sm text-gray-600">Avg. Order Value</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                ${currentData.customerMetrics?.customerLifetimeValue || 0}
              </div>
              <div className="text-sm text-gray-600">Customer LTV</div>
            </div>
          </div>
        </div>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Revenue Insights */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <TrendingUp className="h-5 w-5 mr-2 text-green-600" />
              Revenue Insights
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">This Month</span>
                <span className="font-bold text-green-600">
                  ${currentData.sales.monthly?.slice(-1)[0] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Last Month</span>
                <span className="font-bold text-gray-900">
                  ${currentData.sales.monthly?.slice(-2, -1)[0] || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Growth Rate</span>
                <span className="font-bold text-green-600">+{getRevenueGrowth()}%</span>
              </div>
              <div className="pt-4 border-t">
                <div className="text-sm text-gray-500 mb-2">Revenue Trend</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-600 h-2 rounded-full"
                    style={{ width: `${Math.min(parseFloat(getRevenueGrowth()), 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <Activity className="h-5 w-5 mr-2 text-blue-600" />
              Traffic Sources
            </h3>
            <div className="space-y-4">
              {[
                { source: 'Direct', percentage: 45, color: 'bg-blue-500' },
                { source: 'Search Engines', percentage: 30, color: 'bg-green-500' },
                { source: 'Social Media', percentage: 15, color: 'bg-purple-500' },
                { source: 'Referrals', percentage: 10, color: 'bg-orange-500' }
              ].map((item, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-3 ${item.color}`}></div>
                    <span className="text-gray-700">{item.source}</span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium text-gray-900 mr-2">{item.percentage}%</span>
                    <div className="w-16 bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Reports</h3>
            <div className="space-y-3">
              <button
                onClick={() => handleExportReport('sales')}
                disabled={actionLoading.sales}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center">
                  <DollarSign className="h-5 w-5 text-green-600 mr-3" />
                  <span>Sales Report</span>
                </div>
                {actionLoading.sales ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleExportReport('visitors')}
                disabled={actionLoading.visitors}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 mr-3" />
                  <span>Visitor Report</span>
                </div>
                {actionLoading.visitors ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>

              <button
                onClick={() => handleExportReport('products')}
                disabled={actionLoading.products}
                className="w-full flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <div className="flex items-center">
                  <Package className="h-5 w-5 text-purple-600 mr-3" />
                  <span>Product Report</span>
                </div>
                {actionLoading.products ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Download className="h-4 w-4" />
                )}
              </button>

              <Link
                to="/admin/dashboard"
                className="w-full flex items-center justify-center p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Detailed Analytics Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Detailed Analytics</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Metric
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Previous Period
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Change
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Trend
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Revenue
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${currentData.sales[selectedTimeframe]?.slice(-1)[0] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${currentData.sales[selectedTimeframe]?.slice(-2, -1)[0] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +{getRevenueGrowth()}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Visitors
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currentData.visitors[selectedTimeframe]?.slice(-1)[0] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {currentData.visitors[selectedTimeframe]?.slice(-2, -1)[0] || 0}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">
                    +{getVisitorGrowth()}%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    Conversion Rate
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    3.2%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    2.7%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">
                    +0.5%
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;