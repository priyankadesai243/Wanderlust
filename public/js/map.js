const mapDiv = document.getElementById("map");
const coordinates = JSON.parse(mapDiv.dataset.coordinates);

const map = L.map("map").setView([coordinates[1], coordinates[0]], 13);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
  attribution: "© OpenStreetMap contributors"
}).addTo(map);

L.marker([coordinates[1], coordinates[0]])
  .addTo(map)
  .bindPopup("Listing Location")
  .openPopup();