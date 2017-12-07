import React, {Component} from "react";
import axios from "axios";
import {DebugTableComponent} from "./debug-table-component";
import {ResultsMapComponent} from "./results-map-component";

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'lat_comma_lon': "60.222,24.803",
      'distance': 4,
      'dispose_margin': 0.4,
      'has_ongoing_query': false,
      'debug_dataset': null
    };
  }
  executeQuery() {
    this.setState({'has_ongoing_query': true});
    axios.get(`https://lenkkiopas.metropolia.fi/routes/generate/round_trip` +
      `?start_coordinates=${this.state.lat_comma_lon}` +
      `&distance_km=${this.state.distance}` +
      `&dispose_margin=${this.state.dispose_margin}`
    )
      .then((response) => {
        this.setState({'debug_dataset': response.data, 'has_ongoing_query': false});
      })
      .catch((error) => {
        this.setState({'has_ongoing_query': false});
        console.log(error);
      });
  }
  render() {
    return (
      <div>
        <div>
          {/*<!-- Controls (lat, lon, distance_km) -->*/}
          <div>
            <label>
              Lat,Lon
              <input type="text"
                     value={this.state.lat_comma_lon}
                     onChange={(e) => {this.setState({'lat_comma_lon': e.target.value});}}/>
            </label>
            <label>
              Length of route
              <input type="text"
                     value={this.state.distance}
                     onChange={(e) => {this.setState({'distance': e.target.value});}}/>
            </label>
            <label>
              Dispose margin
              <input type="text"
                     value={this.state.dispose_margin}
                     onChange={(e) => {this.setState({'dispose_margin': e.target.value});}}/>
            </label>
          </div>
          <div>
            <button onClick={(e) => {this.executeQuery();}}
                    disabled={this.state.has_ongoing_query}>
              Execute
            </button>
          </div>
        </div>
        <div>
        {/*<!-- Status -->*/}
          {this.state.has_ongoing_query ?
            <span>
              Processing . . .

              <i className="material-icons spinning"
                 style={{'position': "relative", 'top': "4px"}}
              >&#xE028;</i>
            </span>
            :
            <span>Stand by</span>
          }
        </div>
        <div>
          {/*<!-- Results in table -format -->*/}
          {!this.state.debug_dataset ?
            "Waiting dataset for table results"
            :
            <DebugTableComponent
              seek_distance={this.state.debug_dataset['roundtrip_points']['input_route_length_km']}
              sectors={this.state.debug_dataset['roundtrip_points']['sectors']}
            />
          }
        </div>
        <div>
          {/*<!-- Results in map -format -->*/}
          {!this.state.debug_dataset ?
            "Waiting dataset for map results"
            :
            <ResultsMapComponent
              input_latlon={this.state.debug_dataset['start']['input'].split(',')}
              center_latlon={this.state.debug_dataset['start']['nearest_point'].split(',')}
              sector_points_latlons={Object.keys(this.state.debug_dataset['roundtrip_points']['sectors'])
                .map((sector_key) => {
                  return this.state.debug_dataset['roundtrip_points']['sectors'][sector_key];
                })
                .filter(sector => sector != null)
                .map(sector => [sector['lat'], sector['lon']])
              }
              routes={this.state.debug_dataset.routes}
            />
          }
        </div>
      </div>
    );
  }
}