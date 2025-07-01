import React, { useState } from 'react';
import { Mail, Gift, Sparkles } from 'lucide-react';

const Newsletter = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setIsSubscribed(true);
      setEmail('');
      setTimeout(() => setIsSubscribed(false), 3000);
    }
  };

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* Content */}
            <div className="p-12 lg:p-16">
              <div className="flex items-center mb-6">
                <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-3 rounded-full mr-4">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <span className="text-orange-600 font-semibold">Exclusive Offers</span>
              </div>
              
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Join Our VIP Club
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Be the first to know about new arrivals, exclusive sales, and luxury collections. 
                Plus, get 15% off your first order when you subscribe!
              </p>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                    required
                  />
                </div>
                
                <button
                  type="submit"
                  disabled={isSubscribed}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-4 rounded-lg font-semibold text-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubscribed ? 'Welcome to VIP Club!' : 'Subscribe & Save 15%'}
                </button>
              </form>

              <div className="flex items-center mt-6 text-sm text-gray-500">
                <Sparkles className="h-4 w-4 mr-2" />
                <span>No spam, unsubscribe anytime</span>
              </div>
            </div>

            {/* Image */}
            <div className="relative bg-gradient-to-br from-blue-100 to-purple-100 p-12 lg:p-16 flex items-center justify-center">
              <div className="relative">
                <img
                  src="https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Luxury Shopping"
                  className="rounded-2xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                />
                <div className="absolute -top-4 -right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-4 rounded-full shadow-xl animate-bounce">
                  <span className="text-sm font-bold">15% OFF</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;