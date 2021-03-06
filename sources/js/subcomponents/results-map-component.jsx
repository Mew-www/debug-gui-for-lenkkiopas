import React, {Component} from "react";
import { Map, Marker, Popup, GeoJSON, TileLayer } from 'react-leaflet';

export class ResultsMapComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    return (
      <Map center={this.props.input_latlon.map(coordinate => Number(coordinate))}
           zoom={12}
           style={{height: "600px", width: "600px"}}>
        <TileLayer
          url="https://api.mapbox.com/v4/mapbox.streets/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibmlpbmFyaWUiLCJhIjoiY2o5OG85NmFmMGo3bjJ3cW1oYWFxbHI4eSJ9.JismgnGZlsN0EPUQp7p5bQ"
          attribution="Leaflet | © MapBox © OpenStreetMap"
        />
        {([this.props.center_latlon].concat(this.props.sector_points_latlons)).map((latlon) => {
          return (
            <Marker key={`${latlon[0]}${latlon[1]}`}
                    position={latlon.map(coordinate => Number(coordinate))}>
              <Popup>
                <span>
                  ???
                </span>
              </Popup>
            </Marker>
          );
        })}
        {this.props.routes.map((route)=> {
          return (
            <GeoJSON key={route['sector']}
                     data={route['geojson']}
                     style={function(feature) {
                       return {
                         color: '#'
                                + ("00"+Math.floor(Math.random()*128).toString(16)).slice(-2)
                                + ("00"+Math.floor(Math.random()*128).toString(16)).slice(-2)
                                + ("00"+Math.floor(Math.random()*128).toString(16)).slice(-2),
                         opacity: 0.5
                       };
                     }} />
          );
        })}
        {/*
          this.props.routes.reduce((aggregated_disposed_latlons, route)=> {
            return aggregated_disposed_latlons.concat(route['disposed'])
          }, [])
            .filter((disposed, idx, arr) => {
              return arr.findIndex(d => d.id === disposed.id) === idx;
            })
            .map((unique_disposed) => {
              return (
                <Marker key={`${unique_disposed.id}`}
                        position={[unique_disposed.lat, unique_disposed.lon].map(coordinate => Number(coordinate))}>
                  <Popup>
                    <span>
                      ???
                    </span>
                  </Popup>
                </Marker>
              );
            })
        */}
        {
          this.props.routes.map((route) => {
            return (
              <GeoJSON key={route['sector']+'disposed'}
                       data={route['disposed_as_geojson']}
                       style={function(feature) {
                         return {
                           color: '#FF0000',
                           opacity: 1
                         };
                       }} />
            );
          })
        }
      </Map>
    );
  }
}