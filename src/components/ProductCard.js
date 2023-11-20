import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button } from '@mui/material';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';

const ProductCard = ({ productData }) => {
  const { name, category, cost, rating, image } = productData;

  const handleAddToCart = () => {
    // Implement the logic to add the product to the cart
    console.log(`Product added to cart: ${name}`);
  };

  return (
    <Card>
      <CardMedia
        component="img"
        alt={name}
        height="140"
        image={image}
      />
      <CardContent>
        <Typography gutterBottom variant="h5" component="div">
          {name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Category: {category}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Cost: ${cost}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {rating}
        </Typography>
        <Button
          variant="contained"
          endIcon={<AddShoppingCartIcon />}
          onClick={handleAddToCart}
        >
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;