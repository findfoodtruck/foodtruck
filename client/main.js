import {
  Template
} from 'meteor/templating';
import {
  ReactiveVar
} from 'meteor/reactive-var';

import './main.html';

var MAP_ZOOM = 15;
//AIzaSyDbeFfTH7Mg6LVJIeo5LmMfl8MEnbvkQIQ google map api key
Meteor.startup(function() {
  GoogleMaps.load({
    v: '3',
    key: 'AIzaSyDbeFfTH7Mg6LVJIeo5LmMfl8MEnbvkQIQ',
    libraries: 'geometry,places'
  });
});

function toggleBounce(marker) {
  if (marker.getAnimation() !== null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(google.maps.Animation.BOUNCE);
  }
}

Template.map.onCreated(function() {
  var self = this;

  GoogleMaps.ready('map', function(map) {
    var marker;
    var image = '/images/food-truck.png';
    var myLatlng = new google.maps.LatLng(17.463882, 78.344922);;
    var marker1 = new google.maps.Marker({
      position: new google.maps.LatLng(myLatlng.lat, myLatlng.lng),
      map: map.instance,
      animation: google.maps.Animation.DROP,
      icon: image

    });
    var myLatlng2 = new google.maps.LatLng(17.46, 78.34);;
    var marker2 = new google.maps.Marker({
      position: new google.maps.LatLng(myLatlng2.lat, myLatlng2.lng),
      map: map.instance,
      animation: google.maps.Animation.DROP,
      icon: image
    });


    // Create and move the marker when latLng changes.
    self.autorun(function() {
      var latLng = Geolocation.latLng();

      if (!latLng)
        return;
      // If the marker doesn't yet exist, create it.
      if (!marker) {
        marker = new google.maps.Marker({
          position: new google.maps.LatLng(latLng.lat, latLng.lng),
          map: map.instance,
          title: 'my truck',
          animation: google.maps.Animation.DROP,
          icon: image,
          label: 'this is label'
        });
      }
      // The marker already exists, so we'll just change its position.
      else {
        marker.setPosition(latLng);
      }
      //    marker.addListener('click', toggleBounce(marker));
      marker1.setPosition(myLatlng);
      marker2.setPosition(myLatlng2);

      //  console.log(marker);
      // Center and zoom the map view onto the current position.
      //  console.log(MAP_ZOOM);
      //  console.log(marker.getPosition());
      map.instance.setCenter(marker.getPosition());
      map.instance.setZoom(MAP_ZOOM);
    });
  });
});

Template.map.helpers({
  geolocationError: function() {
    var error = Geolocation.error();
    return error && error.message;
  },
  mapOptions: function() {
    var latLng = Geolocation.latLng();
    //  console.log(latLng.lat);
    // Initialize the map once we have the latLng.
    if (GoogleMaps.loaded() && latLng) {
      return {
        center: new google.maps.LatLng(latLng.lat, latLng.lng),
        zoom: MAP_ZOOM
      };
    }
  },
  lat: function() {
    var latLng = Geolocation.latLng();
    if (!latLng) return 'not located';
    return latLng.lat;
  },
  lng: function() {
    var latLng = Geolocation.latLng();
    if (!latLng) return 'not located';
    return latLng.lng;
  }
});
