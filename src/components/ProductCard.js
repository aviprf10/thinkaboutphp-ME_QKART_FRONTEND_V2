import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Rating, CardActions } from '@mui/material';
import { AddShoppingCartOutlined } from "@mui/icons-material";

const ProductCard = ({ product}) => {
  // const { name, category, cost, rating, image } = productData;

  const handleAddToCart = () => {
    // Implement the logic to add the product to the cart
    console.log(`Product added to cart:`);
  };

  return (
    <Card className="card">
      <CardMedia component="img" alt={product.name} src={product.image} />
      <CardContent>
        <Typography>{product.name}</Typography>
        <Typography paddingY="0.5rem" fontWeight="700">
          ${product.cost}
        </Typography>
        <Rating
          name="read-only"
          value={product.rating}
          precision={0.5}
          readOnly
        />
      </CardContent>
      <CardActions>
        <Button className="card-button" fullWidth variant="contained" startIcon={<AddShoppingCartOutlined />} onClick={handleAddToCart} >
            Add to cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;