import { useState, useEffect, useMemo } from 'react';
import { vegetableAPI } from '../services/api';

export const useVegetables = () => {
  const [vegetables, setVegetables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Fetch vegetables data
  useEffect(() => {
    const fetchVegetables = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await vegetableAPI.getAll();
        setVegetables(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVegetables();
  }, []);

  // Filter and search vegetables
  const filteredVegetables = useMemo(() => {
    if (!vegetables.length) return [];

    let filtered = vegetables;

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(vegetable =>
        vegetable.name_nepali.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply price filter
    switch (filter) {
      case 'min':
        filtered = [...filtered].sort((a, b) => a.min_price - b.min_price);
        break;
      case 'max':
        filtered = [...filtered].sort((a, b) => b.max_price - a.max_price);
        break;
      case 'avg':
        filtered = [...filtered].sort((a, b) => b.avg_price - a.avg_price);
        break;
      default:
        // Keep original order
        break;
    }

    return filtered;
  }, [vegetables, searchTerm, filter]);

  // Calculate summary statistics
  const summary = useMemo(() => {
    if (!vegetables.length) return null;

    const validPrices = vegetables.filter(v => 
      !isNaN(v.min_price) && 
      !isNaN(v.max_price) && 
      !isNaN(v.avg_price)
    );

    if (!validPrices.length) return null;

    return {
      minPrice: Math.min(...validPrices.map(v => v.min_price)),
      maxPrice: Math.max(...validPrices.map(v => v.max_price)),
      avgPrice: validPrices.reduce((acc, v) => acc + v.avg_price, 0) / validPrices.length
    };
  }, [vegetables]);

  return {
    vegetables: filteredVegetables,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filter,
    setFilter,
    summary,
    refresh: () => {
      setLoading(true);
      setError(null);
      vegetableAPI.getAll()
        .then(data => setVegetables(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    }
  };
};