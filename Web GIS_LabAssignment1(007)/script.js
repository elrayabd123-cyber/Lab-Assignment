// -----------------------------------
// 1. Create Map
// -----------------------------------
var map = L.map('map').setView([30.3753, 69.3451], 5);

// -----------------------------------
// 2. Basemaps
// -----------------------------------
var osm = L.tileLayer(
  'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
  { attribution: '&copy; OpenStreetMap contributors' }
);

var satellite = L.tileLayer(
  'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
  { attribution: 'Tiles &copy; Esri' }
);

osm.addTo(map);

// -----------------------------------
// 3. Load Cities GeoJSON
// -----------------------------------
var citiesLayer;

fetch('Data(Lab)/cities.geojson')
  .then(response => {
    if (!response.ok) throw new Error("cities.geojson not found (check path/filename)");
    return response.json();
  })
  .then(data => {
    citiesLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 8,
          fillColor: "red",
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<b>City:</b> " + feature.properties.name +
          "<br><b>Province:</b> " + feature.properties.province +
          "<br><b>Type:</b> " + feature.properties.type
        );
      }
    }).addTo(map);

    buildLayerControl();
  })
  .catch(error => console.error("Error loading cities.geojson:", error));

// -----------------------------------
// 4. Load Weather Stations GeoJSON
// -----------------------------------
var weatherLayer;

fetch('Data(Lab)/weather_stations.geojson')
  .then(response => {
    if (!response.ok) throw new Error("weather_stations.geojson not found (check path/filename)");
    return response.json();
  })
  .then(data => {
    weatherLayer = L.geoJSON(data, {
      pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, {
          radius: 7,
          fillColor: "blue",
          color: "black",
          weight: 1,
          opacity: 1,
          fillOpacity: 0.7
        });
      },
      onEachFeature: function (feature, layer) {
        layer.bindPopup(
          "<b>Station:</b> " + feature.properties.station +
          "<br><b>Temperature:</b> " + feature.properties.temperature + " °C" +
          "<br><b>Rainfall:</b> " + feature.properties.rainfall + " mm"
        );
      }
    }).addTo(map);

    buildLayerControl();
  })
  .catch(error => console.error("Error loading weather_stations.geojson:", error));

// -----------------------------------
// 5. Layer Control
// -----------------------------------
var layerControl;

function buildLayerControl() {
  if (!citiesLayer || !weatherLayer) return;
  if (layerControl) return;

  var baseMaps = {
    "OpenStreetMap": osm,
    "Satellite Imagery": satellite
  };

  var overlayMaps = {
    "Cities": citiesLayer,
    "Weather Stations": weatherLayer
  };

  layerControl = L.control.layers(baseMaps, overlayMaps).addTo(map);
}