import { AddShoppingCartOutlined } from "@mui/icons-material";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Rating,
  Typography,
} from "@mui/material";
import React from "react";
import "./ProductCard.css";

const ProductCard = ({ product, addToCart }) => {
  const handleAddToCartClick = () => {
    // Call the addToCart function with the product's ID
    addToCart(product._id);
  };
  return (
    <Card className="card">
      <CardMedia component="img" image={product.image} alt={product.name} />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography paddingY="0.5rem" fontWeight="700">
          ${product.cost}
        </Typography>
        {/* <Rating name="read-only" value={product.rating} /> */}
        <Rating name="half-rating stars" value={product.rating} readOnly />
      </CardContent>

      <CardActions>
        <Button
          className="card-button"
          fullWidth
          variant="contained"
          startIcon={<AddShoppingCartOutlined />}
          onClick={handleAddToCartClick}>
          Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
