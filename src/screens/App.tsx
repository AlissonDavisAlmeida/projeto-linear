import React from 'react';
import Header from '../components/Header';
import './App.css';
import PageProdutos from './pageProdutos/PageProdutos';


function App() {



  return (
    <div className={`App `}>
      <Header/>
      <PageProdutos/>
    </div>
  );
}

export default App;
