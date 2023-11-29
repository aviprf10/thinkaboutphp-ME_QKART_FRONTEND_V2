import React from "react";
import { Box, IconButton, Stack, Button } from "@mui/material";
import {
  RemoveOutlined,
  AddOutlined,
  ShoppingCart,
  ShoppingCartOutlined,
} from "@mui/icons-material";
// import ItemQuantity from './ItemQuantity';
import { useHistory } from "react-router-dom";
import "./Cart.css";

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

 export const generateCartItemsFrom = (cartData, productsData) => {
  if (!cartData) return;

  const nextCart = cartData.map((item) => ({
    ...item,
    ...productsData.find((product) => item.productId === product._id),
  }));
  console.log(nextCart);
  return nextCart;
};

 export const getTotalCartValue = (items = []) => {
  // return items.reduce((total, item) => {
  //     if (item.qty !== undefined && item.qty !== null) {
  //       return total + item.cost * item.qty;
  //     }
  //     return total;
  //   }, 0);
  if (!items.length) return 0;
  const total = items
    .map((item) => item.cost * item.qty)
    .reduce((total, n) => total + n);

  return total; 
  };

  const ItemQuantity = ({ value, handleAdd, handleDelete, isReadOnly = false }) => {
    if(isReadOnly){
      return <Box>Qty: {value}</Box>
    }
    return (
      <Stack direction="row" alignItems="center">
        <IconButton size="small" color="primary" onClick={handleDelete}>
          <RemoveOutlined />
        </IconButton>
        <Box padding="0.5rem" data-testid="item-qty">
          {value}
        </Box>
        <IconButton size="small" color="primary" onClick={handleAdd}>
          <AddOutlined />
        </IconButton>
      </Stack>
    );
  };


const Cart = ({ products, items = [], handleQuantity }) => {
  // const handleQuantity = (productId, newQuantity) => {
  //   console.log('Hii');
  // };  

  // if (!items.length) {
  //   return (
  //     <Box className="cart empty">
  //       <ShoppingCartOutlined className="empty-cart-icon" />
  //       <Box color="#aaa" textAlign="center">
  //         Cart is empty. Add more items to the cart to checkout.
  //       </Box>
  //     </Box>
  //   );
  const token = localStorage.getItem('token');
  const history = useHistory();
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
        {/* TODO: CRIO_TASK_MODULE_CART - Display view for each cart item with non-zero quantity */}
        {items.map((item) => (
          <Box key={item.productId}>
            {item.qty > 0 ?
          <Box display="flex" alignItems="flex-start" padding="1rem">
            <Box className="image-container">
              <img
                // Add product image
                src={item.image}
                // Add product name as alt eext
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
              <div>{item.name}</div>
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
              >
                <ItemQuantity value={item.qty}
                // Add required props by checking implementation
                handleAdd = {() => {
                  handleQuantity(
                    token,
                    items,
                    item.productId,
                    products,
                    item.qty + 1
                  );
                }}
                handleDelete = {() => {
                  handleQuantity(
                    token,
                    items,
                    item.productId,
                    products,
                    item.qty - 1
                  );
                }}
                />
                <Box padding="0.5rem" fontWeight="700">
                  ${item.cost}
                </Box>
              </Box>
            </Box>
          </Box> : null}
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

        <Box display="flex" justifyContent="flex-end" className="cart-footer">
          <Button
            color="primary"
            variant="contained"
            startIcon={<ShoppingCart />}
            className="checkout-btn"
            onClick={() => {
              history.push('/checkout');
            }}
          >
            Checkout
          </Button>
        </Box>
      </Box>
    </>
  );
  
};

export default Cart;
