import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Accueil from "./Composants/Accueil"; // Assurez-vous que le chemin d'importation est correct
import logo from './Autre/logo.svg'; // Importation du logo
import './Css/App.css'; // Importation des styles CSS

function App() {
  return (
    <Router>
      <div className="App">


        {/* Routes de l'application */}
        <Routes>
          <Route path="/" element={<Accueil />} /> {/* Affiche la page d'accueil (avec la carte) à la racine */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
