import React, { useEffect, useState } from "react";
import { useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { ArrowLeft, Upload, X, RefreshCw } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useProducts } from "../../context/ProductContext";

const AddProduct = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addProduct, getProduct, updateProduct } = useProducts();
  const location = useLocation();
  const productId = location.state?.productId;
  const [searchParams] = useSearchParams();
  const isEditMode = searchParams.get("edit") === "true";

  const [originalData, setOriginalData] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    originalPrice: "",
    category: "",
    subcategory: "",
    brand: "",
    stock: "",
    images: [],
    specifications: {
      weight: "",
      dimensions: {
        length: "",
        width: "",
        height: "",
      },
      material: "",
      color: [],
      size: [],
    },
    tags: [],
    badge: "",
    status: "active",
  });

  const [tempColor, setTempColor] = useState("");
  const [tempSize, setTempSize] = useState("");
  const [tempTag, setTempTag] = useState("");
  const [errors, setErrors] = useState({});

  const categories = [
    "accessories",
    "women",
    "men",
    "home",
    "electronics",
    "beauty",
    "sports",
    "kids",
  ];

  const badges = [
    "Best Seller",
    "New Arrival",
    "Limited Edition",
    "Exclusive",
    "Trending",
    "Premium",
    "Sale",
  ];

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const data = await getProduct(productId);
        if (data?.product) {
          setOriginalData(data.product);
          setFormData({
            ...data.product,
            specifications: {
              weight: data.product.specifications?.weight || "",
              dimensions: {
                length: data.product.specifications?.dimensions?.length || "",
                width: data.product.specifications?.dimensions?.width || "",
                height: data.product.specifications?.dimensions?.height || "",
              },
              material: data.product.specifications?.material || "",
              color: data.product.specifications?.color || [],
              size: data.product.specifications?.size || [],
            },
            tags: data.product.tags || [],
            images:
              data.product.images?.map((img) => ({
                ...img,
                markedForDeletion: false,
              })) || [],
          });
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  const getChangedFields = () => {
    if (!originalData) return formData;

    const changes = {};
    const fieldsToCheck = [
      "name",
      "description",
      "price",
      "originalPrice",
      "category",
      "subcategory",
      "brand",
      "stock",
      "badge",
      "status",
    ];

    // Check simple fields
    fieldsToCheck.forEach((field) => {
      if (formData[field] !== originalData[field]) {
        changes[field] = formData[field];
      }
    });

    // Check specifications
    const specChanges = {};
    const specFields = ["weight", "material"];
    specFields.forEach((field) => {
      if (
        formData.specifications[field] !== originalData.specifications?.[field]
      ) {
        specChanges[field] = formData.specifications[field];
      }
    });

    // Check dimensions
    const dimChanges = {};
    const dimFields = ["length", "width", "height"];
    dimFields.forEach((field) => {
      if (
        formData.specifications.dimensions[field] !==
        originalData.specifications?.dimensions?.[field]
      ) {
        dimChanges[field] = formData.specifications.dimensions[field];
      }
    });

    if (Object.keys(dimChanges).length > 0) {
      specChanges.dimensions = dimChanges;
    }

    if (Object.keys(specChanges).length > 0) {
      changes.specifications = {
        ...originalData.specifications,
        ...specChanges,
      };
    }

    // Check colors
    if (
      JSON.stringify(formData.specifications.color) !==
      JSON.stringify(originalData.specifications?.color || [])
    ) {
      changes.specifications = {
        ...changes.specifications,
        color: formData.specifications.color,
      };
    }

    // Check sizes
    if (
      JSON.stringify(formData.specifications.size) !==
      JSON.stringify(originalData.specifications?.size || [])
    ) {
      changes.specifications = {
        ...changes.specifications,
        size: formData.specifications.size,
      };
    }

    // Check tags
    if (
      JSON.stringify(formData.tags) !== JSON.stringify(originalData.tags || [])
    ) {
      changes.tags = formData.tags;
    }

    return changes;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle nested fields
    if (name.startsWith("specifications.")) {
      const fieldPath = name.split(".");
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [fieldPath[1]]:
            fieldPath.length > 2
              ? {
                  ...prev.specifications[fieldPath[1]],
                  [fieldPath[2]]: value,
                }
              : value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      url: URL.createObjectURL(file),
      file,
      publicId: "",
      alt: `Product image ${formData.images.length + 1}`,
    }));

    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...newImages].slice(0, 5),
    }));
  };

  const toggleImageDeletion = (index) => {
    setFormData((prev) => {
      const newImages = [...prev.images];
      if (newImages[index].publicId) {
        // For existing images, mark for deletion
        newImages[index] = {
          ...newImages[index],
          markedForDeletion: !newImages[index].markedForDeletion,
        };
      } else {
        // For new images not yet uploaded, just remove
        newImages.splice(index, 1);
      }
      return { ...prev, images: newImages };
    });
  };

  const addColor = () => {
    if (tempColor && !formData.specifications.color.includes(tempColor)) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          color: [...prev.specifications.color, tempColor],
        },
      }));
      setTempColor("");
    }
  };

  const removeColor = (colorToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        color: prev.specifications.color.filter(
          (color) => color !== colorToRemove
        ),
      },
    }));
  };

  const addSize = () => {
    if (tempSize && !formData.specifications.size.includes(tempSize)) {
      setFormData((prev) => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          size: [...prev.specifications.size, tempSize],
        },
      }));
      setTempSize("");
    }
  };

  const removeSize = (sizeToRemove) => {
    setFormData((prev) => ({
      ...prev,
      specifications: {
        ...prev.specifications,
        size: prev.specifications.size.filter((size) => size !== sizeToRemove),
      },
    }));
  };

  const addTag = () => {
    if (tempTag && !formData.tags.includes(tempTag)) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tempTag],
      }));
      setTempTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.description.trim())
      newErrors.description = "Description is required";
    if (!formData.price || parseFloat(formData.price) <= 0)
      newErrors.price = "Valid price is required";
    if (!formData.category) newErrors.category = "Category is required";
    if (!formData.stock || parseInt(formData.stock) < 0)
      newErrors.stock = "Valid stock quantity is required";
    if (formData.images.filter((img) => !img.markedForDeletion).length === 0)
      newErrors.images = "At least one image is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const formDataToSend = new FormData();

    if (isEditMode) {
      // For editing mode
      formDataToSend.append("productId", productId);

      // Get all current data (or use getChangedFields() if you want to only send changed fields)
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", Number(formData.price));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", Number(formData.stock));
      formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append(
        "originalPrice",
        Number(formData.originalPrice || 0)
      );
      formDataToSend.append("brand", formData.brand || "");
      formDataToSend.append("badge", formData.badge || "");
      formDataToSend.append("status", formData.status || "active");

      // Handle specifications - ensure proper stringification
      const specsToSend = {
        weight: formData.specifications.weight,
        dimensions: {
          length: formData.specifications.dimensions.length,
          width: formData.specifications.dimensions.width,
          height: formData.specifications.dimensions.height,
        },
        material: formData.specifications.material,
        color: formData.specifications.color,
        size: formData.specifications.size,
      };
      formDataToSend.append("specifications", JSON.stringify(specsToSend));

      // Handle tags - ensure proper stringification
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      // Handle images
      const keptImages = formData.images.filter(
        (img) => img.url && !img.markedForDeletion && img.publicId
      );
      const newImages = formData.images.filter(
        (img) => (img.file || img instanceof File) && !img.markedForDeletion
      );
      const deletedImages = formData.images.filter(
        (img) => img.markedForDeletion && img.publicId
      );

      // Append kept images
      if (keptImages.length > 0) {
        formDataToSend.append("keptImages", JSON.stringify(keptImages));
      }

      // Append new images
      newImages.forEach((image) => {
        formDataToSend.append("images", image.file || image);
      });

      // Append deleted images
      if (deletedImages.length > 0) {
        formDataToSend.append("deletedImages", JSON.stringify(deletedImages));
      }

      try {
        await updateProduct(productId, formDataToSend);
        navigate("/vendor/dashboard");
      } catch (error) {
        console.error("Product update failed:", error);
      }
    } else {
      // For new product creation
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", Number(formData.price));
      formDataToSend.append("category", formData.category);
      formDataToSend.append("stock", Number(formData.stock));
      formDataToSend.append("subcategory", formData.subcategory);
      formDataToSend.append(
        "originalPrice",
        Number(formData.originalPrice || 0)
      );
      formDataToSend.append("brand", formData.brand || "");
      formDataToSend.append("badge", formData.badge || "");
      formDataToSend.append("vendor", user._id);
      formDataToSend.append(
        "vendorName",
        user.vendorInfo?.shopName || user.name
      );
      formDataToSend.append("status", formData.status || "active");

      // Handle specifications for new product
      const specsToSend = {
        weight: formData.specifications.weight,
        dimensions: {
          length: formData.specifications.dimensions.length,
          width: formData.specifications.dimensions.width,
          height: formData.specifications.dimensions.height,
        },
        material: formData.specifications.material,
        color: formData.specifications.color,
        size: formData.specifications.size,
      };
      formDataToSend.append("specifications", JSON.stringify(specsToSend));

      // Handle tags for new product
      formDataToSend.append("tags", JSON.stringify(formData.tags));

      // Append images for new product
      formData.images.forEach((image) => {
        if (image.file instanceof File || image instanceof File) {
          formDataToSend.append("images", image.file || image);
        }
      });

      try {
        await addProduct(formDataToSend);
        navigate("/vendor/dashboard");
      } catch (error) {
        console.error("Product creation failed:", error);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/vendor/dashboard")}
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">
            {isEditMode ? "Edit Product" : "Add New Product"}
          </h1>
          <p className="text-gray-600 mt-2">
            {isEditMode
              ? "Update your product details"
              : "Create a new product listing for your store"}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Basic Information Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Enter product name"
                  maxLength="100"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div className="md:col-span-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={4}
                  value={formData.description}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="Describe your product"
                  maxLength="2000"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="category"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.category ? "border-red-500" : "border-gray-300"
                  }`}
                >
                  <option value="">Select a category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="subcategory"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Subcategory
                </label>
                <input
                  type="text"
                  id="subcategory"
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter subcategory"
                />
              </div>

              <div>
                <label
                  htmlFor="brand"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Brand
                </label>
                <input
                  type="text"
                  id="brand"
                  name="brand"
                  value={formData.brand}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter brand name"
                />
              </div>

              <div>
                <label
                  htmlFor="stock"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  id="stock"
                  name="stock"
                  min="0"
                  value={formData.stock}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.stock ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                />
                {errors.stock && (
                  <p className="mt-1 text-sm text-red-600">{errors.stock}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="badge"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Badge
                </label>
                <select
                  id="badge"
                  name="badge"
                  value={formData.badge}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select a badge (optional)</option>
                  {badges.map((badge) => (
                    <option key={badge} value={badge}>
                      {badge}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">Pricing</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="price"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Price *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    min="0"
                    step="0.01"
                    value={formData.price}
                    onChange={handleChange}
                    className={`w-full pl-8 pr-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.price ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="0.00"
                  />
                </div>
                {errors.price && (
                  <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="originalPrice"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Original Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500">$</span>
                  <input
                    type="number"
                    id="originalPrice"
                    name="originalPrice"
                    min="0"
                    step="0.01"
                    value={formData.originalPrice}
                    onChange={handleChange}
                    className="w-full pl-8 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0.00"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  For showing discounts
                </p>
              </div>
            </div>
          </div>

          {/* Images Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Product Images
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images * (Max 5 images)
                </label>
                <div className="text-sm text-gray-600">
                  <label htmlFor="images" className="block cursor-pointer">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                      <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <div className="text-sm text-gray-600">
                        <span className="text-blue-600 hover:text-blue-700">
                          Click to upload
                        </span>{" "}
                        or drag and drop
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        PNG, JPG, GIF up to 10MB
                      </p>
                    </div>
                  </label>
                  <input
                    type="file"
                    id="images"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </div>
                {errors.images && (
                  <p className="mt-1 text-sm text-red-600">{errors.images}</p>
                )}
              </div>

              {formData.images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={image.url || image.secure_url}
                        alt={image.alt}
                        className={`w-full h-24 object-cover rounded-lg ${
                          image.markedForDeletion
                            ? "opacity-50 border-2 border-red-500"
                            : ""
                        }`}
                      />
                      <button
                        type="button"
                        onClick={() => toggleImageDeletion(index)}
                        className={`absolute -top-2 -right-2 rounded-full p-1 ${
                          image.markedForDeletion
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-red-500 hover:bg-red-600"
                        } text-white`}
                      >
                        {image.markedForDeletion ? (
                          <RefreshCw className="h-4 w-4" />
                        ) : (
                          <X className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Specifications Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Specifications
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  htmlFor="specifications.weight"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Weight (kg)
                </label>
                <input
                  type="number"
                  id="specifications.weight"
                  name="specifications.weight"
                  min="0"
                  step="0.01"
                  value={formData.specifications.weight}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <input
                      type="number"
                      name="specifications.dimensions.length"
                      min="0"
                      step="0.1"
                      value={formData.specifications.dimensions.length}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Length"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="specifications.dimensions.width"
                      min="0"
                      step="0.1"
                      value={formData.specifications.dimensions.width}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Width"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      name="specifications.dimensions.height"
                      min="0"
                      step="0.1"
                      value={formData.specifications.dimensions.height}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Height"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label
                  htmlFor="specifications.material"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Material
                </label>
                <input
                  type="text"
                  id="specifications.material"
                  name="specifications.material"
                  value={formData.specifications.material}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Cotton, Wood, Metal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Colors
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tempColor}
                    onChange={(e) => setTempColor(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add color"
                    onKeyPress={(e) => e.key === "Enter" && addColor()}
                  />
                  <button
                    type="button"
                    onClick={addColor}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {formData.specifications.color.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specifications.color.map((color, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                      >
                        {color}
                        <button
                          type="button"
                          onClick={() => removeColor(color)}
                          className="ml-1.5 inline-flex text-blue-400 hover:text-blue-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sizes
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={tempSize}
                    onChange={(e) => setTempSize(e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Add size"
                    onKeyPress={(e) => e.key === "Enter" && addSize()}
                  />
                  <button
                    type="button"
                    onClick={addSize}
                    className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
                {formData.specifications.size.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {formData.specifications.size.map((size, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
                      >
                        {size}
                        <button
                          type="button"
                          onClick={() => removeSize(size)}
                          className="ml-1.5 inline-flex text-green-400 hover:text-green-600"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tags Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Product Tags
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Add Tags
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={tempTag}
                  onChange={(e) => setTempTag(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add tag"
                  onKeyPress={(e) => e.key === "Enter" && addTag()}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="px-3 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
              {formData.tags.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1.5 inline-flex text-purple-400 hover:text-purple-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Status Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              Product Status
            </h2>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <div className="flex items-center space-x-4">
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="active"
                    checked={formData.status === "active"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Active</span>
                </label>
                <label className="inline-flex items-center">
                  <input
                    type="radio"
                    name="status"
                    value="inactive"
                    checked={formData.status === "inactive"}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-gray-700">Inactive</span>
                </label>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate("/vendor/dashboard")}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {isEditMode ? "Update Product" : "Add Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
