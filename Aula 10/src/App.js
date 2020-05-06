import React from 'react';
import './App.css';

import TechList from './components/TechList';

import profile from './assets/perfil.PNG'


function App() {
    return <div>
        <h1>Aula Inicial de ReactJS</h1> 
        <br /> 
        <img width="100px" height="100px" alt="perfil" src={profile}/>
        <TechList/>
    </div>
}

export default App;