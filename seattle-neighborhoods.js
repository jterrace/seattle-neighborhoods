function initialize() {
  var seattle = new google.maps.LatLng(47.6097, -122.3331);
  var mapOptions = {
    zoom : 12,
    center : seattle
  }

  var map = new google.maps.Map(document.getElementById('map-canvas'),
      mapOptions);

  var kml_parser = new geoXML3.parser({
    map : map,
    processStyles: true,
    singleInfoWindow : true,
    suppressInfoWindows: true,
    afterParse : useTheData,
    zoom: false
  });
  kml_parser.parse('/data.kml');

  function useTheData(doc) {
    for (var i = 0; i < doc[0].placemarks.length; i++) {
      var placemark = doc[0].placemarks[i];
      polygonMouseover(placemark);
    }
  }

  function toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }

  var infobox_label = new InfoBox({
    content : '',
    boxStyle : {
      border : '1px solid black',
      textAlign : 'center',
      fontSize : '8pt',
      backgroundColor: '#F8F8F8',
      padding: '4',
    },
    disableAutoPan : true,
    position: seattle,
    closeBoxURL : "",
    isHidden : false,
    pane : "floatPane",
    enableEventPropagation : true
  });

  function polygonMouseover(placemark) {
    var poly = placemark.polygon;
    poly.setOptions({
      strokeColor: '#3366CC'
    });

    var text = placemark.vars.val.S_HOOD;
    if (placemark.vars.val.L_HOOD) {
      var broad = toTitleCase(placemark.vars.val.L_HOOD);
      if (broad != text && broad != 'No Broader Term') {
        text += ' (' + broad + ')';
      }
    }
    var box = document.createElement('div');
    box.textContent = text;
    box.style.cssText = 'border: 1px solid #333333; ' +
                        'margin: 0; ' +
                        'padding: 4px;';

    google.maps.event.addListener(poly, 'mouseover', function(evt) {
      poly.setOptions({
        fillColor : '#99CCFF',
        fillOpacity : 0.5,
        padding: 0
      });
      infobox_label.setContent(box);
      infobox_label.setPosition(evt.latLng);
      infobox_label.open(map);
    });

    google.maps.event.addListener(poly, 'mouseout', function(evt) {
      poly.setOptions({
        fillColor : '#ffffff',
        fillOpacity : 0
      });
      infobox_label.close();
    });
  }
}

google.maps.event.addDomListener(window, 'load', initialize);
