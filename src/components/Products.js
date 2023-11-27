import { Search, SentimentDissatisfied } from "@mui/icons-material";
import {
  CircularProgress,
  Grid,
  InputAdornment,
  TextField,
} from "@mui/material";

import { Box } from "@mui/system";
import React, { useEffect, useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Products.css";
import ProductCard from "./ProductCard";
import { useSnackbar } from "notistack";

// Definition of Data Structures used
import axios from "axios";
import Cart from "./Cart";
/**
 * @typedef {Object} Product - Data on product available to buy
 *
 * @property {string} name - The name or title of the product
 * @property {string} category - The category that the product belongs to
 * @property {number} cost - The price to buy the product
 * @property {number} rating - The aggregate rating of the product (integer out of five)
 * @property {string} image - Contains URL for the product image
 * @property {string} _id - Unique ID for the product
 */

const Products = () => {
  const [products, setProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const { enqueueSnackbar } = useSnackbar();
  const [cartItems, setCartItems] = useState(() => {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  });
  const isItemInCart = (productId) => {
    return cartItems.some((item) => item.productId === productId);
  };
  const userLoggedIn = localStorage.getItem("token") ? true : false;
  const userToken = localStorage.getItem("token");
  
  const performAPICall = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.endpoint}/products`);
      // const data = await response.json();
      setProducts(response.data);
      setFilteredProducts(response.data);
      setLoading(false);
    } catch (e) {
      // setError(error.message);
      setLoading(false);
      if (e.response && e.response.status === 500) {
        enqueueSnackbar(e.response.data.message, { variant: "error" });
        return null;
      } else {
        enqueueSnackbar(
          "Could not fetch products. check that the backend is running, reachable and return valid JSON",
          { variant: "error" }
        );
      }
    } finally {
      setLoading(false);
    }
  };
  
 
  const fetchCart = async (token) => {
    try {
      // Fetch the cart items
      const response = await axios.get(`${config.endpoint}/cart`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      // Extract productIds from cart items
      const productIds = response.data.map((cartItem) => cartItem.productId);
  
      // Fetch product details based on productIds
      const productsResponse = await axios.get(`${config.endpoint}/products`);
  
      // Match products with cart items based on productId
      const cartWithDetails = response.data.map((cartItem) => {
        const productDetails = productsResponse.data.find(
          (product) => product._id === cartItem.productId
        );
        return {
          ...cartItem,
          ...productDetails, // Include additional product details
        };
      });
  
      return cartWithDetails;
    } catch (error) {
      console.error("Error fetching cart:", error);
      throw error;
    }
  };

  useEffect(() => {
    performAPICall();
    fetchCart(userToken)
    .then((cartWithDetails) => {
      //console.log("User's Cart with Details:", cartWithDetails);
      // Perform any additional logic with the fetched cart data if needed
      setCartItems(cartWithDetails);
    })
    .catch((error) => {
      //console.error("Error fetching cart with details:", error);
      // Handle errors from fetchCart() if needed
    });
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  }, []);

  const performSearch = async (text) => {
    try {
      const response = await axios.get(
        `${config.endpoint}/products/search?value=${text}`
      );
      setFilteredProducts(response.data);
    } catch (e) {
      if (e.response) {
        if (e.response.status === 404) {
          setFilteredProducts([]);
        }
        if (e.response.status === 500) {
          enqueueSnackbar(e.response.message, { variant: "error" });
          setFilteredProducts(products);
        }
      } else {
        enqueueSnackbar(
          "Could not fetch the products. check that the backend is running, reachable and return valid JSON",
          { variant: "error" }
        );
      }
    }
  };

  const debounceSearch = (event, debounceTimeout) => {
    const value = event.target.value;
    // setSearchQuery(value)

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      performSearch(value);
    }, 500);
    setDebounceTimeout(timeout);
  };

  const addToCart = async (productId) => {
    try {

      if (isItemInCart(productId)) {
        // Product is already in the cart, show a warning
        console.log("Item already in cart. Use the cart sidebar to update quantity or remove item.");
        return;
      }
      const response = await axios.post(
        `${config.endpoint}/cart`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
  
      // Handle the response as needed
      console.log('Product added to cart:', response.data);
  
      // Update the cart items state
      const updatedCart = [...cartItems, response.data];
      setCartItems(updatedCart);
  
      // Update local storage
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } catch (error) {
      //console.error('Error adding to cart:', error);
      // Handle errors
    }
  };

  const handleQuantity = (productId, newQuantity) => {
   if (newQuantity === 0) {
    const updatedCart = cartItems.filter(item => item.productId !== productId);
    setCartItems(updatedCart);
  } else {
    // Otherwise, update the quantity
    const updatedCart = cartItems.map(item => {
      if (item.productId === productId) {
        return { ...item, qty: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCart);
  }
  };
    
  if (userLoggedIn === true) {
    return (
      <div>
        <Header>
          <TextField
            className="search-desktop"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e, debounceTimeout)}
          />
        </Header>
  
        {/* Search view for mobiles */}
        <TextField
          className="search-mobile"
          size="small"
          fullWidth
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <Search color="primary" />
              </InputAdornment>
            ),
          }}
          placeholder="Search for items/categories"
          name="search"
          onChange={(e) => debounceSearch(e, debounceTimeout)}
        />
        <div className="productsContainer">
          <Grid container>
            <Grid item className="product-grid">
              <Box className="hero">
                <p className="hero-heading">
                  India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                  to your door step
                </p>
              </Box>
            </Grid>
          </Grid>
          <br />
          {loading ? (
            <Box className="loading">
            <CircularProgress />
            <h4>Loading Products...</h4>
          </Box>
          ) : (
            <Grid
            container marginY="1rem" paddingX="1rem" spacing={2}>
              {filteredProducts.length ? (
                filteredProducts.map((product) => (
                  <Grid item key={product["_id"]} xs={6} md={3}>
                    <ProductCard product={product} addToCart={addToCart} />
                  </Grid>
                ))
              ) : (
                <Box className="loading">
                <SentimentDissatisfied color="action" />
                <h4 style={{ color: "#636363 " }}>No products found</h4>
              </Box>
              )}
            </Grid>
          )}
        </div>  
        <div className="cartContainer">
          <Cart products={products} items={cartItems} handleQuantity={handleQuantity} />
        </div>
  
        <br />
        <Footer />
      </div>
    );
  }  
  else{
      return (
        <div>
          <Header>
            <TextField
              className="search-desktop"
              size="small"
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Search color="primary" />
                  </InputAdornment>
                ),
              }}
              placeholder="Search for items/categories"
              name="search"
              onChange={(e) => debounceSearch(e, debounceTimeout)}
            />
          </Header>

          {/* Search view for mobiles */}
          <TextField
            className="search-mobile"
            size="small"
            fullWidth
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Search color="primary" />
                </InputAdornment>
              ),
            }}
            placeholder="Search for items/categories"
            name="search"
            onChange={(e) => debounceSearch(e, debounceTimeout)}
          />
          
            <Grid container>
              <Grid item className="product-grid">
                <Box className="hero">
                  <p className="hero-heading">
                    India’s <span className="hero-highlight">FASTEST DELIVERY</span>{" "}
                    to your door step
                  </p>
                </Box>
              </Grid>
            </Grid>
            <br />
            {loading ? (
              <Box className="loading">
              <CircularProgress />
              <h4>Loading Products...</h4>
            </Box>
            ) : (
              <Grid
              container marginY="1rem" paddingX="1rem" spacing={2}>
                {filteredProducts.length ? (
                  filteredProducts.map((product) => (
                    <Grid item key={product["_id"]} xs={6} md={3}>
                      <ProductCard product={product} addToCart={addToCart} />
                    </Grid>
                  ))
                ) : (
                  <Box className="loading">
                  <SentimentDissatisfied color="action" />
                  <h4 style={{ color: "#636363 " }}>No products found</h4>
                </Box>
                )}
              </Grid>
            )}
         
          <br />
          <Footer />
        </div>
      );
  }
};


export default Products;
