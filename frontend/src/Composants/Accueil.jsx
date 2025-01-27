import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import '../Css/Accueil.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const Accueil = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [userLocation, setUserLocation] = useState([45.5017, -73.5673]); // Montréal par défaut
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredRestaurants, setFilteredRestaurants] = useState([]);
  const [autocompleteResults, setAutocompleteResults] = useState([]);

  useEffect(() => {
    const fetchRestaurants = async () => {
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](45.4017,-73.7173,45.6017,-73.4673););out body;`;
      const response = await fetch(url);
      const data = await response.json();
      const venues = data.elements;
      setRestaurants(venues);
      setFilteredRestaurants(venues);
    };
    fetchRestaurants();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.length >= 3) {
      const results = restaurants.filter((restaurant) =>
        restaurant.tags && restaurant.tags.name && restaurant.tags.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredRestaurants(results);
      fetchAutocompleteResults(query);
    } else {
      setFilteredRestaurants(restaurants);
      setAutocompleteResults([]);
    }
  };

  const fetchAutocompleteResults = async (query) => {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${query},Montreal&format=json&addressdetails=1&limit=5`);
      const data = await response.json();
      setAutocompleteResults(data);
    } catch (error) {
      console.error('Erreur de recherche:', error);
    }
  };

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
          />

          {autocompleteResults.length > 0 && (
            <ul className="list-group">
              {autocompleteResults.map((result, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSearchChange({ target: { value: result.display_name } })}
                >
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}

          <div className="mt-3">
            <label htmlFor="restaurantType" className="form-label">Filtrer par type de restaurant:</label>
            <input
              type="text"
              id="restaurantType"
              className="form-control"
              placeholder="Ex: Pizza"
              onChange={(e) => setFilteredRestaurants(restaurants.filter(r => r.tags.name && r.tags.name.toLowerCase().includes(e.target.value.toLowerCase())))}
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
      </div>
    </div>
  );
};

export default Accueil;
