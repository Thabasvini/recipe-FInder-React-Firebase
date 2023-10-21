import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link ,Navigate} from 'react-router-dom';
import { getAuth, onAuthStateChanged, signOut,updateProfile } from 'firebase/auth';
import { AppBar, Toolbar, Typography, Button, IconButton } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { styled } from '@mui/system';
import HomePage from './components/HomePage';
import SignIn from './components/SignIn';
import AIRecipePage from './components/AIRecipePage';
import RecipeDetails from './components/RecipeDetails';
import WishlistPage from './components/WishlistPage';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: '#333', // Customize the background color
}));

const StyledLink = styled(Link)`
  text-decoration: none;
  color: white; // Customize the link color
`;




const App = () => {

    const [user, setUser] = useState(null);
    const [anchorEl, setAnchorEl] = useState(null);
  
    useEffect(() => {
      const auth = getAuth();
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      });
    }, []);
  
    const handleSignOut = async () => {
      const auth = getAuth();
      try {
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.log(error);
      }
    };

    const handleSignUp = async (displayName) => {
      console.log("handleSignUp called with displayName:", displayName);

      const auth = getAuth();
      try {
        await updateProfile(auth.currentUser, { displayName });
        setUser(auth.currentUser);
      } catch (error) {
        console.log(error);
      }
    };

  return (
   
    <Router>
     <div>
        <StyledAppBar position="static">
          <Toolbar style={{ justifyContent: 'space-between' }}>
            <IconButton edge="start" color="inherit" aria-label="menu">
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div">
              <StyledLink to="/">Home</StyledLink>
            </Typography>
            <StyledLink to="/signin">
              <Button color="inherit">Sign In</Button>
            </StyledLink>
            <StyledLink to="/airecipe">
              <Button color="inherit">AI Recipe</Button>
            </StyledLink>
            {user && (
              <StyledLink to="/wishlist">
                <Button color="inherit">Wishlist</Button>
              </StyledLink>
            )}
            {user && (
        <div>
          <Button
            color="inherit"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            <AccountCircle />
            {user.displayName}
          </Button>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
          >
            <MenuItem onClick={() => setAnchorEl(null)}>
              Profile
            </MenuItem>
            <MenuItem onClick={handleSignOut}>
              Sign Out
            </MenuItem>
          </Menu>
        </div>)}
          </Toolbar>
        </StyledAppBar>
        <Routes>
          <Route exact path="/" element={<HomePage />} />
          <Route path="/signin" element={<SignIn />} />
         
          <Route path="/airecipe" element={<AIRecipePage />} />

          <Route path="/recipe/:id" element={<RecipeDetails />} />
          <Route path="/wishlist" element={user ? <WishlistPage user={user} /> : <Navigate to="/signin" />} />
          <Route
            path="*"
            element={user ? <HomePage user={user} /> : <Navigate to="/signin" />}
          />
          <Route
            path="/signin"
            element={<SignIn onSignUp={handleSignUp} />}
          />
        </Routes>
      </div>
    </Router>
   
  );
};

export default App;  