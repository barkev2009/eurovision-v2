import React from 'react';
import './App.css';
import Header from './features/header/Header';
import EntriesList from './features/ratings/EntriesList';

function App() {
  return (
    <div className="App">
      <Header />
      <EntriesList />
    </div>
  );
}

export default App;
