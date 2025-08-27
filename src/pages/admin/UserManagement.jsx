import React, { useState, useEffect } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Ban,
  CheckCircle,
  Mail,
  Calendar,
  Activity,
  UserX,
  UserCheck,
  Edit,
  Trash2,
  Eye,
  Shield,
  Store,
  X,
  ArrowLeft,
  Download,
  RefreshCw,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import apiService from "../../services/api";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUserDetails, setShowUserDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      // Filter out admin users for security
      const filteredUsers = response.users.filter(user => user.role !== "admin");
      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = filterRole === "all" || user.role === filterRole;

    // Normalize status from boolean to string for comparison
    const userStatus = user.isActive === true ? "active" : "suspended";
    const matchesStatus = filterStatus === "all" || filterStatus === userStatus;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleUserAction = async (userId, action) => {
    try {
      setActionLoading(prev => ({ ...prev, [userId]: action }));
      
      if (action === "activate") {
        await apiService.adminActivateUser(userId);
      } else if (action === "suspend") {
        await apiService.adminSuspendUser(userId);
      } else if (action === "delete") {
        if (window.confirm("Are you sure you want to delete this user?")) {
          await apiService.adminDeleteUser(userId);
        } else {
          return;
        }
      }
      
      // Refresh users list
      await fetchUsers();
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
      alert(`Failed to ${action} user`);
    } finally {
      setActionLoading(prev => ({ ...prev, [userId]: null }));
    }
  };

  const handleBulkAction = async (action) => {
    if (selectedUsers.length === 0) return;
    
    try {
      setActionLoading(prev => ({ ...prev, bulk: action }));
      
      if (action === "delete") {
        if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) {
          return;
        }
      }

      await Promise.all(
        selectedUsers.map(userId => {
          if (action === "activate") return apiService.adminActivateUser(userId);
          if (action === "suspend") return apiService.adminSuspendUser(userId);
          if (action === "delete") return apiService.adminDeleteUser(userId);
        })
      );
      
      await fetchUsers();
      setSelectedUsers([]);
    } catch (error) {
      console.error(`Failed to ${action} users:`, error);
      alert(`Failed to ${action} some users`);
    } finally {
      setActionLoading(prev => ({ ...prev, bulk: null }));
    }
  };

  const handleExportUsers = async () => {
    try {
      setActionLoading(prev => ({ ...prev, export: 'exporting' }));
      
      const csvContent = [
        ['Name', 'Email', 'Role', 'Status', 'Join Date', 'Last Active'].join(','),
        ...filteredUsers.map(user => [
          `"${user.name}"`,
          user.email,
          user.role,
          user.isActive ? 'Active' : 'Suspended',
          new Date(user.createdAt || Date.now()).toLocaleDateString(),
          new Date(user.lastActive || user.updatedAt || Date.now()).toLocaleDateString()
        ].join(','))
      ].join('\n');

      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `users-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to export users:', error);
      alert('Failed to export users');
    } finally {
      setActionLoading(prev => ({ ...prev, export: null }));
    }
  };

  const toggleUserSelection = (userId) => {
    setSelectedUsers((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId]
    );
  };

  const selectAllUsers = () => {
    if (selectedUsers.length === paginatedUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(paginatedUsers.map(u => u._id));
    }
  };

  const getStatusBadge = (isActive) => {
    const config = isActive
      ? { bg: "bg-green-100", text: "text-green-800", label: "Active" }
      : { bg: "bg-red-100", text: "text-red-800", label: "Suspended" };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const getRoleBadge = (role) => {
    const config = {
      vendor: { bg: "bg-blue-100", text: "text-blue-800", label: "Vendor", icon: Store },
      customer: { bg: "bg-gray-100", text: "text-gray-800", label: "Customer", icon: Users },
    };

    const roleConfig = config[role] || config.customer;
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full ${roleConfig.bg} ${roleConfig.text}`}>
        <roleConfig.icon className="h-3 w-3 mr-1" />
        {roleConfig.label}
      </span>
    );
  };

  const getJoinDate = (user) => {
    return new Date(user.createdAt || Date.now()).toLocaleDateString();
  };

  const getLastActive = (user) => {
    return new Date(user.lastActive || user.updatedAt || Date.now()).toLocaleDateString();
  };

  // Calculate stats
  const activeUsers = users.filter(u => u.isActive === true).length;
  const suspendedUsers = users.filter(u => u.isActive === false).length;
  const today = new Date();
  const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const newUsersThisMonth = users.filter(user => {
    const joinDate = new Date(user.createdAt);
    return joinDate >= startOfMonth;
  }).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center mb-2">
            <Link to="/admin/dashboard" className="text-blue-600 hover:text-blue-700 mr-3">
              <ArrowLeft className="h-5 w-5" />
            </Link>
            <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          </div>
          <p className="text-gray-600">Manage users, vendors, and their activities</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">{users.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserCheck className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{activeUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <UserX className="h-8 w-8 text-red-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Suspended</p>
                <p className="text-2xl font-bold text-gray-900">{suspendedUsers}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-purple-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">New This Month</p>
                <p className="text-2xl font-bold text-gray-900">{newUsersThisMonth}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex flex-1 items-center space-x-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <select
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Roles</option>
                <option value="customer">Customers</option>
                <option value="vendor">Vendors</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>

              <button
                onClick={handleExportUsers}
                disabled={actionLoading.export}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
              >
                {actionLoading.export ? (
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Download className="h-4 w-4 mr-2" />
                )}
                Export
              </button>
            </div>

            {selectedUsers.length > 0 && (
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">
                  {selectedUsers.length} selected
                </span>
                <button
                  onClick={() => handleBulkAction("activate")}
                  disabled={actionLoading.bulk}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  {actionLoading.bulk === 'activate' ? 'Activating...' : 'Activate'}
                </button>
                <button
                  onClick={() => handleBulkAction("suspend")}
                  disabled={actionLoading.bulk}
                  className="bg-yellow-600 text-white px-3 py-1 rounded text-sm hover:bg-yellow-700 disabled:opacity-50"
                >
                  {actionLoading.bulk === 'suspend' ? 'Suspending...' : 'Suspend'}
                </button>
                <button
                  onClick={() => handleBulkAction("delete")}
                  disabled={actionLoading.bulk}
                  className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  {actionLoading.bulk === 'delete' ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input
                      type="checkbox"
                      checked={selectedUsers.length === paginatedUsers.length && paginatedUsers.length > 0}
                      onChange={selectAllUsers}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Join Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Last Active
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user._id)}
                        onChange={() => toggleUserSelection(user._id)}
                        className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={user.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"}
                          alt={user.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {user.email}
                          </div>
                          {user.role === 'vendor' && user.vendorInfo?.shopName && (
                            <div className="text-xs text-blue-600">
                              Shop: {user.vendorInfo.shopName}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(user.isActive)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {getJoinDate(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {getLastActive(user)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedUser(user);
                            setShowUserDetails(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Details"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUserAction(user._id, user.isActive ? "suspend" : "activate")}
                          disabled={actionLoading[user._id]}
                          className={`${user.isActive ? "text-yellow-600 hover:text-yellow-900" : "text-green-600 hover:text-green-900"} disabled:opacity-50`}
                          title={user.isActive ? "Suspend User" : "Activate User"}
                        >
                          {actionLoading[user._id] ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : user.isActive ? (
                            <Ban className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </button>
                        <button
                          onClick={() => handleUserAction(user._id, "delete")}
                          disabled={actionLoading[user._id]}
                          className="text-red-600 hover:text-red-900 disabled:opacity-50"
                          title="Delete User"
                        >
                          {actionLoading[user._id] === 'delete' ? (
                            <RefreshCw className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center items-center space-x-4 mt-8">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            
            <div className="flex space-x-2">
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = i + 1;
                } else if (currentPage <= 3) {
                  pageNumber = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + i;
                } else {
                  pageNumber = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNumber}
                    onClick={() => setCurrentPage(pageNumber)}
                    className={`px-3 py-2 rounded-md ${
                      currentPage === pageNumber
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNumber}
                  </button>
                );
              })}
            </div>

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}

        {filteredUsers.length === 0 && !loading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No users found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
          </div>
        )}

        {/* User Details Modal */}
        {showUserDetails && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">User Details</h2>
                <button
                  onClick={() => setShowUserDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="flex items-center space-x-4">
                  <img
                    src={selectedUser.avatar || "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150"}
                    alt={selectedUser.name}
                    className="h-20 w-20 rounded-full object-cover"
                  />
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">{selectedUser.name}</h3>
                    <p className="text-gray-600">{selectedUser.email}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      {getRoleBadge(selectedUser.role)}
                      {getStatusBadge(selectedUser.isActive)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Account Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">User ID:</span>
                        <span className="font-mono">{selectedUser._id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Join Date:</span>
                        <span>{getJoinDate(selectedUser)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Last Active:</span>
                        <span>{getLastActive(selectedUser)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Email Verified:</span>
                        <span className={selectedUser.emailVerified ? "text-green-600" : "text-red-600"}>
                          {selectedUser.emailVerified ? "Yes" : "No"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {selectedUser.role === 'vendor' && selectedUser.vendorInfo && (
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Vendor Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Shop Name:</span>
                          <span>{selectedUser.vendorInfo.shopName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Business Type:</span>
                          <span>{selectedUser.vendorInfo.businessType}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Vendor Status:</span>
                          <span className={`px-2 py-1 text-xs rounded ${
                            selectedUser.vendorInfo.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {selectedUser.vendorInfo.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleUserAction(selectedUser._id, selectedUser.isActive ? "suspend" : "activate")}
                    disabled={actionLoading[selectedUser._id]}
                    className={`px-4 py-2 rounded-lg font-medium flex items-center disabled:opacity-50 ${
                      selectedUser.isActive 
                        ? "bg-yellow-600 text-white hover:bg-yellow-700" 
                        : "bg-green-600 text-white hover:bg-green-700"
                    }`}
                  >
                    {actionLoading[selectedUser._id] ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : selectedUser.isActive ? (
                      <Ban className="h-4 w-4 mr-2" />
                    ) : (
                      <CheckCircle className="h-4 w-4 mr-2" />
                    )}
                    {selectedUser.isActive ? "Suspend User" : "Activate User"}
                  </button>
                  <button
                    onClick={() => handleUserAction(selectedUser._id, "delete")}
                    disabled={actionLoading[selectedUser._id]}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center disabled:opacity-50"
                  >
                    {actionLoading[selectedUser._id] === 'delete' ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Delete User
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;