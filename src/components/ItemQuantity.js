// ItemQuantity.js

import React from 'react';
import { IconButton, Typography, Box } from '@mui/material';
import { RemoveOutlined, AddOutlined } from '@mui/icons-material';

const ItemQuantity = ({ quantity, onDecrease, onIncrease }) => {
  return (
    <Box display="flex" alignItems="center">
      <IconButton onClick={onDecrease}>
        <RemoveOutlined />
      </IconButton>
      <Typography variant="body1">{quantity}</Typography>
      <IconButton onClick={onIncrease}>
        <AddOutlined />
      </IconButton>
    </Box>
  );
};

export default ItemQuantity;
