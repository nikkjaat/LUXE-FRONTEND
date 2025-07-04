import React, { useState, useRef } from 'react';
import { Camera, RotateCcw, Download, Share2, Sparkles } from 'lucide-react';
import { useAR } from '../context/ARContext';

const ARTryOn = ({ product }) => {
  const { startARSession, endARSession, captureARPhoto, arSupported } = useAR();
  const [isARActive, setIsARActive] = useState(false);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [loading, setLoading] = useState(false);
  const videoRef = useRef(null);

  const handleStartAR = async () => {
    if (!arSupported) {
      alert('AR is not supported on this device');
      return;
    }

    setLoading(true);
    try {
      // Simulate camera access
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      
      await startARSession(product.id, 'try-on');
      setIsARActive(true);
    } catch (error) {
      console.error('Failed to start AR session:', error);
      alert('Failed to access camera');
    } finally {
      setLoading(false);
    }
  };

  const handleEndAR = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach(track => track.stop());
    }
    endARSession();
    setIsARActive(false);
  };

  const handleCapture = () => {
    const photo = captureARPhoto(product.id);
    setCapturedPhoto(photo);
  };

  const handleDownload = () => {
    // Simulate download
    const link = document.createElement('a');
    link.href = capturedPhoto.image;
    link.download = `ar-tryOn-${product.name}.jpg`;
    link.click();
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: `Check out how I look in ${product.name}!`,
        text: 'Tried on using AR technology',
        url: window.location.href
      });
    } else {
      // Fallback to copy link
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  if (!arSupported) {
    return (
      <div className="bg-gray-100 rounded-lg p-6 text-center">
        <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">AR Not Supported</h3>
        <p className="text-gray-600">Your device doesn't support AR try-on features.</p>
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
              {loading ? 'Starting AR...' : 'Start AR Try-On'}
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
                className="w-full h-64 object-cover"
              />
              
              {/* AR Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-white bg-opacity-20 backdrop-blur-sm rounded-lg p-4">
                  <p className="text-white text-center">
                    AR overlay for {product.name}
                  </p>
                </div>
              </div>

              {/* AR Controls */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-4">
                <button
                  onClick={handleCapture}
                  className="bg-white text-gray-900 p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors"
                >
                  <Camera className="h-6 w-6" />
                </button>
                <button
                  onClick={handleEndAR}
                  className="bg-red-500 text-white p-3 rounded-full shadow-lg hover:bg-red-600 transition-colors"
                >
                  <RotateCcw className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Captured Photo */}
            {capturedPhoto && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Captured Photo</h4>
                <div className="relative">
                  <img
                    src={capturedPhoto.image}
                    alt="AR Capture"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex space-x-2">
                    <button
                      onClick={handleDownload}
                      className="bg-white text-gray-900 p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
                    >
                      <Download className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleShare}
                      className="bg-white text-gray-900 p-2 rounded-full shadow hover:bg-gray-100 transition-colors"
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

export default ARTryOn;