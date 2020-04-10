var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5
  });
  
  // Adding tile layervr
var mylayer =  L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox/streets-v11',
    tileSize: 512,
    zoomOffset: -1,
    accessToken: "pk.eyJ1Ijoib3p6bW9zaXMxMjMiLCJhIjoiY2s4cXVraDZrMDZqeDNmczE0NXlxbzFuZiJ9.IN-UkP_vrzYjq0Oiav-Fig"
});

mylayer.addTo(map)
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson"

d3.json(queryUrl, function(data) {
  
  function circleStyle(feature) {
    return {
      fillOpacity: 0.75,
      color: "white",
      fillColor: "red",
      radius: getRadius(feature.properties.mag)
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


  L.geoJson(data, {
    onEachFeature: function(feature,layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "</h3>");
    },
    
    style: circleStyle,
    pointToLayer: function (feature, latlng) {
      return L.CircleMarker(latlng);
    }
  }).addTo(map);
  
});

