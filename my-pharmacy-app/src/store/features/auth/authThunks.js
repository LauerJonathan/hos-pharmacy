import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import api from './../api/apiSlice';

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', credentials);
      
      if (!response.data) {
        throw new Error('Pas de données reçues de l\'API');
      }

      const { token, data } = response.data;

      if (!data) {
        // Si data n'existe pas, essayons d'utiliser le token décodé
        const decodedToken = jwtDecode(token);
        
        return {
          token,
          user: {
            id: decodedToken.id,
            role: decodedToken.role,
            // Ajoutez d'autres champs si nécessaire
          }
        };
      }

      return {
        token,
        user: {
          id: data.id,
          firstName: data.firstName,
          lastName: data.lastName,
          role: data.role,
          email: data.email
        }
      };
    } catch (error) {
      console.error('Erreur complète:', error);
      console.error('Réponse d\'erreur:', error.response?.data);
      return rejectWithValue(
        error.response?.data?.message || 'Erreur de connexion'
      );
    }
  }
);

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Erreur lors de l\'inscription'
      );
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async () => {
    localStorage.removeItem('token');
    return null;
  }
);