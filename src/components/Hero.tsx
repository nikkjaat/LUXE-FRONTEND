import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-purple-900 text-white overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="animate-fade-in-up">
            <div className="flex items-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-400 mr-3 animate-pulse" />
              <span className="text-yellow-400 font-semibold text-lg">Premium Collection</span>
            </div>
            
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Luxury
              </span>
              Like Never Before
            </h1>
            
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              Curated collections of premium products that define elegance and sophistication. 
              Experience shopping reimagined with our exclusive luxury marketplace.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/shop"
                className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-gray-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 transform hover:scale-105 hover:shadow-2xl flex items-center justify-center group"
              >
                Shop Collection
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link
                to="/categories"
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-300 flex items-center justify-center"
              >
                Browse Categories
              </Link>
            </div>
            
            <div className="flex items-center mt-12 space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">10K+</div>
                <div className="text-blue-200 text-sm">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">500+</div>
                <div className="text-blue-200 text-sm">Premium Products</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400">4.9★</div>
                <div className="text-blue-200 text-sm">Customer Rating</div>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="relative animate-fade-in-up animation-delay-200">
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Luxury Fashion"
                className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
              />
              <div className="absolute -bottom-6 -left-6 bg-white text-gray-900 p-6 rounded-xl shadow-xl">
                <div className="text-2xl font-bold text-blue-900">Free Shipping</div>
                <div className="text-gray-600">On orders over $100</div>
              </div>
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-xl animate-bounce">
                <span className="text-sm font-bold">NEW</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-yellow-400 rounded-full opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-16 h-16 bg-pink-500 rounded-full opacity-20 animate-pulse animation-delay-200"></div>
      <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-purple-400 rounded-full opacity-20 animate-pulse"></div>
    </section>
  );
};

export default Hero;