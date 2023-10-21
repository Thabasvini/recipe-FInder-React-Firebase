import React, { useState } from 'react';
import { TextField, Button, Card, CardMedia, CardContent, Typography, Grid } from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';

const HomePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeResults, setRecipeResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    axios
      .get(`https://api.spoonacular.com/recipes/complexSearch`, {
        params: {
          apiKey: '1b109cc6e84d4e1da2146bcf784e5700',
          query: searchQuery,
        },
      })
      .then((response) => {
        console.log(response.data.results); // Log the API response
        setRecipeResults(response.data.results);
      })
      .catch((error) => console.log(error));
  };

  return (
    <div style={{ padding: '20px', marginTop: '20px', position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '150px', // Adjust the height as needed
          backgroundImage: 'url("/homepageBg.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          marginBottom: '20px',
        }}
      ></div>
      <div style={{ zIndex: 1, background: 'white', padding: '10px' }}>
        <TextField
          label="Search for recipes"
          fullWidth
          variant="outlined"
          size="small" // Adjust the size as needed
          value={searchQuery}
          onChange={handleSearchQueryChange}
         
        />
        <Button
          variant="contained"
          color="primary"
          size="small" // Adjust the size as needed
          onClick={handleSearch}
          style={{ marginTop: '10px', marginLeft: '10px' }}
        >
          Search
        </Button>
      </div>
      <Grid container spacing={2} style={{ marginTop: '80px' }}>
        {recipeResults.map((recipe) => (
          <Grid item key={recipe.id} xs={12} sm={6} md={4} lg={3}>
            <Link to={`/recipe/${recipe.id}`} style={{ textDecoration: 'none' }}>
              <Card elevation={3}>
                <CardMedia component="img" height="150" image={recipe.image} alt={recipe.title} />
                <CardContent>
                  <Typography variant="h6" component="div">
                    {recipe.title}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default HomePage;