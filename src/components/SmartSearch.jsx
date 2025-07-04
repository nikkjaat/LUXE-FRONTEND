import React, { useState, useEffect } from 'react';
import { Search, TrendingUp, Clock, X } from 'lucide-react';
import { useAI } from '../context/AIContext';
import VoiceSearch from './VoiceSearch';
import VisualSearch from './VisualSearch';

const SmartSearch = ({ onSearch }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState([
    'leather handbag',
    'designer watch',
    'silk scarf'
  ]);
  const { getSmartSearchSuggestions } = useAI();

  useEffect(() => {
    if (query.length > 2) {
      const suggestions = getSmartSearchSuggestions(query);
      setSuggestions(suggestions);
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  }, [query, getSmartSearchSuggestions]);

  const handleSearch = (searchQuery) => {
    const finalQuery = searchQuery || query;
    if (finalQuery.trim()) {
      onSearch(finalQuery);
      setRecentSearches(prev => [finalQuery, ...prev.filter(s => s !== finalQuery)].slice(0, 5));
      setQuery('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.text);
    handleSearch(suggestion.text);
  };

  const handleVoiceSearch = (transcript) => {
    setQuery(transcript);
    handleSearch(transcript);
  };

  const handleVisualSearchResults = (results) => {
    // Handle visual search results
    console.log('Visual search results:', results);
  };

  const getSuggestionIcon = (type) => {
    switch (type) {
      case 'trending': return <TrendingUp className="h-4 w-4 text-orange-500" />;
      case 'recent': return <Clock className="h-4 w-4 text-gray-500" />;
      default: return <Search className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative w-full max-w-2xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          onFocus={() => setShowSuggestions(true)}
          className="block w-full pl-10 pr-20 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
          placeholder="Search products, brands, categories..."
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 space-x-2">
          <VoiceSearch onSearch={handleVoiceSearch} />
          <VisualSearch onResults={handleVisualSearchResults} />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>
      </div>

      {/* Search Suggestions */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {/* AI Suggestions */}
          {suggestions.length > 0 && (
            <div className="p-2">
              <div className="text-xs font-medium text-gray-500 px-3 py-2">
                Smart Suggestions
              </div>
              {suggestions.map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => handleSuggestionClick(suggestion)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  {getSuggestionIcon(suggestion.type)}
                  <span className="ml-3 flex-1">{suggestion.text}</span>
                  <span className="text-xs text-gray-500">
                    {suggestion.count} items
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Recent Searches */}
          {recentSearches.length > 0 && !query && (
            <div className="p-2 border-t border-gray-100">
              <div className="text-xs font-medium text-gray-500 px-3 py-2">
                Recent Searches
              </div>
              {recentSearches.map((search, index) => (
                <button
                  key={index}
                  onClick={() => handleSearch(search)}
                  className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-left"
                >
                  <Clock className="h-4 w-4 text-gray-400" />
                  <span className="ml-3">{search}</span>
                </button>
              ))}
            </div>
          )}

          {/* Trending Searches */}
          <div className="p-2 border-t border-gray-100">
            <div className="text-xs font-medium text-gray-500 px-3 py-2">
              Trending Now
            </div>
            {['luxury handbags', 'smart watches', 'winter fashion'].map((trend, index) => (
              <button
                key={index}
                onClick={() => handleSearch(trend)}
                className="w-full flex items-center px-3 py-2 hover:bg-gray-100 rounded-lg text-left"
              >
                <TrendingUp className="h-4 w-4 text-orange-500" />
                <span className="ml-3">{trend}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartSearch;