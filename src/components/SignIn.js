import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import firebaseConfig from '../firebaseConfig';
import { useNavigate } from 'react-router-dom';
import { Button, TextField, Typography, Container, Box } from '@mui/material';

const app = initializeApp(firebaseConfig); // Initialize Firebase app
const auth = getAuth(app); // Get the auth instance

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isSigningUp, setIsSigningUp] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignIn = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Handle successful sign-in (e.g., redirect to user dashboard)
      navigate('/home');
    } catch (error) {
      console.log(error);
      setError('Invalid email or password. Please try again.');
      // Handle sign-in error (e.g., display error message)
    }
  };

  const handleSignUp = async (displayName, onSignUpSuccess) => {
    if (isSigningUp) {
      try {
        // Perform sign-up with display name
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        await updateProfile(user, { displayName });
        // Call the callback function to notify the parent component of the successful sign-up
        onSignUpSuccess(displayName);
      } catch (error) {
        console.log(error);
        setError('Error creating user. Please try again.');
        // Handle sign-up error (e.g., display error message)
      }
    } else {
      // Toggle the sign-up mode
      setIsSigningUp(true);
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h5">{isSigningUp ? 'Sign Up' : 'Sign In'}</Typography>
        {isSigningUp && (
          <TextField
            margin="normal"
            required
            fullWidth
            label="Display Name"
            type="text"
            variant="outlined"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
        )}
        <TextField
          margin="normal"
          required
          fullWidth
          label="Email"
          type="email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          label="Password"
          type="password"
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && (
          <Typography variant="body2" color="error" align="center">
            {error}
          </Typography>
        )}
        <Button
          fullWidth
          variant="contained"
          color="primary"
          onClick={isSigningUp ? handleSignUp : handleSignIn}
        >
          {isSigningUp ? 'Sign Up' : 'Sign In'}
        </Button>
        <Button
          fullWidth
          variant="text"
          color="primary"
          onClick={() => setIsSigningUp(!isSigningUp)}
        >
          {isSigningUp ? ' Sign In' : 'Sign Up'}
        </Button>
      </Box>
    </Container>
  );
};

export default SignIn;