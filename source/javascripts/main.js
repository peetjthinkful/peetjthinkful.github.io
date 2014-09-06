$(document).ready(function(){
  $(function() {
    $('#map-container')
      .storeLocator({
        'dataType': 'json',
        'dataLocation': '/data/locations.json',
        'zoomLevel': 6,
        'defaultLoc': true,
        'defaultLat': '-36.576215',
        'defaultLng': '149.824917',
        'slideMap':false,
        'originMarker': true,
        'infowindowTemplatePath': '/templates/infowindow-description.html',
        'listTemplatePath': '/templates/location-list-description.html',
        'callbackComplete': function(){
          console.log(arguments);
          console.info('We should have completed the rendering of the map...');
        }
      });
  });
});


