import React from 'react';
import logo from './logo.svg';
import NewsModule from './Components/NewsModule';
import DataCanvas from './Components/DataCanvas';
import Navbar from './Components/Navbar';
import './App.scss';





function App() {
  return (
    <div className="app">
      <Navbar />
      <header className="app__header">
        <h1>News-From</h1>
      </header>
      <main>
        <NewsModule />
        <DataCanvas />
      </main>
      <footer className="App-footer">
      </footer>
    </div>
  );
}

export default App;
