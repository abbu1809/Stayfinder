mapboxgl.accessToken = mapToken;
 
    const map = new mapboxgl.Map({
        style: 'mapbox://styles/mapbox/streets-v12', // style URL
        container: 'map', // container ID
        center: coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
        zoom: 9 // starting zoom
    }
);
    const marker = new mapboxgl.Marker({color: 'red' })
        .setLngLat(coordinates)//listings.geometry.coordinates
        .setPopup(
            new mapboxgl.Popup({ offset: 25 }).setHTML("<h5>You'll be living here</h5>"))
        .addTo(map);