const API_BASE_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:4000/api";

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem("token");
  }

  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem("token", token);
    } else {
      localStorage.removeItem("token");
    }
  }

  getHeaders() {
    const headers = {
      "Content-Type": "application/json",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    return headers;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(),
      ...options,
    };

    try {
      const response = await fetch(url, config);

      let data;
      try {
        data = await response.json(); // ✅ Safely attempt JSON parse
      } catch (parseError) {
        data = null; // fallback if it's not JSON
      }

      // console.log("API Response:", {
      //   endpoint,
      //   status: response.status,
      //   ok: response.ok,
      //   data,
      // });

      if (!response.ok) {
        const error = new Error(data?.message || "Something went wrong");
        error.status = response.status;
        error.response = { data, status: response.status };
        throw error;
      }

      return data;
    } catch (error) {
      console.error("API Request Error:", {
        endpoint,
        error: error.message,
        status: error.status,
      });
      throw error;
    }
  }

  // Auth endpoints
  async register(userData) {
    console.log(userData);
    return this.request("/auth/register", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async login(credentials) {
    console.log(credentials);
    return this.request("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  }

  async logout() {
    return this.request("/auth/logout", {
      method: "POST",
    });
  }

  async getMe() {
    try {
      return await this.request("/auth/me");
    } catch (error) {
      // Only clear token for specific auth errors, not network errors
      if (error.status === 401 || error.status === 403) {
        console.log("Token invalid, clearing from ApiService");
        this.setToken(null);
      }
      throw error;
    }
  }

  async updateProfile(profileData) {
    return this.request("/auth/profile", {
      method: "PUT",
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData) {
    return this.request("/auth/change-password", {
      method: "PUT",
      body: JSON.stringify(passwordData),
    });
  }

  // Product endpoints
  async getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products?${queryString}`);
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async createProduct(productData) {
    // For FormData (file uploads), don't set Content-Type header
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/products`, {
      method: "POST",
      headers,
      body: productData, // FormData object
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || "Failed to create product");
      error.status = response.status;
      throw error;
    }

    return data;
  }

  async updateProduct(id, productData) {
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/products/${id}`, {
      method: "PUT",
      headers,
      body: productData, // FormData object
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || "Failed to update product");
      error.status = response.status;
      throw error;
    }

    return data;
  }

  async deleteProduct(id) {
    return this.request(`/products/${id}`, {
      method: "DELETE",
    });
  }

  async getVendorProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/vendor/my-products?${queryString}`);
  }

  async searchProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/products/search?${queryString}`);
  }

  // cart endpoints
  async getCartItems() {
    return this.request("/user/cart");
  }

  async addToCart(item) {
    return this.request(`/user/addtocart`, {
      method: "POST",
      body: JSON.stringify(item),
    });
  }

  //wishlist endpoints
  async getWishlistItems() {
    return this.request("/user/wishlist");
  }

  async addToWishlist(item) {
    return this.request(`/user/addtowishlist`, {
      method: "POST",
      body: JSON.stringify(item),
    });
  }
  async removeFromWishlist(id) {
    return this.request(`/user/wishlist/${id}`, {
      method: "DELETE",
    });
  }
  async clearWishlist() {
    return this.request("/user/wishlist/clear", {
      method: "DELETE",
    });
  }

  // Review endpoints
  async getProductReviews(productId) {
    return this.request(`/products/${productId}/reviews`);
  }

  async addProductReview(productId, reviewData) {
    return this.request(`/products/${productId}/reviews`, {
      method: "POST",
      body: JSON.stringify(reviewData),
    });
  }

  async updateReview(reviewId, reviewData) {
    return this.request(`/products/reviews/${reviewId}`, {
      method: "PUT",
      body: JSON.stringify(reviewData),
    });
  }

  async deleteReview(reviewId) {
    return this.request(`/products/reviews/${reviewId}`, {
      method: "DELETE",
    });
  }

  // Order endpoints
  async getOrders(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/orders?${queryString}`);
  }

  async getOrder(id) {
    return this.request(`/orders/${id}`);
  }

  async createOrder(orderData) {
    return this.request("/orders", {
      method: "POST",
      body: JSON.stringify(orderData),
    });
  }

  async updateOrderStatus(id, status) {
    return this.request(`/orders/${id}/status`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  }

  // Vendor endpoints
  async getVendors(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/vendors`);
  }

  async getVendorApplications() {
    return this.request("/vendors/applications");
  }

  async approveApplication(vendorId) {
    return this.request(`/vendors/${vendorId}/approve`, {
      method: "PUT",
    });
  }

  async rejectVendor(vendorId, reason) {
    return this.request(`/vendors/${vendorId}/reject`, {
      method: "PUT",
      body: JSON.stringify({ reason }),
    });
  }

  // Promotion endpoints
  async getPromotions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/promotions?${queryString}`);
  }

  async createPromotion(promotionData) {
    return this.request("/promotions", {
      method: "POST",
      body: JSON.stringify(promotionData),
    });
  }

  async updatePromotion(id, promotionData) {
    return this.request(`/promotions/${id}`, {
      method: "PUT",
      body: JSON.stringify(promotionData),
    });
  }

  async deletePromotion(id) {
    return this.request(`/promotions/${id}`, {
      method: "DELETE",
    });
  }

  async validateCoupon(code, orderValue) {
    return this.request("/promotions/validate", {
      method: "POST",
      body: JSON.stringify({ code, orderValue }),
    });
  }

  // Analytics endpoints
  async getAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics?${queryString}`);
  }

  async getVendorAnalytics(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/analytics/vendor?${queryString}`);
  }

  // Notification endpoints
  async getNotifications(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/notifications?${queryString}`);
  }

  async markNotificationAsRead(id) {
    return this.request(`/notifications/${id}/read`, {
      method: "PUT",
    });
  }

  async markAllNotificationsAsRead() {
    return this.request("/notifications/mark-all-read", {
      method: "PUT",
    });
  }

  // Social endpoints
  async getSocialPosts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/social/posts?${queryString}`);
  }

  async createSocialPost(postData) {
    const headers = {};
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseURL}/social/posts`, {
      method: "POST",
      headers,
      body: postData, // FormData object
    });

    const data = await response.json();
    if (!response.ok) {
      const error = new Error(data.message || "Failed to create post");
      error.status = response.status;
      throw error;
    }

    return data;
  }

  async likeSocialPost(postId) {
    return this.request(`/social/posts/${postId}/like`, {
      method: "POST",
    });
  }

  async commentOnSocialPost(postId, comment) {
    return this.request(`/social/posts/${postId}/comment`, {
      method: "POST",
      body: JSON.stringify({ text: comment }),
    });
  }

  async shareSocialPost(postId) {
    return this.request(`/social/posts/${postId}/share`, {
      method: "POST",
    });
  }
}

export default new ApiService();
