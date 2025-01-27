import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../Css/Accueil.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Composant pour effectuer le zoom sur la carte
const CenterMap = ({ position }) => {
  const map = useMap();

  useEffect(() => {
    if (position) {
      map.setView(position, 15); // Zoom sur l'emplacement du restaurant
    }
  }, [position, map]);

  return null;
};

const Accueil = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState([45.5017, -73.5673]); // Montréal par défaut
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);
  const [selectedRestaurantPosition, setSelectedRestaurantPosition] = useState(null); // Nouvelle state pour la position sélectionnée
  const [selectedRestaurantReviews, setSelectedRestaurantReviews] = useState([]); // State pour les avis du restaurant
  const [selectedRestaurantRating, setSelectedRestaurantRating] = useState(null); // State pour la note du restaurant
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState(''); // State pour le filtre par type de restaurant
  const [apiKey] = useState('BomU7l-lOo83v47WpThd7TP-z6yIfgGc_IVNKd3znD0t7APSalwMwbHU2yspZyq_7CdwG--85KY-Uh25STZS8fTZQg0sy6AGPadioR3GKQLxj7jy_3Sa27EPxPyXZ3Yx'); // Stocker la clé API une seule fois ici

  useEffect(() => {
    // Fonction pour obtenir les restaurants de Montréal
    const fetchRestaurants = async () => {
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](45.4017,-73.7173,45.6017,-73.4673););out body;`;
      const response = await fetch(url);
      const data = await response.json();
      const venues = data.elements;
      setRestaurants(venues);
      setFilteredRestaurants(venues); // Affiche tous les restaurants sur la carte
    };
    fetchRestaurants();
  }, []);

  // Fonction de recherche de restaurants
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    // Si l'utilisateur tape plus de 3 caractères, on filtre les restaurants
    if (query.length >= 3) {
      const results = restaurants.filter((restaurant) =>
        restaurant.tags && restaurant.tags.name && restaurant.tags.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRestaurants(results);
      setAutocompleteResults(results.slice(0, 5));  // Affiche les 5 premiers résultats pour l'autocomplétion
    } else {
      // Si la recherche est vide ou trop courte, on vide l'autocomplétion
      setAutocompleteResults([]);
    }
  };

  // Fonction pour récupérer les restaurants aléatoires de Montréal lorsque l'utilisateur survole la barre de recherche
  const handleMouseOverSearch = () => {
    if (!searchQuery) {
      // Si la barre de recherche est vide, afficher des restaurants aléatoires de Montréal
      const randomRestaurants = restaurants.slice(0, 5); // Affiche les 5 premiers restaurants aléatoires
      setAutocompleteResults(randomRestaurants);
    }
  };

  // Fonction pour la géolocalisation
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      });
    } else {
      alert("La géolocalisation n'est pas supportée.");
    }
  };

  // Fonction pour rechercher les avis d'un restaurant
  const fetchRestaurantReviews = async (restaurantId) => {
    const url = `https://api.yelp.com/v3/businesses/${restaurantId}/reviews`;
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    setSelectedRestaurantReviews(data.reviews);
  };

  // Fonction pour rechercher un restaurant sur Yelp
  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurantPosition([restaurant.lat, restaurant.lon]);

    const fetchBusinessId = async () => {
      const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${restaurant.tags.name}&location=Montreal`;
      const response = await fetch(searchUrl, {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      });
      const data = await response.json();

      // Récupérer l'ID du restaurant trouvé et récupérer ses avis
      const business = data.businesses[0]; // Assurer qu'il y a des résultats
      if (business) {
        setSelectedRestaurantRating(business.rating);
        fetchRestaurantReviews(business.id);
      }
    };
    fetchBusinessId();
  };

  // Fonction de filtre par type de restaurant
  const handleTypeFilterChange = (e) => {
    const filter = e.target.value;
    setRestaurantTypeFilter(filter);

    // Filtrer les restaurants en fonction du type
    const filtered = restaurants.filter((restaurant) => {
      if (restaurant.tags && restaurant.tags.name) {
        return restaurant.tags.name.toLowerCase().includes(filter.toLowerCase());
      }
      return false;
    });
    setFilteredRestaurants(filtered);
  };

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Colonne de recherche à gauche */}
        <div className="col-md-4 p-4">
          <h1 className="mb-4">Restaurant Finder à Montréal</h1>

          <button onClick={handleGeolocation} className="btn btn-primary mb-3">Utiliser ma position actuelle</button>

          <input
            type="text"
            className="form-control mb-3"
            placeholder="Rechercher une adresse"
            value={searchQuery}
            onChange={handleSearchChange}
            onMouseOver={handleMouseOverSearch} // Ajout du survol pour des suggestions aléatoires
          />

          {autocompleteResults.length > 0 && (
            <ul className="list-group">
              {autocompleteResults.map((result, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleRestaurantClick(result)} // Zoom sur le restaurant sélectionné
                >
                  {result.tags.name}
                </li>
              ))}
            </ul>
          )}

          {/* Filtre par type de restaurant */}
          <div className="mt-3">
            <label htmlFor="restaurantType" className="form-label">Filtrer par type de restaurant:</label>
            <input
              type="text"
              id="restaurantType"
              className="form-control"
              placeholder="Ex: Pizza"
              value={restaurantTypeFilter}
              onChange={handleTypeFilterChange} // Mise à jour du filtre
            />
          </div>
        </div>

        {/* Colonne de la carte à droite */}
        <div className="col-md-8">
          <MapContainer center={userLocation} zoom={11} style={{ width: '100%', height: '935px' }} scrollWheelZoom={true} dragging={false}>
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <CenterMap position={selectedRestaurantPosition} />

            {filteredRestaurants.map((restaurant) => (
              <Marker
                key={restaurant.id}
                position={[restaurant.lat, restaurant.lon]}
                icon={customIcon}
                eventHandlers={{
                  click: () => handleRestaurantClick(restaurant), // Zoom sur le restaurant sélectionné
                }}
              >
                <Popup>
                  <div>
                    <h5>{restaurant.tags.name || 'Restaurant sans nom'}</h5>
                    {/* Affichage de la note et des avis du restaurant */}
                    {selectedRestaurantRating && (
                      <p><strong>Note:</strong> {selectedRestaurantRating}</p>
                    )}
                    {selectedRestaurantReviews.length > 0 ? (
                      <div>
                        <h6>Avis:</h6>
                        {selectedRestaurantReviews.map((review, idx) => (
                          <p key={idx}><strong>{review.user.name}:</strong> {review.text}</p>
                        ))}
                      </div>
                    ) : (
                      <p>Aucun avis disponible.</p>
                    )}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default Accueil;
