// Adding tile layers
var streetmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

var darkmap = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/dark-v10',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: API_KEY
});

var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [streetmap, darkmap]
   });

// Create a baseMaps object
var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

// Create on overlays object for layers that go on map
var tectonicplates = new L.LayerGroup();  
var overlays = {
    "Tectonic Plates": tectonicplates
    // Earthquakes: earthquakes
  };
  
  // Then we add a control to the map that will allow the user to change which
  // layers are visible.
  L.control
    .layers(baseMaps, overlays)
    .addTo(map);


d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson", function(feature) {

    function circleStyle(feature) {
        return {
            opacity: 1,
            fillOpacity: 1,
            fillColor: getColor(feature.properties.mag),
            color: "#000000",
            radius: getRadius(feature.properties.mag),
            stroke: true,
            weight: 0.5
        };
    }

    // This function determines the radius of the earthquake marker based on its magnitude.
    // Earthquakes with a magnitude of 0 were being plotted with the wrong radius.
    function getRadius(magnitude) {
        if (magnitude === 0) {
            return 1;
        }
        return magnitude * 4;
    }

    function getColor(magnitude) {
        switch (true) {
            case magnitude > 5:
                return "#ea2c2c";
            case magnitude > 4:
                return "#ea822c";
            case magnitude > 3:
                return "#ee9c00";
            case magnitude > 2:
                return "#eecc00";
            case magnitude > 1:
                return "#d4ee00";
            default:
                return "#98ee00";
        }
    }

    L.geoJson(feature, {
        onEachFeature: function(feature, layer) {
            layer.bindPopup("<h3>" + feature.properties.place + "</h3><hr><h3>Magnitude " + feature.properties.mag + "</h3>");
        },

        style: circleStyle,

        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng);
        }
    }).addTo(map);
    
    
    // Legend start here
    var legend = L.control({ position: "bottomright" })


    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "legend");

        var legendInfo = "<h1>Magnitude of Earthquakes</h1>"


        var grades = [0, 1, 2, 3, 4, 5]

        var colors = [
            "#98ee00",
            "#d4ee00",
            "#eecc00",
            "#ee9c00",
            "#ea822c",
            "#ea2c2c"
        ];

        // for loop to match each grade with each color
        for (var i = 0; i < grades.length; i++) {
            div.innerHTML += "<i style='background: " + colors[i] + "'></i> " + grades[i] + (grades[i + 1] ? "&ndash;" + grades[i + 1] + "<br>" : "+");
        }
        return div;
    }
    legend.addTo(map);

    d3.json("https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json", function(data) {
        L.geoJson(data, {
            color: "orange",
            weight: 2
        }).addTo(tectonicplates)
        tectonicplates.addTo(map);
    })
});