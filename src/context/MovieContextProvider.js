import React, {createContext, useContext, useReducer} from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';

export const movieContext = createContext();
export const useMovies = () => useContext(movieContext);

const MOVIE_API = 'http://localhost:3000/movies'

const INIT_STATE = {
  movies: [],
  movieDetails: null
};

const reducer = (state=INIT_STATE, action) => {
  switch(action.type){
      case 'GET_MOVIES':
          return {...state, movies: action.payload}
      case 'GET_MOVIE_DETAILS':
          return {...state, movieDetails: action.payload}
      default:
          return state;
  };
};

const MovieContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    const navigate = useNavigate();

    const location = useLocation();

      //get all movies
      const getMovies = async () => {
        const { data } = await axios(`${MOVIE_API}/${window.location.search}`);
        dispatch({
            type: 'GET_MOVIES',
            payload: data
        })
    }

     //add
     const addMovie = async (newProduct) => {
      await axios.post(MOVIE_API, newProduct);
      getMovies();
  };

  //delete
  const deleteMovie = async (id) => {
    await axios.delete(`${MOVIE_API}/${id}`);
    getMovies();
  }

  //update/details
  const getMovieDetails = async (id) => {
    const { data } = await axios(`${MOVIE_API}/${id}`);
    dispatch({
        type: 'GET_MOVIE_DETAILS',
        payload: data
    });
  };

  const saveEditedMovie = async (newProduct) => {
    await axios.patch(`${MOVIE_API}/${newProduct.id}`, newProduct);
    getMovies();
  }

  const values = {
    addMovie,
    getMovies,
    deleteMovie,
    getMovieDetails,
    saveEditedMovie,
    // fetchByParams,

    movies: state.movies,
    movieDetails: state.movieDetails
};

  return (
    <movieContext.Provider value={values}>
        { children }
    </movieContext.Provider>
  )
}

export default MovieContextProvider