document.addEventListener("DOMContentLoaded", function () {

    const lng = coordinates[0];   // longitude
    const lat = coordinates[1];   // latitude

    const map = L.map("map").setView([lat, lng], 13);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors"
    }).addTo(map);

    L.marker([lat, lng]).addTo(map)
   .bindPopup(`<b>${listingTitle}</b><br>📍${listingLocation}
`)
    .openPopup();

});