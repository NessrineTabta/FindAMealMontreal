import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet'; // Pour la création d'une icône personnalisée
import 'leaflet/dist/leaflet.css';

const Accueil = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Effect pour récupérer les restaurants à Montréal au montage du composant
  useEffect(() => {
    const fetchRestaurants = async () => {
      const url = `https://overpass-api.de/api/interpreter?data=[out:json];(node["amenity"="restaurant"](45.4017,-73.7173,45.6017,-73.4673););out body;`;
      const response = await fetch(url);
      const data = await response.json();
      const venues = data.elements;
      setRestaurants(venues);
    };

    fetchRestaurants();
  }, []);

  // Filtrer les restaurants en fonction de la catégorie (bien que ce filtre ne soit pas strictement nécessaire ici)
  const filteredRestaurants = categoryFilter === 'all'
    ? restaurants
    : restaurants.filter(restaurant => restaurant.tags && restaurant.tags.amenity === categoryFilter);

  // Créer une icône personnalisée pour les marqueurs
  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png', // Icône de Google Maps
    iconSize: [32, 32], // Taille de l'icône
    iconAnchor: [16, 32], // Point d'ancrage pour l'icône
    popupAnchor: [0, -32], // Point d'ancrage pour le popup
  });

  // Gérer le changement du filtre
  const handleFilterChange = (e) => {
    setCategoryFilter(e.target.value);
  };

  return (
    <div>
      <h1>Restaurant Finder à Montréal</h1>
      
      {/* Filtre de catégorie */}
      <div>
        <label htmlFor="category">Filtrer par catégorie:</label>
        <select id="category" onChange={handleFilterChange} value={categoryFilter}>
          <option value="all">Tous</option>
          <option value="restaurant">Restaurant</option>
        </select>
      </div>

      {/* Carte avec un style OpenStreetMap */}
      <MapContainer
        center={[45.5017, -73.5673]} // Coordonnées de Montréal
        zoom={13}
        style={{ width: '100%', height: '500px' }}
      >
        {/* Utilisation de tuiles OpenStreetMap */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marqueurs filtrés avec l'icône personnalisée */}
        {filteredRestaurants.map((restaurant) => {
          return (
            <Marker
              key={restaurant.id}
              position={[restaurant.lat, restaurant.lon]}
              icon={customIcon} // Application de l'icône personnalisée
            >
              <Popup>
                <span>{restaurant.tags.name || 'Restaurant sans nom'}</span>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Accueil;
