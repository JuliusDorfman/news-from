import React from 'react';
import logo from './logo.svg';
import NewsModule from './Components/NewsModule';
import DataCanvas from './Components/DataCanvas';
import Navbar from './Components/Navbar';
import newsFromLogo from './Assets/news-from-logo.png';
import './App.scss';





function App() {
  return (
    <div className="app">
      <Navbar />
      <header className="app__header">
        <h1>News-From</h1>
        <div className="logo-wrapper">
          <img src={newsFromLogo} alt="news-from-logo" />
        </div>
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
