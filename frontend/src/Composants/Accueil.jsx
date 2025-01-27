import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const Accueil = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState([45.5017, -73.5673]); // Coordonnées par défaut de Montréal
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [restaurantSearchResults, setRestaurantSearchResults] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  // Chargement des restaurants à Montréal
  useEffect(() => {
    const fetchRestaurants = async () => {
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](45.4017,-73.7173,45.6017,-73.4673););out body;`;
      const response = await fetch(url);
      const data = await response.json();
      const venues = data.elements;
      setRestaurants(venues);
      setFilteredRestaurants(venues); // Initialement, afficher tous les restaurants
    };

    fetchRestaurants();
  }, []);

  // Géocodage avec Nominatim (OpenStreetMap)
  const geocodeByAddress = async (address) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${address}&format=json&addressdetails=1`);
      const data = await response.json();
      if (data.length > 0) {
        const latLng = {
          lat: data[0].lat,
          lon: data[0].lon,
        };
        return latLng;
      }
      throw new Error('Adresse non trouvée');
    } catch (error) {
      console.error('Erreur de géocodage:', error);
    }
  };

  // Fonction pour afficher les restaurants filtrés par type
  const filterByType = (type) => {
    const filtered = restaurants.filter(restaurant =>
      restaurant.tags && restaurant.tags.name && restaurant.tags.name.toLowerCase().includes(type.toLowerCase())
    );
    setFilteredRestaurants(filtered);
  };

  // Fonction de recherche de restaurants
  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 3) { // Commencer à chercher après 3 caractères
      const results = restaurants.filter(restaurant =>
        restaurant.tags && restaurant.tags.name && restaurant.tags.name.toLowerCase().includes(query.toLowerCase())
      );
      setRestaurantSearchResults(results);
      fetchAutocompleteResults(query); // Recherche d'autocomplétion
    } else {
      setRestaurantSearchResults([]);
      setAutocompleteResults([]); // Réinitialiser l'autocomplétion
    }
  };

  // Fonction d'autocomplétion
  const fetchAutocompleteResults = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query}&format=json&addressdetails=1&limit=5`);
      const data = await response.json();
      setAutocompleteResults(data);
    } catch (error) {
      console.error('Erreur de recherche d\'adresse:', error);
    }
  };

  // Sélectionner une suggestion d'adresse
  const handleSelectSuggestion = (address) => {
    setSearchQuery(address);
    geocodeByAddress(address).then(location => {
      setUserLocation([location.lat, location.lon]);
      setAutocompleteResults([]); // Réinitialiser les suggestions après sélection
    });
  };

  // Géolocalisation de l'utilisateur
  const handleGeolocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation([latitude, longitude]);
      });
    } else {
      alert("La géolocalisation n'est pas supportée par votre navigateur.");
    }
  };

  // Icône personnalisée pour les marqueurs
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="accueil-container">
      <h1>Restaurant Finder à Montréal</h1>

      <div className="search-container">
        <button onClick={handleGeolocation}>Utiliser ma position actuelle</button>
        <input
          type="text"
          placeholder="Rechercher une adresse"
          value={searchQuery}
          onChange={handleSearchChange}
        />
        {autocompleteResults.length > 0 && (
          <ul className="autocomplete-list">
            {autocompleteResults.map((result, index) => (
              <li key={index} onClick={() => handleSelectSuggestion(result.display_name)}>
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <label htmlFor="restaurantType">Filtrer par type de restaurant:</label>
        <input
          type="text"
          id="restaurantType"
          placeholder="Ex: Pizza"
          onChange={(e) => filterByType(e.target.value)}
        />
      </div>

      <MapContainer
        center={userLocation}
        zoom={13}
        style={{ width: '100%', height: '500px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {filteredRestaurants.map((restaurant) => (
          <Marker
            key={restaurant.id}
            position={[restaurant.lat, restaurant.lon]}
            icon={customIcon}
          >
            <Popup>
              <span>{restaurant.tags.name || 'Restaurant sans nom'}</span>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Accueil;
