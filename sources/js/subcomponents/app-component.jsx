import React, {Component} from "react";
import axios from "axios";
import {DebugTableComponent} from "./debug-table-component";

export class AppComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      'lat': 60.1,
      'lon': 24.9,
      'distance': 3,
      'has_ongoing_query': false,
      'debug_dataset': null
    };
  }
  executeQuery() {
    this.setState({'has_ongoing_query': true});
    axios.get(`https://lenkkiopas.metropolia.fi/routes/generate/round_trip` +
      `?start_coordinates=${this.state.lat},${this.state.lon}` +
      `&distance_km=${this.state.distance}`
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
              <input type="text"
                     value={this.state.lat}
                     onChange={(e) => {this.setState({'lat': e.target.value});}}/>
            </label>
            <label>
              <input type="text"
                     value={this.state.lon}
                     onChange={(e) => {this.setState({'lon': e.target.value});}}/>
            </label>
            <label>
              <input type="text"
                     value={this.state.distance}
                     onChange={(e) => {this.setState({'distance': e.target.value});}}/>
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
          {/*<!-- Results in table -format -->*/}
          <p>
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
          </p>
        </div>
        <div>
          {/*<!-- Results in table -format -->*/}
          {!this.state.debug_dataset ?
            "Submit arguments to fetch dataset"
            :
            <DebugTableComponent
              seek_distance={this.state.debug_dataset['roundtrip_points']['input_route_length_km']}
              sectors={this.state.debug_dataset['roundtrip_points']['sectors']}
            />
          }
        </div>
        <div>
          {/*<!-- Results in map -format -->*/}
        </div>
      </div>
    );
  }
}