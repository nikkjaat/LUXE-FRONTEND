import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Star,
  Heart,
  ShoppingCart,
  Share2,
  Truck,
  Shield,
  RotateCcw,
  Sparkles,
} from "lucide-react";
import { useProducts } from "../context/ProductContext";
import { useCart } from "../context/CartContext";
import { useWishlist } from "../context/WishlistContext";
import ProductReviews from "../components/ProductReviews";
import ComparisonTool from "../components/ComparisonTool";
import ARTryOn from "../components/ARTryOn";

const ProductDetailPage = () => {
  const { id } = useParams();
  const { products, getProduct } = useProducts();
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const [selectedImage, setSelectedImage] = useState(0);
  const [product, setProduct] = useState();
  const [quantity, setQuantity] = useState(1);
  const [showComparison, setShowComparison] = useState(false);
  const [showAR, setShowAR] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 450);
    };

    // Set initial value
    checkScreenSize();

    // Add event listener
    window.addEventListener("resize", checkScreenSize);

    // Cleanup
    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productData = await getProduct(id);
        setProduct(productData.product);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, []);

  useEffect(() => {
    const foundProduct = products.find((p) => p._id === id);
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [products, id]);

  const relatedProducts = products
    .filter((p) => p.category === product?.category && p._id !== id)
    .slice(0, 4);

  // Auto-scroll images effect
  useEffect(() => {
    if (!product?.images || product.images.length <= 1 || !autoScroll) return;

    const interval = setInterval(() => {
      setSelectedImage((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product?.images, autoScroll]);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Product not found
          </h2>
          <Link to="/shop" className="text-blue-600 hover:text-blue-700">
            Return to shop
          </Link>
        </div>
      </div>
    );
  }

  // Ensure rating is properly formatted
  const rating =
    typeof product.rating === "object"
      ? product.rating.average
      : product.rating;
  const reviewsCount =
    typeof product.rating === "object" ? product.rating.count : product.reviews;

  const isARCompatible = ["accessories", "jewelry", "watches"].includes(
    product.category
  );

  const handleAddToCart = () => {
    addToCart({
      id: product._id,
      name: product.name,
      price: product.price,
      image: product.images[0].url,
      quantity,
    });
  };

  const handleWishlistToggle = () => {
    if (isInWishlist(id)) {
      removeFromWishlist(product._id);
    } else {
      addToWishlist(product);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link
            to="/shop"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 mb-4"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Shop
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div
              className="aspect-square bg-white rounded-lg overflow-hidden relative"
              onMouseEnter={() => setAutoScroll(false)}
              onMouseLeave={() => setAutoScroll(true)}
            >
              <img
                src={product.images[selectedImage].url}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {/* Image indicators */}
              {product.images.length > 1 && (
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {product.images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`h-2 w-2 rounded-full ${
                        selectedImage === index ? "bg-blue-600" : "bg-gray-300"
                      }`}
                      aria-label={`Go to image ${index + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Thumbnail scrollbar */}
            {/* {product.images.length > 1 && (
              <div className="relative">
                <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSelectedImage(index);
                        setAutoScroll(false);
                        setTimeout(() => setAutoScroll(true), 5000);
                      }}
                      className={`flex-shrink-0 aspect-square bg-white rounded-lg overflow-hidden border-2 ${
                        selectedImage === index
                          ? "border-blue-500"
                          : "border-gray-200"
                      }`}
                    >
                      <img
                        src={image.url}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )} */}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                {product.badge && (
                  <span className="px-2 py-1 bg-orange-100 text-orange-800 text-sm font-medium rounded">
                    {product.badge}
                  </span>
                )}
                <span className="text-sm text-gray-500">
                  {product.vendorName && `by ${product.vendorName}`}
                </span>
              </div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                {product.name}
              </h1>

              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(rating)
                          ? "text-yellow-400 fill-current"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating.toFixed(1)} ({reviewsCount} reviews)
                  </span>
                </div>
              </div>

              <div className="flex items-center space-x-4 mb-6">
                <span className="text-3xl font-bold text-blue-600">
                  ${product.price}
                </span>
                {product.originalPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${product.originalPrice}
                    </span>
                    <span className="px-2 py-1 bg-red-100 text-red-800 text-sm font-medium rounded">
                      Save ${(product.originalPrice - product.price).toFixed(2)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold mb-4">
                Product Description
              </h3>
              <p className="text-gray-700 leading-relaxed">
                {product.description ||
                  "Experience luxury and sophistication with this premium product. Crafted with the finest materials and attention to detail, this item represents the perfect blend of style and functionality."}
              </p>
            </div>

            {/* AR Try-On Button */}
            {isARCompatible && (
              <div className="border-t border-gray-200 pt-6">
                <div className="mb-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <div className="flex items-center mb-2">
                    <Sparkles className="h-5 w-5 text-purple-600 mr-2" />
                    <span className="font-semibold text-purple-900">
                      AR Try-On Available
                    </span>
                  </div>
                  <p className="text-sm text-purple-700">
                    See how this {product.category} looks on you using augmented
                    reality
                  </p>
                </div>
                <button
                  onClick={() => setShowAR(!showAR)}
                  className={`w-full py-3 px-6 rounded-lg transition-all flex items-center justify-center mb-4 ${
                    showAR
                      ? "bg-gray-600 hover:bg-gray-700 text-white"
                      : "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                  }`}
                >
                  <Sparkles className="h-5 w-5 mr-2" />
                  {showAR ? "Close AR Try-On" : "Try with AR"}
                </button>
              </div>
            )}

            {/* Quantity and Actions */}
            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border border-gray-300 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-4 py-2 border-x border-gray-300">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="px-3 py-2 text-gray-600 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>
                <span className="text-sm text-gray-500">
                  {product.stock} items available
                </span>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5" />
                  {!isSmallScreen && <span className="ml-2">Add to Cart</span>}
                </button>
                <button
                  onClick={handleWishlistToggle}
                  className={`px-6 py-3 rounded-lg border-2 transition-colors flex items-center justify-center ${
                    isInWishlist(product._id)
                      ? "border-pink-500 bg-pink-50 text-pink-600"
                      : "border-gray-300 text-gray-600 hover:border-gray-400"
                  }`}
                >
                  <Heart
                    className={`h-5 w-5 ${
                      isInWishlist(product._id) ? "fill-current" : ""
                    }`}
                  />
                </button>
                <button className="px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-colors">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>

              <button
                onClick={() => setShowComparison(true)}
                className="w-full bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Compare with Similar Products
              </button>
            </div>

            {/* Features */}
            <div className="border-t border-gray-200 pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Truck className="h-6 w-6 text-green-500" />
                  <div>
                    <p className="font-medium text-gray-900">Free Shipping</p>
                    <p className="text-sm text-gray-500">On orders over $100</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Shield className="h-6 w-6 text-blue-500" />
                  <div>
                    <p className="font-medium text-gray-900">Secure Payment</p>
                    <p className="text-sm text-gray-500">SSL encrypted</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-6 w-6 text-purple-500" />
                  <div>
                    <p className="font-medium text-gray-900">Easy Returns</p>
                    <p className="text-sm text-gray-500">30-day policy</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AR Try-On Section */}
        {showAR && isARCompatible && (
          <div className="mb-12">
            <ARTryOn product={product} />
          </div>
        )}

        {/* Reviews Section */}
        <ProductReviews productId={product._id} />

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">
              Related Products
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((relatedProduct) => (
                <Link
                  key={relatedProduct._id}
                  to={`/product/${relatedProduct._id}`}
                  className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <img
                    src={relatedProduct.images[0].url}
                    alt={relatedProduct.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <div className="flex items-center justify-between">
                      <span className="text-lg font-bold text-blue-600">
                        ${relatedProduct.price}
                      </span>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {typeof relatedProduct.rating === "object"
                            ? relatedProduct.rating.average.toFixed(1)
                            : relatedProduct.rating}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Comparison Tool */}
        {showComparison && (
          <ComparisonTool
            products={[product, ...relatedProducts]}
            onClose={() => setShowComparison(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
