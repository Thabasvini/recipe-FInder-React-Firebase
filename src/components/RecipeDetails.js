import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Card, CardMedia, CardContent, Typography, IconButton, Paper } from '@mui/material';
import { createMarkup } from './helpers';
import FavoriteIcon from '@mui/icons-material/Favorite';
import { getDatabase, ref, push, onValue, remove, set } from 'firebase/database';
import { auth } from '../firebase';


const RecipeDetails = () => {
  const { id } = useParams();
  const [recipeDetails, setRecipeDetails] = useState(null);
  const [ingredientImages, setIngredientImages] = useState({});
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [wishlistedRecipes, setWishlistedRecipes] = useState({});

  useEffect(() => {
    // Fetch recipe details using Axios
    const fetchRecipeDetails = async () => {
      try {
        const response = await axios.get(`https://api.spoonacular.com/recipes/${id}/information?apiKey=1b109cc6e84d4e1da2146bcf784e5700`);

        setRecipeDetails(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchRecipeDetails();
  }, [id]);

  const handleWishListClick = async (recipe) => {
    const database = getDatabase();
    const userId = auth.currentUser.uid;
    const wishlistRef = ref(database, `wishlist/${userId}/${recipe.id}`);

    if (wishlistedRecipes[recipe.id]) {
      // If already wishlisted, remove the item from the wishlist
      await remove(wishlistRef);
    } else {
      // If not wishlisted, add the item to the wishlist
      await set(wishlistRef, recipe);
    }

    // Update the wishlisted state for the specific recipe
    setWishlistedRecipes((prevWishlisted) => ({
      ...prevWishlisted,
      [recipe.id]: !prevWishlisted[recipe.id],
    }));
  };

  if (!recipeDetails) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <Card elevation={3} style={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="400"
          image={`https://spoonacular.com/recipeImages/${id}-636x393.jpg`} 
          alt={recipeDetails.title}
          sizes="(max-width: 600px) 90vw, (max-width: 1024px) 50vw, 30vw"
          style={{ marginTop: '20px' }}
        />
        <CardContent>
          <Typography gutterBottom variant="h4">
            {recipeDetails.title}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Servings: {recipeDetails.servings}
          </Typography>
          <Typography gutterBottom variant="subtitle1">
            Cooking Time: {recipeDetails.readyInMinutes} minutes
          </Typography>
          <Typography variant="h5" gutterBottom>
            Ingredients:
          </Typography>
          <ul>
            {recipeDetails.extendedIngredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.original}
                {ingredientImages[ingredient.name.toLowerCase()] && (
                  <img
                    src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredientImages[ingredient.name.toLowerCase()]}`}
                    alt={ingredient.name}
                    height="50"
                    style={{ marginLeft: '10px' }}
                  />
                )}
              </li>
            ))}
          </ul>
          <Typography variant="h5" gutterBottom>
            Instructions:
          </Typography>
          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={createMarkup(recipeDetails.instructions)} />
          </Typography>
          <Typography variant="body1" paragraph>
            <div dangerouslySetInnerHTML={createMarkup(recipeDetails.summary)} />
          </Typography>
        </CardContent>
        <IconButton
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            zIndex: '1',
            color: wishlistedRecipes[recipeDetails.id] ? 'red' : 'inherit',
          }}
          aria-label="add to wishlist"
          onClick={() => handleWishListClick(recipeDetails)}
        >
          <FavoriteIcon />
        </IconButton>
      </Card>
    </div>
  );
};

export default RecipeDetails;