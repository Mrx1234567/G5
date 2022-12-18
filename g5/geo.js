function initMap() {
    /*
    *ingresando coordenadas por defecto (lab)
    */
    var myLatLng = {lat: -33.418862, lng: -70.641766};
    /*
    *adquiere elemento donde depositar mapa
    */
    var iconos=1; 
    var map = new google.maps.Map(document.getElementById('map'), {
      center: myLatLng,
      zoom: 17
    });
    $('#traffic').click(function() {
      var trafficLayer = new google.maps.TrafficLayer();
      trafficLayer.setMap(map);
    });
    new AutocompleteDirectionsHandler(map);
    /*
    *adquiriendo localizacion en el mapa con botón encuentrame
    */
    const posicionActual = () => {
      iconos=iconos*1.00000101;
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(functionSuccess, functionError);
      }
    };
    document.getElementById('encuentrame').addEventListener('click', posicionActual);
    
    var imgMarker = 'user.png';
    var latitud, longitud;
    var functionSuccess = (position) => {
      latitud = position.coords.latitude*iconos;
      longitud = position.coords.longitude*iconos;
      var miUbicacion = new google.maps.Marker({
        position: { lat: latitud, lng: longitud },
        animation: google.maps.Animation.DROP,
        map: map,
        title: 'Hola, esoy aquí',
        icon: imgMarker,
      });
      map.setZoom(17);
      map.setCenter({ lat: latitud, lng: longitud });
    };
    var functionError = (error) => {
      alert('Tenemos un problema con encontrar tu ubicación');
    };
  }
  
  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    var originInput = document.getElementById('origin-input');
    var destinationInput = document.getElementById('destination-input');
    this.directionsService = new google.maps.DirectionsService;
    this.directionsDisplay = new google.maps.DirectionsRenderer;
    this.directionsDisplay.setMap(map);
    var originAutocomplete = new google.maps.places.Autocomplete(
      originInput, {placeIdOnly: true});
    var destinationAutocomplete = new google.maps.places.Autocomplete(
      destinationInput, {placeIdOnly: true});
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  }
  
  AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
      if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
        me.destinationPlaceId = place.place_id;
      }
      me.route();
    });
  };
  
  AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    var me = this;
    this.directionsService.route({
  
      origin: {'placeId': this.originPlaceId},
      destination: {'placeId': this.destinationPlaceId},
      travelMode: this.travelMode
    }, function(response, status) {
      if (status === 'OK') {
        $('#ruta').click(() => {
   
          /*
          var latitude1 = 39.46;
          var longitude1 = -0.36;
          var latitude2 = 40.40;
          var longitude2 = -3.68;
          var distance = google.maps.geometry.spherical.computeDistanceBetween(new google.maps.LatLng(latitude1, longitude1), new google.maps.LatLng(latitude2, longitude2));     
          alert('Distance: '+distance/1000+' Kms')
          */
  
          var point = response.routes[ 0 ].legs[ 0 ];
          //alert( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
          texto= 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' ;
          distance=point.distance.text;
          var precio = distance.substring(0,distance.length-3)*1000;
          var precio = Intl.NumberFormat('es-419').format(precio);
          pagar=distance+ ' $'+ precio;
          //alert(texto)
          //alert( 'Estimated travel time: ' + point.duration.text + ' (' + point.distance.text + ')' );
  
      
          if ($('#origen').val() === '') {
            alert('Debes ingresar una ruta');
          } else {
            me.directionsDisplay.setDirections(response);
            $('#origin-input').val('Estimated travel time: ' + point.duration.text);
            $('#destination-input').val(pagar);
          }
        });
      } else {
        window.alert('Se ha producido un error en la solicitud de ' + status);
      }
    });
  };
  
  function handleLocationError(browserHasGeolocation, infoWindow, pos) {
    infoWindow.setPosition(pos);
    infoWindow.setContent(browserHasGeolocation ?
      'Error: The Geolocation service failed.' :
      'Error: Your browser doesn\'t support geolocation.');
  };