
function initializeMap() {
    const map = L.map('map-container').setView([20.7128, 75.0060], 5); // Default center and zoom level
    var osmlayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    // Define a single layerControl variable to manage all layers
    var layerControl = L.control.layers({ 'OpenStreetMap': osmlayer }, null, { position: 'topright' }).addTo(map);
    var hurricaneTracksGeoJSON = 'Historic_Major_Hurricane_Tracks.geojson';
    var gpmGeoJSON = 'gpm_3d.20230912.geojson';

    // Load GeoJSON data from a file
    fetch(hurricaneTracksGeoJSON)
        .then(response => response.json())
        .then(geojsonData => {
        // Define a function to determine fill color based on the "precip" property
        function getColor(wmo_wind) {
            // Customize the color range based on your preferences
            return wmo_wind > 90 ? 'red' :
            wmo_wind > 70 ? 'orange' :
            wmo_wind > 50 ? 'yellow' :
                'green';
        }
            // Create a GeoJSON layer for hurricane tracks
            var hurricaneTracksLayer = L.geoJSON(geojsonData, {
                style: function (feature) {
                    return {
                        fillColor: getColor(feature.properties.wmo_wind),
                        color: 'white',
                        weight: 2,
                        opacity: 0.5,
                        fillOpacity: 0.1
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('Wind: ' + feature.properties.wmo_wind + 'm/s' + "\n" + "Track:" + feature.properties.Serial_Num);
                }
            });

            // Add the hurricaneTracksLayer to the layerControl as an overlay
            layerControl.addOverlay(hurricaneTracksLayer, 'Historic Hurricane Tracks');
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
        });
    // https://gpm.nasa.gov/data/visualizations/precip-apps
    // Load GeoJSON data from a file
    fetch(gpmGeoJSON)
        .then(response => response.json())
        .then(geojsonData => {

            function getColor(precip) {
                // Customize the color range based on your preferences
                return precip > 150 ? 'red' :
                    precip > 50 ? 'orange' :
                    precip > 1 ? 'yellow' :
                    'green';
            }
            // Create a GeoJSON layer for GPM precipitation
            var gpmLayer = L.geoJSON(geojsonData, {
                style: function (feature) {
                    return {
                        fillColor: getColor(feature.properties.precip),
                        color: 'white',
                        weight: 1,
                        opacity: 0.5,
                        fillOpacity: 0.1
                    };
                },
                onEachFeature: function (feature, layer) {
                    layer.bindPopup('Precipitation: ' + feature.properties.precip + ' mm');
                }
            });

            // Add the gpmLayer to the layerControl as an overlay
            layerControl.addOverlay(gpmLayer, 'GPM Precipitation');
        })
        .catch(error => {
            console.error('Error loading GeoJSON data:', error);
        });

    // Add a click event listener to the map
    map.on('click', function (e) {
        const lat = e.latlng.lat.toFixed(6);
        const long = e.latlng.lng.toFixed(6);

        document.getElementById('lat-input').value = lat;
        document.getElementById('long-input').value = long;
    });


}


// Call the function to initialize the map
initializeMap();