import React from "react";
import { Box, IconButton, Stack, Button } from "@mui/material";
import {
  RemoveOutlined,
  AddOutlined,
  ShoppingCartOutlined,
} from "@mui/icons-material";
import ItemQuantity from './ItemQuantity';
import { useHistory } from "react-router-dom";

/**
 * Component to display the Cart view
 * 
 * @param { Array.<Product> } products
 *    Array of objects with complete data of all available products
 * 
 * @param { Array.<Product> } items
 *    Array of objects with complete data on products in cart
 * 
 * @param {Function} handleQuantity
 *    Handler function to update the quantity of a product in the cart
 * 
 */


 export const getTotalCartValue = (items = []) => {
  return items.reduce((total, item) => total + item.cost * item.qty, 0);
};



const Cart = ({ products, items = [], handleQuantity, addToCart }) => {
  const history = useHistory();
  // const handleQuantity = (productId, newQuantity) => {
  //   console.log('Hii');
  // };  

  if (!items.length) {
    return (
      <Box className="cart empty">
        <ShoppingCartOutlined className="empty-cart-icon" />
        <Box color="#aaa" textAlign="center">
          Cart is empty. Add more items to the cart to checkout.
        </Box>
      </Box>
    );
  }

  return (
    <>
      <Box className="cart">
        {items.map((item) => (
        <Box key={item.productId} display="flex" alignItems="flex-start" padding="1rem">
          <Box className="image-container">
            <img
              src={item.image} 
              alt={item.name}
              width="100%"
              height="100%"
            />
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
            height="6rem"
            paddingX="1rem"
          >
            <div>{item.name}</div>  {/* Render product name */}
            <Box display="flex" justifyContent="space-between" alignItems="center">
              <ItemQuantity
                quantity={item.qty}
                onDecrease={() => handleQuantity(item.productId, item.qty - 1)}
                onIncrease={() => handleQuantity(item.productId, item.qty + 1)}
              />
              <Box padding="0.5rem" fontWeight="700">
                ${item.cost * item.qty}  {/* Calculate and render total cost for the product */}
              </Box>
            </Box>
          </Box>
        </Box>
))}


        <Box
          padding="1rem"
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Box color="#3C3C3C" alignSelf="center">
            Order total
          </Box>
          <Box
            color="#3C3C3C"
            fontWeight="700"
            fontSize="1.5rem"
            alignSelf="center"
            data-testid="cart-total"
          >
            ${getTotalCartValue(items)}
          </Box>
        </Box>
        <Button
          variant="contained"
          color="primary"
          onClick={() => history.push("/checkout")}
        >
          Checkout
        </Button>
      </Box>
      
    </>
  );
};

export default Cart;
