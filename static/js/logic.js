d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson", function(json_data) {
	 
var earthquake_data = json_data.features;
var Features_Info = L.geoJSON(earthquake_data,{
					onEachFeature: function(Data,layer){
						layer.bindPopup(`<h2> <center>${Data.properties.title} </center></h2>\
						<hr><h3>Magnitude : ${Data.properties.mag} ${Data.properties.magType}</h3>\
						<h3>Location : ${Data.properties.place}</h3>\
						<h3>Title : ${Data.properties.type}</h3>\
						<hr><h4> Time : ${new Date(Data.properties.time)}</h4>`);
					},
					pointToLayer:function(Data,latlng){
						return new L.circle(latlng,{
							radius: Data.properties.mag * 27000,
							fillColor: Colour(Data.properties.mag),
							fillOpacity:.7,
							stroke:false,
						})
					}
				});

var lightmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/light-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "Map data &copy; <a href=\"http://openstreetmap.org\">OpenStreetMap</a> contributors, <a href=\"http://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"http://mapbox.com\">Mapbox</a>",
  maxZoom: 18,
  id: "mapbox.light",
  accessToken: API_KEY
});
				
var outdoors = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/outdoors-v10/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
accessToken:API_KEY
  });
  
var satellite = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
accessToken:API_KEY
  });

var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/dark-v9/tiles/256/{z}/{x}/{y}?access_token={accessToken}",{
accessToken: API_KEY
});

var baseMaps = {
	"Outdoors": outdoors,
	"Satellite": satellite,
	"Dark Map": darkmap,
	"Light Map": lightmap
};

var TectonicPlates = new L.LayerGroup();

var overlayMaps ={
	"Earthquakes": Features_Info,
	"tectonic Plates": TectonicPlates
};

var map = L.map("map", {
	center: [41.73, -91.0059],
	zoom: 2.5,
	layers: [outdoors, Features_Info, TectonicPlates]
}); 

d3.json("https://raw.githubusercontent.com/fraxen/TectonicPlates/master/GeoJSON/PB2002_boundaries.json", function(TectonicPlatesData) {
	L.geoJSON(TectonicPlatesData,{
		color:"orange",
		weight:3
	})
	.addTo(TectonicPlates);
});

L.control.layers(baseMaps, overlayMaps, {
collapsed: false
  }).addTo(map);

// Set up legend
  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function () {
  
      var div = L.DomUtil.create('div', 'info legend'),
          Mag = [0, 1, 2, 3, 4, 5];
  
      for (var i = 0; i < Mag.length; i++) {
          div.innerHTML +=
              '<i style="background:' + Colour(Mag[i] + 1) + '"></i> ' + '&nbsp;&nbsp;' 
      + Mag[i] + (Mag[i + 1] ? ' - ' + Mag[i + 1]  +'<br>' : ' + ');
      }
  
      return div;
  };

  legend.addTo(map);				

				

});				

function Colour(d){
  return d > 5 ? "#f21414":
  d  > 4 ? "#e55b00":
  d > 3 ? "#ffae19":
  d > 2 ? "#e19865":
  d > 1 ? "#ffff75":
          "#81d681";
}
