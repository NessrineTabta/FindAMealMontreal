import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import de React Router
import Accueil from "./Composants/Accueil"; // Importation de ton composant Accueil
import './Css/App.css'; // Importation des styles CSS
import Profile from "./Profile";
import ContactUs from "./ContactUs";

function App() {
  return (
    <Router>
      <div className="App">


        {/* Définition des routes de l'application */}
        <Routes>
          {/* Route pour la page d'accueil */}
          <Route path="/" element={<Accueil />} /> {/* Affiche la page d'accueil (avec la carte) à la racine */}
          <Route path="/profile" element={<Profile />}  />
          <Route path="/contactus" element={<ContactUs />}  />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
