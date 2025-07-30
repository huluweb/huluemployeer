"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup, Polyline, MapContainerProps } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
});

// Define types
interface Location {
  id: number | string;
  name: string;
  position: [number, number];
  type?: string;
  isGeocoded?: boolean;
  fullName?: string;
}

interface Route {
  toId: number | string;
  toName: string;
  from: [number, number];
  to: [number, number];
  distance: number;
  duration: number;
  geometry: {
    coordinates: [number, number][];
    type: string;
  };
  color: string;
}

interface Suggestion extends Location {
  isGeocoded?: boolean;
  fullName?: string;
}

// Nominatim API response type
interface NominatimResult {
  place_id: string;
  display_name: string;
  lat: string;
  lon: string;
}

// Custom icons
const hotelIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/739/739278.png",
  iconSize: [30, 30],
  popupAnchor: [0, -15],
});

const pharmacyIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/806/806032.png",
  iconSize: [30, 30],
  popupAnchor: [0, -15],
});

const landmarkIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [30, 30],
  popupAnchor: [0, -15],
});

const searchedLocationIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/1671/1671069.png",
  iconSize: [35, 35],
  popupAnchor: [0, -15],
});

const ADDIS_LOCATIONS: Location[] = [
  { id: 1, name: "Legehar", position: [9.0227, 38.7469], type: "landmark" },
  { id: 2, name: "Cherkos", position: [9.0365, 38.7523], type: "landmark" },
  { id: 3, name: "Bole", position: [8.9806, 38.7998], type: "landmark" },
  { id: 4, name: "Sheraton Addis", position: [9.0104, 38.7575], type: "hotel" },
  { id: 5, name: "Bole Pharmacy", position: [8.9843, 38.7988], type: "pharmacy" },
  { id: 6, name: "Meskel Square", position: [9.0068, 38.7567], type: "landmark" },
  { id: 7, name: "Hilton Hotel", position: [9.0245, 38.7632], type: "hotel" },
  { id: 8, name: "St. Gabriel Pharmacy", position: [9.0351, 38.7701], type: "pharmacy" },
];

const OSRM_BASE_URL = "https://router.project-osrm.org/route/v1/driving";
const NOMINATIM_API_URL = "https://nominatim.openstreetmap.org/search";

// Function to generate distinct colors for each route
const getColorForRoute = (id: number | string) => {
  const colors = [
    "#FF6633",
    "#FFB399",
    "#FF33FF",
    "#FFFF99",
    "#00B3E6",
    "#E6B333",
    "#3366E6",
    "#999966",
    "#99FF99",
    "#B34D4D",
    "#80B300",
    "#809900",
    "#E6B3B3",
    "#6680B3",
    "#66991A",
    "#FF99E6",
    "#CCFF1A",
    "#FF1A66",
    "#E6331A",
    "#33FFCC",
  ];
  return colors[Number(id) % colors.length];
};

const MapWithSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [searchedLocation, setSearchedLocation] = useState<Location | null>(null);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const mapRef = useRef<L.Map | null>(null);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Get icon based on location type
  const getIcon = (type?: string) => {
    switch (type) {
      case "hotel":
        return hotelIcon;
      case "pharmacy":
        return pharmacyIcon;
      case "searched":
        return searchedLocationIcon;
      default:
        return landmarkIcon;
    }
  };

  // Search any location in Addis Ababa using Nominatim
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return [];

    try {
      setIsGeocoding(true);
      const response = await axios.get<NominatimResult[]>(NOMINATIM_API_URL, {
        params: {
          q: `${query}, Addis Ababa, Ethiopia`,
          format: "json",
          limit: 5,
          countrycodes: "et",
          bounded: 1,
          viewbox: "38.70,9.00,38.85,8.95", // Addis Ababa bounding box
        },
      });

      return response.data.map((result: NominatimResult) => ({
        id: result.place_id,
        name: result.display_name.split(",")[0],
        fullName: result.display_name,
        position: [parseFloat(result.lat), parseFloat(result.lon)] as [number, number],
        isGeocoded: true,
      }));
    } catch (error) {
      console.error("Geocoding error:", error);
      setError("Failed to search locations. Please try again.");
      return [];
    } finally {
      setIsGeocoding(false);
    }
  }, []);

  // Debounce search input
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSuggestions([]);
      return;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      // First check local locations
      const localMatches = ADDIS_LOCATIONS.filter((loc) =>
        loc.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      // Then search OSM
      const geoResults = await searchLocation(searchTerm);

      // Combine results
      const allSuggestions = [
        ...localMatches,
        ...(geoResults as Suggestion[]).filter(
          (geo) => !localMatches.some((local) => local.name === geo.name)
        ),
      ];

      setSuggestions(allSuggestions);
    }, 500);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [searchTerm, searchLocation]);

  // Fetch routes from OSRM API
  const fetchRoutes = useCallback(async (fromPosition: [number, number]) => {
    if (!fromPosition) return;

    setLoading(true);
    setError(null);
    setRoutes([]);

    try {
      const routePromises = ADDIS_LOCATIONS.filter(
        (loc) =>
          loc.position[0] !== fromPosition[0] || loc.position[1] !== fromPosition[1]
      ).map(async (location) => {
        try {
          const from = fromPosition;
          const to = location.position;
          const url = `${OSRM_BASE_URL}/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;

          const response = await axios.get(url);
          const data = response.data;

          if (data.routes && data.routes.length > 0) {
            const route = data.routes[0];
            return {
              toId: location.id,
              toName: location.name,
              from,
              to,
              distance: route.distance,
              duration: route.duration,
              geometry: route.geometry,
              color: getColorForRoute(location.id),
            } as Route;
          }
          return null;
        } catch (err) {
          console.error(`Error fetching route to ${location.name}:`, err);
          return null;
        }
      });

      const results = await Promise.all(routePromises);
      setRoutes(results.filter((route) => route !== null) as Route[]);
    } catch (err) {
      setError("Failed to fetch routes. Please try again later.");
      console.error("Routing error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle location selection
  const handleLocationSelect = useCallback(
    (location: Location | Suggestion) => {
      const newLocation = {
        id: location.id,
        name: location.name,
        position: location.position,
        type: location.type || "searched",
      } as Location;

      setSearchedLocation(newLocation);
      fetchRoutes(location.position);

      if (mapRef.current) {
        mapRef.current.flyTo(location.position as L.LatLngExpression, 15);
      }
    },
    [fetchRoutes]
  );

  // Handle search button click
  const handleSearchClick = useCallback(async () => {
    if (searchTerm.trim() === "") return;

    setLoading(true);
    setError(null);

    // First check local locations
    const localMatch = ADDIS_LOCATIONS.find(
      (loc) => loc.name.toLowerCase() === searchTerm.toLowerCase()
    );

    if (localMatch) {
      handleLocationSelect(localMatch);
      setLoading(false);
      return;
    }

    // Then search OSM
    try {
      const results = (await searchLocation(searchTerm)) as Suggestion[];
      if (results.length > 0) {
        handleLocationSelect(results[0]);
      } else {
        setError("Location not found. Please try another name.");
      }
    } catch (err) {
      setError("Failed to search location. Please try again.");
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, handleLocationSelect, searchLocation]);

  // Handle suggestion click
  const handleSuggestionClick = (location: Suggestion) => {
    setSearchTerm(location.name);
    handleLocationSelect(location);
  };

  return (
    <div className="relative w-full h-[600px]">
      {/* Search Container */}
      <div className="absolute top-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg w-80">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search any location in Addis Ababa"
            className="w-full p-3 border text-gray-500 border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          />

          <button
            onClick={handleSearchClick}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white p-1 px-3 rounded-md hover:bg-blue-700 flex items-center"
            disabled={loading || isGeocoding}
          >
            {loading || isGeocoding ? (
              <svg
                className="animate-spin h-4 w-4 mr-2 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : null}
            {loading || isGeocoding ? "Searching..." : "Search"}
          </button>
        </div>

        {error && <div className="mt-2 text-red-500 text-sm">{error}</div>}

        {suggestions.length > 0 && (
          <ul className="mt-2 border border-gray-200 rounded-md max-h-60 overflow-y-auto">
            {suggestions.map((location) => (
              <li
                key={location.id}
                onClick={() => handleSuggestionClick(location)}
                className="p-2 hover:bg-gray-100 cursor-pointer flex items-start"
              >
                <span className="mr-2 mt-1">
                  {location.isGeocoded
                    ? "🌍"
                    : location.type === "hotel"
                    ? "🏨"
                    : location.type === "pharmacy"
                    ? "💊"
                    : "📍"}
                </span>
                <div>
                  <div className="font-medium text-slate-600">{location.name}</div>
                  {location.isGeocoded && (
                    <div className="text-xs text-slate-700 mt-1">
                      {location.fullName?.split(",").slice(1, 3).join(",")}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Map Container */}
      <MapContainer
        center={[9.0054, 38.7636]}
        zoom={13}
        className="w-full h-full"
        ref={mapRef}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Location Markers (excluding searched location if it exists) */}
        {ADDIS_LOCATIONS.filter(
          (location) =>
            !searchedLocation ||
            location.position.toString() !== searchedLocation.position.toString()
        ).map((location) => (
          <Marker
            key={location.id}
            position={location.position as L.LatLngExpression}
            icon={getIcon(location.type)}
          >
            <Popup>
              <div className="min-w-[200px]">
                <h3 className="font-bold text-lg text-gray-500">{location.name}</h3>
                <p className="capitalize text-gray-600">{location.type}</p>

                {/* Show distance/time if available */}
                {searchedLocation &&
                  routes.find((route) => route.toId === location.id) && (
                    <div className="mt-2">
                      <p className="text-sm">
                        <span className="font-medium">Distance:</span>{" "}
                        {(routes.find((route) => route.toId === location.id)!.distance / 1000).toFixed(2)} km
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Travel time:</span>{" "}
                        {Math.round(routes.find((route) => route.toId === location.id)!.duration / 60)} min
                      </p>
                    </div>
                  )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Searched Location Marker */}
        {searchedLocation && (
          <Marker
            position={searchedLocation.position as L.LatLngExpression}
            icon={getIcon(searchedLocation.type)}
          >
            <Popup>
              <div className="font-bold text-blue-600 min-w-[180px]">
                <div className="flex items-center">
                  <span className="mr-2">📍</span>
                  <span>{searchedLocation.name}</span>
                </div>
                <div className="mt-1 text-sm font-normal text-gray-600">
                  (Your Location)
                </div>
                {(searchedLocation as Suggestion).isGeocoded && (
                  <div className="mt-2 text-xs text-gray-500 italic">
                    Search provided by OpenStreetMap
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Lines with different colors */}
        {routes.map((route) => (
          <Polyline
            key={route.toId}
            positions={route.geometry.coordinates.map((coord) => [
              coord[1],
              coord[0],
            ] as [number, number])}
            color={route.color}
            weight={4}
            opacity={0.8}
          />
        ))}
      </MapContainer>

      {/* Route Color Legend */}
      {routes.length > 0 && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-white p-4 rounded-lg shadow-lg max-w-xs">
          <h3 className="font-bold mb-2 text-slate-600">Route Colors:</h3>
          <div className="flex flex-wrap gap-2">
            {routes.map((route) => (
              <div key={route.toId} className="flex items-center mr-3 mb-1">
                <div
                  className="w-4 h-4 rounded-full mr-2 text-slate-600"
                  style={{ backgroundColor: route.color }}
                ></div>
                <span className="text-xs text-slate-600">{route.toName}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {(loading || isGeocoding) && (
        <div className="absolute inset-0 z-[2000] bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-xl flex flex-col items-center">
            <svg
              className="animate-spin h-8 w-8 text-blue-600 mb-3"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <p className="text-gray-700">
              {isGeocoding ? "Searching locations..." : "Calculating routes..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapWithSearch;