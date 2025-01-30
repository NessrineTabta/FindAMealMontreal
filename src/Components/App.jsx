import '../Css/index.css'
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Import de React Router
import Accueil from '../Components/Accueil'
import Profile from "../Composants/Profile";
import ContactUs from "../Composants/ContactUs";


// function App() {
//   return (
//     <div className="flex items-center justify-center h-screen">
//       <Button onClick={() => alert('ShadCN Button Clicked!')}>
//         Click Me!
//       </Button>
//     </div>
//   );
// }



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

export default App
