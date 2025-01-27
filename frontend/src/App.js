import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import de React Router
import Accueil from "./Composants/Accueil"; // Importation de ton composant Accueil
import './Css/App.css'; // Importation des styles CSS

function App() {
  return (
    <Router>
      <div className="App">


        {/* Définition des routes de l'application */}
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Accueil />} /> {/* Affiche la page d'accueil (avec la carte) à la racine */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
