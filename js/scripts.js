mapboxgl.accessToken =
  "pk.eyJ1IjoicGlsZG9uaWNoIiwiYSI6IlNnXzJKU0UifQ.7bFIPCuWgQkCWvrBKg7_uQ";

var industries = [
  "cityGovernment",
  "education",
  "scientificAndInnovativeActivities",
  "transport",
  "energy",
  "healthCare",
  "urbanEnvironmentAndLandscaping",
  "DHU",
  "designAndConstruction",
  "tourismAndService",
  "ITAndArtificialIntelligence",
  "urbanCommunities",
  "industrialProduction",
  "enterpriseManagement",
  "publicSafety",
  "environmentalAndTechnosphereSafety"
];

var stages = ["pilotProject", "promisingProject", "finishedProducts"];

var dModelLayer = [];
var geospatialModelLayer = [];
var virtualTourLayer = [];

var vLayers = [
  "wms-Google-satellite-layer",
  "wms-test-layer3",
  "satellite",
  "wms-Google-layer"
];

var company = "all";

var dModel = document.getElementById("dModel");
var geospatialModel = document.getElementById("geospatialModel");
var virtualTour = document.getElementById("virtualTour");

var map = new mapboxgl.Map({
  container: "map",
  style: "mapbox://styles/mapbox/streets-v11",
  zoom: 15, 
  center: [82.862601, 54.986764] 
});

function splitString(stringToSplit = "82.862601,54.986764", separator) {
  var arrayOfStrings = stringToSplit.split(separator);
  return arrayOfStrings;
}

function mapFlyTo() {
  var score = decodeURIComponent(location.search.substr(1)).split("&");
  score.splice(0, 1);
  var result = splitString(score[0], ",");
  map.flyTo({
    center: result
  });
}

var pops = false;
var popup = null;

function myMouse(x) {
  map.on("click", x, function(e) {
    var coordinates = e.features[0].geometry.coordinates.slice();
    var description = e.features[0].properties.description;

    while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
      coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
    }
    if (!pops) {
      popup = new mapboxgl.Popup()
        .setLngLat(coordinates)
        .setHTML(description)
        .addTo(map);
      pops = true;
    }

    popup.on("close", function(e) {
      popup = null;
      pops = false;
    });
  });

  map.on("mouseenter", x, function(e) {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", x, function(e) {
    map.getCanvas().style.cursor = "";
  });
}

function deleteLayers(modelLayer) {
  if (modelLayer.length > 0) {
    modelLayer.forEach(function(dlayers) {
      if (map.getLayer(dlayers)) {
        map.removeLayer(dlayers);
      }
    });
    modelLayer = [];
  }
}

function filterType(modelLayer, type) {
  deleteLayers(modelLayer);
  var icon;
  if (type === "dModel") {
      icon = "dModel-marker";
  } else if (type === "virtualTour") {
      icon = "tyr-marker";
  } else {
      icon = "custom-marker";
  }
  if (company === "all") {
    industries.forEach(function(layers) {
      stages.forEach(function(stage) {
        var dLayer = type + layers + stage;
        if (!map.getLayer(dLayer)) {
          map.addLayer({
            id: dLayer,
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": icon,
              "icon-allow-overlap": true
            },
            filter: [
              "all",
              ["in", "format", "projects"],
              ["in", "stage", stage],
              ["in", "industry", layers],
              ["in", "type", type]
            ]
          });
          modelLayer.push(dLayer);
          myMouse(dLayer);
        }
      });
    });
  } else {
    industries.forEach(function(layers) {
      stages.forEach(function(stage) {
        var dLayer = type + layers + stage;
        if (!map.getLayer(dLayer)) {
          map.addLayer({
            id: dLayer,
            type: "symbol",
            source: "places",
            layout: {
              "icon-image": icon,
              "icon-allow-overlap": true
            },
            filter: [
              "all",
              ["in", "format", "projects"],
              ["in", "stage", stage],
              ["in", "industry", layers],
              ["in", "type", type],
              ["in", "companyProjects", company]
            ]
          });
          modelLayer.push(dLayer);
          myMouse(dLayer);
        }
      });
    });
  }
}

function checkedFilter(e, filter, array) {
  if (e.target.checked) {
    array.push(filter);
  } else {
    const index = array.indexOf(filter);
    if (index > -1) {
      array.splice(index, 1);
    }
  }
}

function checkFilterType() {
  if (dModel.checked) {
    filterType(dModelLayer, "dModel");
  }
  if (geospatialModel.checked) {
    filterType(geospatialModelLayer, "geospatialModel");
  }
  if (virtualTour.checked) {
    filterType(virtualTourLayer, "virtualTour");
  }
}

function addFilterChecks (filter, filterArray) {
  document.getElementById(filter).addEventListener("change", function(e) {
    checkedFilter(e, filter, filterArray);
    checkFilterType();
  });
}

map.addControl(new mapboxgl.NavigationControl());

map.on("load", function() {
  map.addSource("places", {
    type: "geojson",
    data: places,
  });

  map.loadImage(
    "/asset/virtualTour.png",
    function(error, image) {
      if (error) throw error;
      map.addImage("tyr-marker", image);
    }
  );

  map.loadImage(
    "/asset/dmodel.png",
    function(error, image) {
      if (error) throw error;
      map.addImage("dModel-marker", image);
    }
  );

  map.loadImage(
    "/asset/geospatialModel.png",
    function(error, image) {
      if (error) throw error;
      map.addImage("custom-marker", image);
    }
  );

  map.addLayer({
    id: "wms-Google-satellite-layer",
    type: "raster",
    source: { type: "raster", tiles: ["https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}"], tileSize: 256 },
    paint: {},
    layout: {
      visibility: "none"
    }
  });

  map.addLayer({
    id: "wms-Google-layer",
    type: "raster",
    source: { type: "raster", tiles: ["https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"], tileSize: 256 },
    paint: {},
    layout: {
      visibility: "none"
    }
  });

  map.addLayer({
    id: "satellite",
    source: { type: "raster", url: "mapbox://mapbox.satellite", tileSize: 256 },
    type: "raster",
    layout: {
      visibility: "none"
    }
  });

  map.addLayer({
    id: "wms-test-layer3",
    type: "raster",
    source: { type: "raster", tiles: ["https://tile1.maps.2gis.com/tiles?x={x}&y={y}&z={z}"], tileSize: 256 },
    paint: {},
    layout: {
      visibility: "none"
    }
  });

  var layerList = document.getElementById("filter-wms");
  var inputs = layerList.getElementsByTagName("input");

  function switchLayer(layer) {
    var layerId = layer.target.id;
    if (layerId == "OSM") {
      vLayers.forEach(function(vLayer) {
        map.setLayoutProperty(vLayer, "visibility", "none");
      });
    } else {
      vLayers.forEach(function(vLayer) {
        map.setLayoutProperty(vLayer, "visibility", "none");
      });
      map.setLayoutProperty(layerId, "visibility", "visible");
    }
  }

  for (var i = 0; i < inputs.length; i++) {
    inputs[i].onclick = switchLayer;
  }

  var layersD = map.getStyle().layers;
  var labelLayerId;

  for (var i = 0; i < layersD.length; i++) {
    if (layersD[i].type === "symbol" && layersD[i].layout["text-field"]) {
      labelLayerId = layersD[i].id;
      break;
    }
  }

  map.addLayer(
    {
      id: "3d-buildings",
      source: "composite",
      "source-layer": "building",
      filter: ["==", "extrude", "true"],
      type: "fill-extrusion",
      minzoom: 15,
      paint: {
        "fill-extrusion-color": "#aaa",
        "fill-extrusion-height": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "height"]
        ],
        "fill-extrusion-base": [
          "interpolate",
          ["linear"],
          ["zoom"],
          15,
          0,
          15.05,
          ["get", "min_height"]
        ],
        "fill-extrusion-opacity": 0.6
      }
    },
    labelLayerId
  );

  filterType(dModelLayer, "dModel");
  filterType(geospatialModelLayer, "geospatialModel");
  filterType(virtualTourLayer, "virtualTour");
});

document.getElementById("сompanies").addEventListener("change", function(e) {
  company = e.target.value;
  checkFilterType();
});

industries.forEach(function (industry) {
  addFilterChecks(industry, industries);
})

stages.forEach(function (stage) {
  addFilterChecks(stage, stages);
})

dModel.addEventListener("change", function(e) {
  if (e.target.checked) {
    filterType(dModelLayer, "dModel");
  } else {
    deleteLayers(dModelLayer);
  }
});

geospatialModel.addEventListener("change", function(e) {
  if (e.target.checked) {
    filterType(geospatialModelLayer, "geospatialModel");
  } else {
    deleteLayers(geospatialModelLayer);
  }
});

virtualTour.addEventListener("change", function(e) {
  if (e.target.checked) {
    filterType(virtualTourLayer, "virtualTour");
  } else {
    deleteLayers(virtualTourLayer);
  }
});


