import React, { useState, useRef, useEffect } from "react";
import {
  Camera,
  RotateCcw,
  Download,
  Share2,
  Sparkles,
  AlertCircle,
} from "lucide-react";
import PropTypes from "prop-types";

// Mock AR context since the original was missing
const useAR = () => {
  return {
    startARSession: (productId, mode) => Promise.resolve(),
    endARSession: () => {},
    captureARPhoto: (productId) => ({
      image:
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkeT0iLjM1ZW0iIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZvbnQtc2l6ZT0iMjAiIGZvbnQtZmFtaWx5PSJtb25vc3BhY2UiPkFSIENhcHR1cmU8L3RleHQ+PC9zdmc+",
    }),
    arSupported: true,
  };
};

const ARTryOn = ({ product }) => {
  const { startARSession, endARSession, captureARPhoto, arSupported } = useAR();
  const [isARActive, setIsARActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        const tracks = streamRef.current.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, []);

  const handleStartAR = async () => {
    if (!arSupported) {
      setError("AR is not supported on this device");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
      });

      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Initialize AR session
      await startARSession(product.id, "try-on");
      setIsARActive(true);
    } catch (err) {
      console.error("Failed to start AR session:", err);
      setError("Failed to access camera. Please check permissions.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndAR = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    endARSession();
    setIsARActive(false);
    setCapturedPhoto(null);
    setError(null);
  };

  const handleCapture = () => {
    try {
      const photo = captureARPhoto(product.id);
      setCapturedPhoto(photo);
    } catch (err) {
      console.error("Failed to capture photo:", err);
      setError("Failed to capture image");
    }
  };

  const handleDownload = () => {
    if (!capturedPhoto) return;

    try {
      const link = document.createElement("a");
      link.href = capturedPhoto.image;
      link.download = `ar-tryOn-${product.name
        .replace(/\s+/g, "-")
        .toLowerCase()}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Failed to download image:", err);
      setError("Failed to download image");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Check out how I look in ${product.name}!`,
          text: "Tried on using AR technology",
          url: window.location.href,
        });
      } catch (err) {
        if (err.name !== "AbortError") {
          // Fallback to copy link if share fails
          await handleCopyLink();
        }
      }
    } else {
      await handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      setError("Failed to copy link to clipboard");
    }
  };

  if (!arSupported) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          AR Not Supported
        </h3>
        <p className="text-gray-600">
          Your device doesn't support AR try-on features.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Sparkles className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">AR Try-On</h3>
          </div>
          <span className="bg-white bg-opacity-20 px-2 py-1 rounded text-sm">
            Beta
          </span>
        </div>
        <p className="text-sm opacity-90 mt-1">
          See how {product.name} looks on you
        </p>
      </div>

      <div className="p-6">
        {error && (
          <div className="mb-4 bg-red-50 text-red-700 p-3 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        {!isARActive ? (
          <div className="text-center">
            <div className="w-32 h-32 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Camera className="h-16 w-16 text-purple-600" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">
              Try Before You Buy
            </h4>
            <p className="text-gray-600 mb-6">
              Use your camera to see how this product looks on you in real-time
            </p>
            <button
              onClick={handleStartAR}
              disabled={loading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50 flex items-center mx-auto"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              ) : (
                <Camera className="h-5 w-5 mr-2" />
              )}
              {loading ? "Starting AR..." : "Start AR Try-On"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* AR Camera View */}
            <div className="relative bg-black rounded-lg overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-64 object-cover"
              />

              {/* AR Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={handleCapture}
                  className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                  aria-label="Capture photo"
                >
                  <Camera className="h-6 w-6" />
                </button>
                <button
                  onClick={handleEndAR}
                  className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                  aria-label="Exit AR mode"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Captured Photo */}
            {capturedPhoto && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">
                  Captured Photo
                </h4>
                <div className="relative">
                  <img
                    src={capturedPhoto.image}
                    alt={`AR try-on with ${product.name}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="bg-white text-gray-900 p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                      aria-label="Download image"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white text-gray-900 p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                      aria-label="Share image"
                    >
                      <Share2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

ARTryOn.propTypes = {
  product: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
};

export default ARTryOn;
