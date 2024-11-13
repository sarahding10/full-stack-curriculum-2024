import React, { useContext } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { ThemeContext } from './context/ThemeContext';
import { AppBar, Toolbar, Typography, IconButton } from '@mui/material';
import { WbSunny, NightsStay } from '@mui/icons-material';

import PokemonList from './components/PokemonList.js'
import PokemonDetail from './components/PokemonDetail.js'

function App() {

  const {theme, toggleTheme} = useContext(ThemeContext)

  return (
    <ThemeProvider theme={theme}>
      <AppBar>
        <Toolbar>
          <Typography variant='h6' sx={{flexGrow:1}}>
            Pokedex App
          </Typography>
          <IconButton onClick={toggleTheme}>
            {theme.palette.node === 'dark' ? <WbSunny/> : <NightsStay/>}
          </IconButton>
        </Toolbar>
      </AppBar>
      <Routes>
        <Route path='/' element={<PokemonList/>}/>
        <Route path='/' element={<PokemonDetail/>}/>
      </Routes>
    </ThemeProvider>
  );
}

export default App;
