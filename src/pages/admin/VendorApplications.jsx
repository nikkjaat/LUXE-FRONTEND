import React, { useEffect, useState } from "react";
import { 
  Check, 
  X, 
  Eye, 
  Download, 
  Clock, 
  User, 
  Store, 
  Mail, 
  Calendar,
  ArrowLeft,
  RefreshCw,
  Building,
  Phone,
  MapPin
} from "lucide-react";
import { Link } from "react-router-dom";
import { useVendors } from "../../context/VendorContext";
import apiService from "../../services/api";

const VendorApplications = () => {
  const { getVendorApplications } = useVendors();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [actionLoading, setActionLoading] = useState({});
  const [filterStatus, setFilterStatus] = useState('pending');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await apiService.getAllUsers();
      // Filter vendor users with pending status
      const vendorApplications = response.users.filter(user => 
        user.role === "vendor" && user.vendorInfo?.status === "pending"
      );
      setApplications(vendorApplications);
    } catch (error) {
      console.error("Error fetching applications:", error);
      setApplications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      setActionLoading(prev => ({ ...prev, [applicationId]: 'approving' }));
      await apiService.adminApproveVendor(applicationId);
      await fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Failed to approve application:", error);
      alert("Failed to approve application");
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: null }));
    }
  };

  const handleReject = async (applicationId) => {
    const reason = prompt("Please provide a reason for rejection:");
    if (!reason) return;

    try {
      setActionLoading(prev => ({ ...prev, [applicationId]: 'rejecting' }));
      await apiService.adminRejectVendor(applicationId, reason);
      await fetchApplications(); // Refresh the list
    } catch (error) {
      console.error("Failed to reject application:", error);
      alert("Failed to reject application");
    } finally {
      setActionLoading(prev => ({ ...prev, [applicationId]: null }));
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      pending: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Pending Review" },
      approved: { bg: "bg-green-100", text: "text-green-800", label: "Approved" },
      rejected: { bg: "bg-red-100", text: "text-red-800", label: "Rejected" }
    };
    const statusConfig = config[status] || config.pending;
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${statusConfig.bg} ${statusConfig.text}`}>
        {statusConfig.label}
      </span>
    );
  };

  const getBusinessTypeIcon = (businessType) => {
    const icons = {
      'Fashion & Accessories': Store,
      'Electronics & Gadgets': Building,
      'Home & Living': Building,
      'Beauty & Cosmetics': Store,
      'Sports & Fitness': Building,
      'Books & Media': Building,
      'Toys & Games': Store,
      'Food & Beverages': Building,
      'Health & Wellness': Store,
      'Art & Crafts': Building
    };
    return icons[businessType] || Store;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading vendor applications...</p>
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
            <h1 className="text-3xl font-bold text-gray-900">Vendor Applications</h1>
          </div>
          <p className="text-gray-600">Review and manage vendor applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Pending Applications</p>
                <p className="text-2xl font-bold text-gray-900">{applications.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Check className="h-8 w-8 text-green-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Approved Today</p>
                <p className="text-2xl font-bold text-gray-900">0</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Store className="h-8 w-8 text-blue-600" />
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-600">Processing Time</p>
                <p className="text-2xl font-bold text-gray-900">2-3 days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">
              Pending Applications ({applications.length})
            </h3>
          </div>

          {applications.length === 0 ? (
            <div className="p-12 text-center">
              <Store className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No pending applications</h3>
              <p className="text-gray-500">All vendor applications have been processed.</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {applications.map((application) => {
                const BusinessIcon = getBusinessTypeIcon(application.vendorInfo?.businessType);
                
                return (
                  <div key={application._id} className="p-6 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center mb-3">
                          <div className="flex items-center">
                            <BusinessIcon className="h-5 w-5 text-blue-600 mr-2" />
                            <h4 className="text-lg font-medium text-gray-900">
                              {application.vendorInfo?.shopName || "Shop Name Not Provided"}
                            </h4>
                          </div>
                          {getStatusBadge(application.vendorInfo?.status || "pending")}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">Owner: {application.name}</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">Email: {application.email}</p>
                            </div>
                          </div>

                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-4 w-4 mr-2" />
                            <div>
                              <p className="font-medium">
                                Applied: {new Date(application.createdAt || Date.now()).toLocaleDateString()}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Business Type:</span>{" "}
                              {application.vendorInfo?.businessType || "Not specified"}
                            </p>
                          </div>
                          <div>
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Application ID:</span>{" "}
                              <span className="font-mono text-xs">{application._id}</span>
                            </p>
                          </div>
                        </div>

                        {application.vendorInfo?.description && (
                          <div className="mt-4">
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Description:</span>{" "}
                              {application.vendorInfo.description}
                            </p>
                          </div>
                        )}

                        {application.documents && application.documents.length > 0 && (
                          <div className="mt-4">
                            <p className="text-sm font-medium text-gray-900 mb-2">Documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {application.documents.map((doc, index) => (
                                <button
                                  key={index}
                                  className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50"
                                >
                                  <Download className="h-4 w-4 mr-1" />
                                  {doc}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      <div className="ml-6 flex flex-col space-y-3">
                        <button
                          onClick={() => handleApprove(application._id)}
                          disabled={actionLoading[application._id]}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[application._id] === 'approving' ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Check className="h-4 w-4 mr-2" />
                          )}
                          Approve
                        </button>
                        
                        <button
                          onClick={() => handleReject(application._id)}
                          disabled={actionLoading[application._id]}
                          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 transition-colors disabled:opacity-50"
                        >
                          {actionLoading[application._id] === 'rejecting' ? (
                            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <X className="h-4 w-4 mr-2" />
                          )}
                          Reject
                        </button>
                        
                        <button 
                          onClick={() => {
                            setSelectedApplication(application);
                            setShowDetails(true);
                          }}
                          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Application Details Modal */}
        {showDetails && selectedApplication && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
              <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Application Details</h2>
                <button
                  onClick={() => setShowDetails(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="text-center">
                  <Store className="h-16 w-16 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-gray-900">
                    {selectedApplication.vendorInfo?.shopName}
                  </h3>
                  <p className="text-gray-600">{selectedApplication.vendorInfo?.businessType}</p>
                  {getStatusBadge(selectedApplication.vendorInfo?.status || "pending")}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <User className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Full Name</span>
                          <p className="font-medium">{selectedApplication.name}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Email</span>
                          <p className="font-medium">{selectedApplication.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Phone</span>
                          <p className="font-medium">{selectedApplication.phone || "Not provided"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Business Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center">
                        <Store className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Shop Name</span>
                          <p className="font-medium">{selectedApplication.vendorInfo?.shopName}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Building className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Business Type</span>
                          <p className="font-medium">{selectedApplication.vendorInfo?.businessType}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 text-gray-400 mr-3" />
                        <div>
                          <span className="text-sm text-gray-500">Application Date</span>
                          <p className="font-medium">{new Date(selectedApplication.createdAt).toLocaleDateString()}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {selectedApplication.vendorInfo?.description && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Business Description</h4>
                    <p className="text-gray-700 bg-gray-50 p-4 rounded-lg">
                      {selectedApplication.vendorInfo.description}
                    </p>
                  </div>
                )}

                {selectedApplication.vendorInfo?.address && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Business Address</h4>
                    <div className="flex items-start">
                      <MapPin className="h-4 w-4 text-gray-400 mr-3 mt-1" />
                      <p className="text-gray-700">{selectedApplication.vendorInfo.address}</p>
                    </div>
                  </div>
                )}

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Review Checklist</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Business information provided</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Valid email address</span>
                    </div>
                    <div className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span>Business type specified</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end space-x-4">
                  <button
                    onClick={() => handleReject(selectedApplication._id)}
                    disabled={actionLoading[selectedApplication._id]}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {actionLoading[selectedApplication._id] === 'rejecting' ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <X className="h-4 w-4 mr-2" />
                    )}
                    Reject
                  </button>
                  <button
                    onClick={() => handleApprove(selectedApplication._id)}
                    disabled={actionLoading[selectedApplication._id]}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center disabled:opacity-50"
                  >
                    {actionLoading[selectedApplication._id] === 'approving' ? (
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4 mr-2" />
                    )}
                    Approve
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

export default VendorApplications;