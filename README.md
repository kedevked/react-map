# REACT-MAP

## Dependencies

- [google-maps-react](https://github.com/google-map-react/google-map-react)
for Google Map API
- [sw-toolbox](https://github.com/GoogleChromeLabs/sw-precache)
for runtime caching

- [http-server](https://github.com/indexzero/http-server) for deployment on server

## API 

The project uses [Google Map](https://developers.google.com/maps/documentation/) 
especially the Maps and Places API
and [randomUser](randomuser) API

## Description

This app displays a google Map with 5 markers. A clik on each marker display
infos associated to that marker. A filter also allows the user to 
display specific markers

## Launch the project

- clone the project

git clone `https://github.com/kedevked/react-map.git`

- change the working directory 

`cd react-map`

### Development mode

Serve the project
 
 `npm start` or `yarn start`

### Production Mode

- build the project

`npm build` or `yarn build`

- serve the the build folder created by the build

`http-server -c1 build`

## Contribution

This project is done as part of the nanodegree curriculum. So no pull request will be accepted.