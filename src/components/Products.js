import React, { useState, useEffect } from 'react';
import SearchIcon from "@mui/icons-material/Search";
import { Box } from "@mui/system";
import ProductCard from './ProductCard';
import { Grid, CircularProgress, Typography } from '@mui/material';
import Header from "./Header";
import Footer from "./Footer";
import "./Products.css";
import { config } from "../App";
import _ from 'lodash'; 

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);

  const debounceSearch = (event, timeout) => {
    clearTimeout(timeout); // Clear the previous timeout
    const newText = event.target.value;
    
    // Set a new timeout for debouncing
    const newTimeout = setTimeout(() => {
      performSearch(newText);
    }, 500); // Adjust the debounce timeout as needed

    // Update the debounce timeout reference
    setDebounceTimeout(newTimeout);
  };

  useEffect(() => {
    let isMounted = true;
    const performAPICall = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${config.endpoint}/products`); // Replace with your actual API URL
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        if (isMounted) {
          setProducts(data);
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    performAPICall();

    return () => {
      isMounted = false;
    };
  }, []);

  // const dummyProduct = {
  //   name: 'Tan Leatherette Weekender Duffle',
  //   category: 'Fashion',
  //   cost: 150,
  //   rating: 4,
  //   image: 'https://crio-directus-assets.s3.ap-south-1.amazonaws.com/ff071a1c-1099-48f9-9b03-f858ccc53832.png',
  //   _id: 'PmInA797xJhMIPti',
  // };
  const performSearch = async (text) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${config.endpoint}/products/search?value=${encodeURIComponent(text)}`
      );
  
      if (!response.ok) {
        throw new Error('Error fetching data');
      }
  
      const data = await response.json();
  
      if (Array.isArray(data) && data.length === 0) {
        // No products found
        setFilteredProducts([]);
      } else {
        // Products found
        setFilteredProducts(data);
      }
  
      setError(null);
    } catch (error) {
      // Handle the error if needed
      setFilteredProducts([]);
      // setError('An error occurred while fetching data.');
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    // Cleanup the debounced function on component unmount
    return () => {
      clearTimeout(debounceTimeout);
    };
  }, [debounceTimeout]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);

    // Call the debounceSearch function on onChange event
    debounceSearch(e, debounceTimeout);

  };

  const customSearchView = (
    <div className="searchDesktop">
        <input
          type="text"
          placeholder="Search for items/categories"
          className="search-bar"  value={searchQuery}
          onChange={handleSearchChange}
        />
        <SearchIcon className="search-icon" />
      </div>
  );
  return (
    <div>
      <Header>
          {customSearchView}
      </Header>
        <Box className="hero">
            <p className="hero-heading">
            India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
            to your door step
            </p>
        </Box><br></br>
        {loading && (
           <div style={{ textAlign: 'center' }}>
            <CircularProgress />
            <Typography>Loading Products</Typography>
          </div> 
        )}

        {error && (
          <div style={{ color: 'red', textAlign: 'center' }}>
            <Typography>{error}</Typography>
          </div>
        )}

      {(searchQuery ? filteredProducts : products).length === 0 && !loading && !error && (
        <p>
          No products found <span role="img" aria-label="Dissatisfied">😟</span>
        </p>
      )}  

      {(!loading && !error && (searchQuery ? filteredProducts : products).length > 0) && (
        <Grid container spacing={2}>
          {(searchQuery ? filteredProducts : products).map((product) => (
            <Grid item xs={12} md={3} key={product._id}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      )}<br></br>
      <Footer />
    </div>
  );
};

export default Products;
