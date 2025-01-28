import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import 'leaflet/dist/leaflet.css';
import '../Css/Accueil.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  const [selectedRestaurantPosition, setSelectedRestaurantPosition] = useState(null);
  const [selectedRestaurantReviews, setSelectedRestaurantReviews] = useState([]);
  const [selectedRestaurantRating, setSelectedRestaurantRating] = useState(null);
  const [restaurantTypeFilter, setRestaurantTypeFilter] = useState('');
  const [apiKey] = useState('YOUR_API_KEY');
  const [currentPage, setCurrentPage] = useState(1); // Page courante des avis
  const [reviewsPerPage] = useState(5); // Nombre d'avis par page
  const [restaurantPhoto, setRestaurantPhoto] = useState(null); // Photo du restaurant

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
      setAutocompleteResults(results.slice(0, 5));
    } else {
      setAutocompleteResults([]);
    }
  };

  const handleMouseOverSearch = () => {
    if (!searchQuery) {
      const randomRestaurants = restaurants.slice(0, 5);
      setAutocompleteResults(randomRestaurants);
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

  const fetchRestaurantDetails = async (restaurantName) => {
    const searchUrl = `https://api.yelp.com/v3/businesses/search?term=${restaurantName}&location=Montreal`;
    const response = await fetch(searchUrl, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });
    const data = await response.json();
    const business = data.businesses[0]; // Assurer qu'il y a des résultats

    if (business) {
      setSelectedRestaurantRating(business.rating);
      setRestaurantPhoto(business.image_url); // Set restaurant's photo
      fetchRestaurantReviews(business.id);
    }
  };

  const handleRestaurantClick = (restaurant) => {
    setSelectedRestaurantPosition([restaurant.lat, restaurant.lon]);
    fetchRestaurantDetails(restaurant.tags.name);
  };

  const handleTypeFilterChange = (e) => {
    const filter = e.target.value;
    setRestaurantTypeFilter(filter);

    const filtered = restaurants.filter((restaurant) => {
      if (restaurant.tags && restaurant.tags.name) {
        return restaurant.tags.name.toLowerCase().includes(filter.toLowerCase());
      }
      return false;
    });
    setFilteredRestaurants(filtered);
  };

  const handlePaginationChange = (direction) => {
    const newPage = direction === 'next' ? currentPage + 1 : currentPage - 1;
    setCurrentPage(newPage);
  };

  const customIcon = new L.Icon({
    iconUrl: 'https://cdn.pixabay.com/photo/2014/04/03/10/03/google-309740_1280.png',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  const paginatedReviews = selectedRestaurantReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <>
      {/* ✅ Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">🍽️ Find A Meal</Link>
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item">
                <Link className="nav-link" to="/">🏠 Accueil</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link" to="/profile">👤 Mon Profil</Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-4 p-4">
            <h1 className="mb-4">Restaurant Finder à Montréal</h1>

            <button onClick={handleGeolocation} className="btn btn-primary mb-3">Utiliser ma position actuelle</button>

            <input
              type="text"
              className="form-control mb-3"
              placeholder="Rechercher une adresse"
              value={searchQuery}
              onChange={handleSearchChange}
              onMouseOver={handleMouseOverSearch}
            />

            {autocompleteResults.length > 0 && (
              <ul className="list-group">
                {autocompleteResults.map((result, index) => (
                  <li
                    key={index}
                    className="list-group-item list-group-item-action"
                    onClick={() => handleRestaurantClick(result)}
                  >
                    {result.tags.name}
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
                value={restaurantTypeFilter}
                onChange={handleTypeFilterChange}
              />
            </div>
          </div>

          <div className="col-md-8">
            <MapContainer center={userLocation} zoom={11} style={{ width: '100%', height: '935px' }} scrollWheelZoom={true}>
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
                    click: () => handleRestaurantClick(restaurant),
                  }}
                >
                  <Popup>
                    <div>
                      <h5>{restaurant.tags.name || 'Restaurant sans nom'}</h5>
                      {restaurantPhoto && (
                        <img src={restaurantPhoto} alt="Restaurant" style={{ width: '100%', height: 'auto' }} />
                      )}
                      {selectedRestaurantRating && (
                        <p><strong>Note:</strong> {selectedRestaurantRating}</p>
                      )}
                      {selectedRestaurantReviews.length > 0 ? (
                        <div>
                          <h6>Avis:</h6>
                          {paginatedReviews.map((review, idx) => (
                            <div key={idx}>
                              <div className="d-flex align-items-center">
                                {review.user.image_url && (
                                  <img src={review.user.image_url} alt={review.user.name} style={{ width: 30, height: 30, borderRadius: '50%' }} />
                                )}
                                <strong>{review.user.name}:</strong>
                              </div>
                              <p>{review.text}</p>
                            </div>
                          ))}
                          {selectedRestaurantReviews.length > reviewsPerPage && (
                            <div className="pagination">
                              <button
                                onClick={() => handlePaginationChange('prev')}
                                disabled={currentPage === 1}
                              >
                                Précédent
                              </button>
                              <span>Page {currentPage}</span>
                              <button
                                onClick={() => handlePaginationChange('next')}
                                disabled={currentPage * reviewsPerPage >= selectedRestaurantReviews.length}
                              >
                                Suivant
                              </button>
                            </div>
                          )}
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
    </>
  );
};

export default Accueil;
