


    function createMap(earthquakes) {

        // Create the tile layer that will be the background of our map
        var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
          attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
          maxZoom: 18,
          id: "mapbox.light",
          accessToken: API_KEY
        });
      
        // Create a baseMaps object to hold the lightmap layer
        var baseMaps = {
          "Light Map": lightmap
        };
      
        // Create an overlayMaps object to hold the bikeStations layer
        var overlayMaps = {
          "Earthquakes 4.5+ Magnitude": earthquakes
        };
      
        // Create the map object with options
        var map = L.map("map-id", {
          center: [40.52, -34.34],
          zoom: 4,
          layers: [lightmap, earthquakes]
        });
      
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(map);
      }
      
      function createMarkers(response) {
      
        // assign features data to variable
        var earthquakes = response.features;
        console.log(earthquakes);
      
        // array to hold earthquake markers
        var quake_markers = [];
      
        // Loop through the earthquakes array
        for (var index = 0; index < earthquakes.length; index++) {
            var coordinates = earthquakes[index].geometry.coordinates;
            var long = coordinates[0];
            var lat = coordinates[1];
            var mag = earthquakes[index].properties.mag;
            var place = earthquakes[index].properties.place;

      
         // For each station, create a marker and bind a popup with the station's name
        var quake_marker = L.marker([lat, long])
         .bindPopup("<h3>" + place + "<h3><h3>Magnitude: " + mag + "</h3>");
      
        //   // Add the marker to the bikeMarkers array
         quake_markers.push(quake_marker);
        }
      
        // Create a layer group made from the bike markers array, pass it into the createMap function
        createMap(L.layerGroup(quake_markers));
      }
      
      
      // Perform an API call to the Citi Bike API to get station information. Call createMarkers when complete
      d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojson", createMarkers);
      