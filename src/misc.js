import React, { useState } from 'react';
import { TextField, Button, Grid, Card, CardContent, Typography, List, ListItem, ListItemIcon, ListItemText, ListItemAvatar, Avatar, Chip, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { styled } from '@mui/system';
import { FiberManualRecord } from '@mui/icons-material';
import axios from 'axios';

const RecipeFinder = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recipeResults, setRecipeResults] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [recipeIngredients, setRecipeIngredients] = useState([]);
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [servings, setServings] = useState(0);
  const [readyInMinutes, setReadyInMinutes] = useState(0);
  const [dishTypes, setDishTypes] = useState([]);
  const [nutritionalFacts, setNutritionalFacts] = useState(null);
  const [activeToggles, setActiveToggles] = useState({});
  const [openCardId, setOpenCardId] = useState(null);

  const handleSearchQueryChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    axios.get(`https://api.spoonacular.com/recipes/complexSearch`, {
      params: {
        apiKey: '1b109cc6e84d4e1da2146bcf784e5700',
        query: searchQuery,
      }
    })
      .then(response => {
        console.log(response.data.results); // Log the API response
        setRecipeResults(response.data.results);
      })
      .catch(error => console.log(error));
  };

  const handleToggle = (recipeId, value) => {

    if (recipeId === openCardId) {
      setOpenCardId(null);
      setActiveToggles({});
    } else {
      setOpenCardId(recipeId);
      setActiveToggles(prevToggles => ({
        ...prevToggles,
        [recipeId]: value,
      }));
    }
    // Fetch data based on the selected toggle value
    if (value === 'ingredients') {
      axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: '1b109cc6e84d4e1da2146bcf784e5700',
        }
      })
        .then(response => {
          console.log(response.data); // Log the API response
          setSelectedRecipe(response.data);
          setRecipeIngredients(response.data.extendedIngredients);
          setRecipeInstructions(''); // Reset recipeInstructions when showing ingredients
          setNutritionalFacts(null); // Reset nutritionalFacts when showing ingredients
        })
        .catch(error => console.log(error));
    } else if (value === 'instructions') {
      axios.get(`https://api.spoonacular.com/recipes/${recipeId}/information`, {
        params: {
          apiKey: '1b109cc6e84d4e1da2146bcf784e5700',
        }
      })
        .then(response => {
          console.log(response.data); // Log the API response
          setSelectedRecipe(response.data);
          setRecipeIngredients([]); // Reset recipeIngredients when showing instructions
          setRecipeInstructions(response.data.instructions.replace(/<[^>]+>/g, ''));
          setServings(response.data.servings);
          setReadyInMinutes(response.data.readyInMinutes);
          setDishTypes(response.data.dishTypes);
          setNutritionalFacts(response.data.summary); // Save nutritional facts to display in its own section
        })
        .catch(error => console.log(error));
    } else if (value === 'nutritionalFacts') {
      axios.get(`https://api.spoonacular.com/recipes/${recipeId}/nutritionWidget`, {
        params: {
          apiKey: '1b109cc6e84d4e1da2146bcf784e5700',
        }
      })
        .then(response => {
          console.log(response.data); // Log the API response
          setSelectedRecipe(response.data);
          setRecipeIngredients([]); // Reset recipeIngredients when showing nutritional facts
          setRecipeInstructions(''); // Reset recipeInstructions when showing nutritional facts
          setNutritionalFacts(response.data);
        })
        .catch(error => console.log(error));
    }
  };


    const CardWrapper = styled(Card)(
    ({ theme }) => ({
      margin: theme.spacing(2),
    })
  );

  return (
    <div>
      <TextField
        label="Search for recipes"
        value={searchQuery}
        onChange={handleSearchQueryChange}
      />
      <Button variant="contained" color="primary" onClick={handleSearch}>
        Search
      </Button>

      <Grid container spacing={2}>
        {recipeResults.map(recipe => (
          <Grid item xs={12} sm={6} md={4} key={recipe.id}>
            <CardWrapper>
              <CardContent>
                <Typography variant="h5" component="div">
                  {recipe.title}
                </Typography>
                <img src={recipe.image} alt={recipe.title} />
                {selectedRecipe && selectedRecipe.id === recipe.id && (
                  <div>
                    <Typography variant="subtitle1" component="div">
                      Servings: {servings}
                    </Typography>
                    <Typography variant="subtitle1" component="div">
                      Ready in Minutes: {readyInMinutes}
                    </Typography>
                    {dishTypes.map(dishType => (
                      <Chip key={dishType} label={dishType} />
                    ))}
                  </div>
                )}
                 <ToggleButtonGroup
                  value={openCardId === recipe.id ? activeToggles[recipe.id] : null}
                  exclusive
                  onChange={(_, value) => handleToggle(recipe.id,value)}
                >
                  <ToggleButton value="ingredients">
                    Ingredients
                  </ToggleButton>
                  <ToggleButton value="instructions">
                    Instructions
                  </ToggleButton>
                  <ToggleButton value="nutritionalFacts">
                    Nutritional Facts
                  </ToggleButton>
                </ToggleButtonGroup>

                {activeToggles[recipe.id] === 'ingredients' && (
                  <>
                    {/* Render ingredients content */}
                    <Typography variant="h6">Ingredients:</Typography>
                    <List>
                      {recipeIngredients.map(ingredient => (
                        <ListItem key={ingredient.id}>
                          <ListItemAvatar>
                            <Avatar alt={ingredient.name} src={`https://spoonacular.com/cdn/ingredients_100x100/${ingredient.image}`} />
                          </ListItemAvatar>
                          <ListItemText primary={ingredient.original} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}
                 {activeToggles[recipe.id] === 'instructions' && (
                  <>
                    {/* Render instructions content */}
                    <Typography variant="h6">Cooking Instructions:</Typography>
                    <List>
                      {recipeInstructions.split('\n').map((instruction, index) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <FiberManualRecord />
                          </ListItemIcon>
                          <ListItemText primary={instruction.trim()} />
                        </ListItem>
                      ))}
                    </List>
                  </>
                )}

                  {activeToggles[recipe.id] === 'nutritionalFacts' && nutritionalFacts && (
                  <>
                    {/* Render nutritional facts content */}
                    <Typography variant="h6">Nutritional Facts:</Typography>
                    <Typography variant="body2" component="div">
                      {nutritionalFacts}
                    </Typography>
                  </>
                )}
              </CardContent>
            </CardWrapper>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default RecipeFinder;