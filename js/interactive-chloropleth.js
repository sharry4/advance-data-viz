function addColor(n) {
  return  n > 5 ? "#084594" :
          n > 4 ? "#2171b5" :
          n > 3 ? "#4292c6" :
          n > 2 ? "#6baed6" :
          n > 1 ? "#9ecae1" :
          n > 0 ? "#cae1f7" :
                  "#f7fbff"
}

function style(feature) {
	return {
    fillColor: addColor(feature.properties.heritages),
    weight: 2,
    opacity: 1,
    color: "#eeeeee",
    dashArray: '3',
    fillOpacity: 0.7
  };
};

function highlightProvince(event) {
  var layer = event.target;

  layer.setStyle({
    weight: 4,
    color: "#999",
    dashArray: "",
    fillOpacity: 0.9
  });

  info.update(layer.feature.properties)


  if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
    layer.bringToFront();
  }
}

function resetHighlight(event) {
  geoJson.resetStyle(event.target);
  info.update();
}

function onEachFeature(feature, layer) {
  layer.on({
    mouseover: highlightProvince,
    mouseout: resetHighlight
  });
}


// Count provinces from each state
var provinceCount = {};

for (i=0; i < chinaHeritage.length; i++) {
  var province = chinaHeritage[i]["province"];

  if(provinceCount[province]) {
    provinceCount[province] +=1;
  } else {
    provinceCount[province] =1;
  }
}


for (i = 0; i < provinceData["features"].length; i++) {
	var province = provinceData["features"][i]["properties"]["name"];
	provinceData["features"][i]["properties"]["heritages"] = provinceCount[province] || 0;
}


var map = L.map("map").setView([38.42, 107.07],3.5);

L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
	maxZoom: 15,
	attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
}).addTo(map);


var geoJson = L.geoJson(provinceData,
  {
    style: style,
    onEachFeature: onEachFeature
  }).addTo(map);

// Add Legend
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {

    var div = L.DomUtil.create('div', 'info legend'),
        heritages = [1, 2, 3, 4, 5, 7];

    for (var i = 0; i < heritages.length; i++) {
      div.innerHTML +=
        "<span style='background:" + addColor(heritages[i] + 1) + "'></span> " +
        heritages[i] + "<br>";
    }

    return div;
};

legend.addTo(map);



// Info Box
var info = L.control();

info.onAdd = function(map) {
  this.div = L.DomUtil.create("div", "info");
  this.update();
  return this.div;
};


info.update = function(properties) {
  this.div.innerHTML = "<p>World Cultural Heritage in China</p>" + (properties ?
  "<p><strong>Province</strong>: " + properties.name +
  "<strong>Heritage:</strong> " + properties.heritages + "</p>" :
  "Hover over a state.") // option when no details showing
};

info.addTo(map);
