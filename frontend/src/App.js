import './App.css';
import React,{useEffect} from 'react';
import Header from './component/layout/Header/Header.js';
import Footer from './component/layout/Footer/Footer.js';
import Loader from './component/layout/Loader/Loader.js';
import Home from './component/Home/Home.js';
import { BrowserRouter as Router,Route, Routes } from 'react-router-dom';
import webfont from 'webfontloader';



function App() {
  useEffect(()=> {
    webfont.load({
      google:{
        families: ["Roboto","Droid sans", "Chilanka"],
      }
    });
  }, []);
  return (
    <Router>
        <Header />
          <Routes>
            <Route exact path='/' Component={Home}/>
            <Route path= "/sad" Component={Loader}  />
          </Routes>
        <Footer />
    </Router>
  
  );
}

export default App;
