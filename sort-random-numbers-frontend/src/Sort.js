import React, { useState } from 'react';
import { sortNumbers } from './apiService';

const SortingApp = () => {
  const [numbers, setNumbers] = useState(Array(10).fill(''));
  const [sortedNumbers, setSortedNumbers] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [primeFilterActive, setPrimeFilterActive] = useState(false);
  const [filterCondition, setFilterCondition] = useState({ symbol: '', value: '' });
  const [staticCards, setStaticCards] = useState([]);

  // Check if a number is prime
  const isPrime = (num) => {
    if (num <= 1) return false;
    for (let i = 2; i <= Math.sqrt(num); i++) {
      if (num % i === 0) return false;
    }
    return true;
  };

  // Handle input change
  const handleInputChange = (index, value) => {
    const newNumbers = [...numbers];
    newNumbers[index] = value;
    setNumbers(newNumbers);
  };

  // Fill random numbers
  const fillRandomNumbers = () => {
    setNumbers(Array.from({ length: 10 }, () => Math.floor(Math.random() * 100)));
  };

  // Submit handle
  const handleSubmit = async () => {
    const validNumber = numbers.map(Number).filter(num => !isNaN(num));
    try {
      const sortedData = await sortNumbers(validNumber);
      setSortedNumbers(sortedData);
    } catch (error) {
      console.error('Error sorting numbers: ', error);
    }
  };

  // Handle filter condition
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilterCondition(prev => ({ ...prev, [name]: value }));
  };

  // Apply filter to sorted numbers
  const applyFilter = (num) => {
    if (!filterCondition.symbol || !filterCondition.value) return true;
    const conditionValue = parseFloat(filterCondition.value);
    if (isNaN(conditionValue)) return true;
    switch (filterCondition.symbol) {
      case '>':
        return num > conditionValue;
      case '<':
        return num < conditionValue;
      case '=':
        return num === conditionValue;
      default:
        return true;
    }
  };

  // Toggle sort order
  const handleSortOrderChange = (e) => {
    setSortOrder(e.target.value);
  };

  // Toggle static card status
  const toggleStaticCard = (index) => {
    const newStaticCards = [...staticCards];
    if (newStaticCards.includes(index)) {
      newStaticCards.splice(newStaticCards.indexOf(index), 1);
    } else {
      newStaticCards.push(index);
    }
    setStaticCards(newStaticCards);
  };

  // Sort the numbers based on selected order and apply filter
  const sortedAndFilteredNumbers = [...sortedNumbers]
    .filter(num => applyFilter(num)) // Apply filter to numbers
    .sort((a, b) => {
      if (sortOrder === 'ascending') return a - b;
      return b - a;
    });

  return (
    <div
      className="min-h-screen p-6 flex justify-center items-center"
      style={{
        backgroundImage: 'url(https://i.pinimg.com/736x/5c/c0/1a/5cc01ab8367a269c61ffc1e77ef8b799.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="bg-gray-100 rounded-lg shadow-xl w-full max-w-4xl p-8">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-8">Number Sorting App</h1>

        {/* Input Fields */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {numbers.map((num, index) => (
            <div key={index} className="flex items-center">
              <input
                type="number"
                value={num}
                onChange={(e) => handleInputChange(index, e.target.value)}
                placeholder="Enter a number"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="checkbox"
                checked={staticCards.includes(index)}
                onChange={() => toggleStaticCard(index)}
                className="ml-2"
              />
              <span className="ml-2 text-gray-700">Static</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between mb-6">
          <button
            onClick={fillRandomNumbers}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-300"
          >
            Fill Random Numbers
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-3 bg-gradient-to-r from-green-400 to-teal-500 text-white rounded-lg shadow-md hover:bg-green-500 transition duration-300"
          >
            Sort Numbers
          </button>
        </div>

        {/* Sort Order Selection */}
        <div className="flex justify-between mb-6">
          <label className="text-lg text-gray-700">Sort Order:</label>
          <select
            value={sortOrder}
            onChange={handleSortOrderChange}
            className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ascending">Ascending</option>
            <option value="descending">Descending</option>
          </select>
        </div>

        {/* Filter Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={primeFilterActive}
              onChange={() => setPrimeFilterActive(!primeFilterActive)}
              className="h-5 w-5 text-blue-600 focus:ring-2 focus:ring-blue-500"
            />
            <label className="ml-3 text-lg font-medium text-gray-700">Filter Results</label>
          </div>

          {primeFilterActive && (
            <div className="flex space-x-4">
              <select
                name="symbol"
                value={filterCondition.symbol}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Condition</option>
                <option value=">">Greater Than</option>
                <option value="<">Less Than</option>
                <option value="=">Equal To</option>
              </select>
              <input
                type="number"
                name="value"
                value={filterCondition.value}
                onChange={handleFilterChange}
                className="px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter value"
              />
            </div>
          )}
        </div>

        {/* Sorted Results */}
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Sorted Numbers</h2>
        <div className="space-y-4">
          {sortedAndFilteredNumbers.filter(num => !staticCards.includes(sortedAndFilteredNumbers.indexOf(num))).map((num, index) => (
            <div
              key={index}
              className={`px-6 py-3 text-lg rounded-lg border ${isPrime(num) ? 'bg-green-500 text-white' : 'bg-white text-gray-800'} shadow-md`}
            >
              {num}
            </div>
          ))}
          {/* Static cards */}
          {numbers.map((num, index) => staticCards.includes(index) && (
            <div key={index} className="px-6 py-3 text-lg rounded-lg border bg-gray-200 text-gray-800 shadow-md">
              {num}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortingApp;
