


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
      
        // Create an overlayMaps object to hold the earthquakes layer
        var overlayMaps = {
          "Earthquake Magnitude": earthquakes
        };
      
        // Create the map object with options
        var map = L.map("map-id", {
          center: [39.5501, -105.7821],
          zoom: 4,
          layers: [lightmap, earthquakes]
        });
      
        // Create a layer control, pass in the baseMaps and overlayMaps. Add the layer control to the map
        L.control.layers(baseMaps, overlayMaps, {
          collapsed: false
        }).addTo(map);

        //used to add colors to the legend
        function legendColor(d) {
            return d > 5 ? '#993404' :
                   d > 4  ? '#d95f0e' :
                   d > 3  ? '#fe9929' :
                   d > 2  ? '#fec44f' :
                   d > 1  ? '#fee391' :
                            '#ffffd4';
                    
                 
        }
        
        //add a legend that displays magnitude ranges and their associated color
        var legend = L.control({position: 'bottomright'});
    
        legend.onAdd = function (map) {
    
            var div = L.DomUtil.create('div', 'info legend'),
                mag_range = [0, 1, 2, 3, 4, 5],
                labels = [];
    
        // loop through our density intervals and generate a label with a colored square for each interval
            for (var i = 0; i < mag_range.length; i++) {
             div.innerHTML +=
                    '<i style="background:' + legendColor(mag_range[i] + 1) + '"></i> ' +
                    mag_range[i] + (mag_range[i + 1] ? '&ndash;' + mag_range[i + 1] + '<br>' : '+');
        }
    
            return div;
    };
    //add legend to map
    legend.addTo(map);
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

      
        
            //circle radius size calculated based on magnitude
            var circle_size = mag*10000;
            
            //assign a color (with the help of https://colorbrewer2.org/) based on magnitude value. Colors are darker for larger magnitudes
            var color = '';

            if (mag >= 5) {
                color = '#993404';
            } else if (mag >= 4 ) {
                color = '#d95f0e';
            } else if (mag >= 3) {
                color = '#fe9929';
            } else if (mag >= 2) {
                color = '#fec44f';
            } else if (mag >= 1) {
                color = '#fee391';
            } else {
                color = '#ffffd4'
            }

            //add a circle for the earthquke that's size and color are based off of the magnitude.
            //bind the circle to a popup that displays the location name and mah=gnitude
            var quake_marker = L.circle([lat, long], {
                color: color,
                fillColor: color,
                fillOpacity: 0.5,
                radius: circle_size

            })
            .bindPopup("<h3>" + place + "<h3><h3>Magnitude: " + mag + "</h3>");


       
        // Add the circle to the quake_markers array
            quake_markers.push(quake_marker);
        }
      
        // Create a layer group made from the quake marker array, pass it into the createMap function
        createMap(L.layerGroup(quake_markers));
      }
      
      
      // Perform an API call to the USGS API to get earthqake geojson information. Call createMarkers when complete
      d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson", createMarkers);
      