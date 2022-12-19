import React, { useState } from 'react';
import logo from './logo.svg';
import NewsModule from './Components/NewsModule';
import DataCanvas from './Components/DataCanvas';
import Navbar from './Components/Navbar';
import { gsap } from 'gsap';
import newsFromLogo from './Assets/news-from-logo.png';
import './App.scss';





function App() {

  const [toggleSwitch, setToggleSwitch] = useState(false);
  let tl = gsap.timeline();

  const handleToggleSwitch = (e: any) => {
    e.preventDefault();

    //Get the height of #newsModule and #dataCanvas-component
    let newsModuleHeight = (document.getElementById('newsModule')?.clientHeight ?? + 0);
    let dataCanvasHeight = (document.getElementById('dataCanvas-component')?.clientHeight ?? + 0) + 100;



    setToggleSwitch(!toggleSwitch);

    if (!toggleSwitch) {
      tl.to('#dataCanvas-component',
        { duration: 1, y: "-" + newsModuleHeight, ease: 'power4.out' }, 0
      )
      tl.to('#newsModule',
        { duration: 1, y: dataCanvasHeight, ease: 'power4.out' }, 0
      )
    } else {
      tl.to('#dataCanvas-component',
        { duration: 1, y: 0, ease: 'power4.out' }, 0
      )
      tl.to('#newsModule',
        { duration: 1, y: 0, ease: 'power4.out' }, 0
      )
    }
  }


  return (
    <div className="app">
      <Navbar
        toggleSwitch={(e: any) => handleToggleSwitch(e)}
        toggleSwitchState={toggleSwitch}
      />
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
