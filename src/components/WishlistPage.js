import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { getDatabase, ref, onValue, remove } from 'firebase/database';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Link } from 'react-router-dom';

const WishlistPage = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const database = getDatabase();
    const userId = auth.currentUser.uid; // Assuming the user is authenticated
    const wishlistRef = ref(database, `wishlist/${userId}`);

    onValue(wishlistRef, (snapshot) => {
      const wishlistData = snapshot.val();
      if (wishlistData) {
        const wishlistItems = Object.entries(wishlistData).map(([recipeId, recipeData]) => ({
          id: recipeId,
          ...recipeData,
        }));
        setWishlist(wishlistItems);
      }
    });
  }, []);

  const handleDeleteFromWishlist = async (recipeId) => {
    const database = getDatabase();
    const userId = auth.currentUser.uid; // Assuming the user is authenticated
    const recipeRef = ref(database, `wishlist/${userId}/${recipeId}`);

    try {
      await remove(recipeRef);
    } catch (error) {
      console.error('Error deleting recipe from wishlist:', error);
    }
  };

  return (
    <div>
      <h2>Wishlist</h2>
      {wishlist.length > 0 ? (
        wishlist.map((recipe) => (
          <Card key={recipe.id}>
            <CardContent>
              <Typography gutterBottom variant="h5">
                {recipe.title}
              </Typography>
              <Link to={`/recipe/${recipe.id}`}> {/* Adjust the route path as needed */}
            <img src={recipe.image} alt={recipe.title} style={{ width: '100px' }} />
             </Link>
            </CardContent>
            <IconButton
              aria-label="remove from wishlist"
              onClick={() => handleDeleteFromWishlist(recipe.id)}
            >
              <DeleteIcon />
            </IconButton>
          </Card>
        ))
      ) : (
        <p>Your wishlist is empty.</p>
      )}
    </div>
  );
};

export default WishlistPage;