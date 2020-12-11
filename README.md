# Wanderlust

https://wanderlust.herokuapp.com/

Wanderlust is a web application for users who want to journal their travels.

## Description

The app allows users to record daily travels and thoughts, as well as save their GPS location and upload photos of their adventures.


## Scope of functionalities

Our Map page leverages multiple APIs - Google Maps, Google Geocoding, Open Brewery DB, Open Beer DB - and allows users to locate breweries in close proximity to them using geolocation, or they can search by Zip Code, City, or State. After the breweries are pinned on the map, the user is able to filter them by Micro, Regional, Brewpub, Large, Planning, Bar, Contract, or Proprietor.

Our Find A Beer page allows users to search for beers by name. The results are returned from the Open Beer Database API. The results that are rendered to the screen for each beer includes detailed information such as the style of beer, the brewery of which it originated, the city & state if applicable, and the country of origin. Users are also able to filter their results by style and country. Clicking on a beer will bring the user to the Map page, where it will display the beer's brewery.

## Sources

[Google Geocoding API](https://developers.google.com/maps/documentation/geocoding/overview), [Google Maps JavaScript API](https://developers.google.com/maps/documentation/javascript/overview)

## Technologies

[Bootstrap](https://getbootstrap.com/), [Axios](https://github.com/axios/axios), [JQuery](https://jquery.com/), [SweetAlert.js](https://sweetalert.js.org/)

## Status

Website is deployed to Heroku and running stable.

## Contributors

[Andrew Bell](https://github.com/fiixed)

## Future updates

May integrate with React at a later date.  Stay Tuned!

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.