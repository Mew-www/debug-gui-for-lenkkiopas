import React, {Component} from "react";

export class DebugTableComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <table className="DebugTable">
        <caption>
          Searched for {this.props.seek_distance} km route.
        </caption>
        <thead>
        <tr>
          <th>Section ID</th>
          <th>Roundtrip-node distance (if any)</th>
          <th>Route length (if any)</th>
          <th>Disposed way IDs (if any)</th>
        </tr>
        </thead>
        <tbody>
          {Object.keys(this.props.sectors).map(sector_id => {
            return (
              <tr key={sector_id}>
                <td>{sector_id}</td>
                <td>
                  {
                    this.props.sectors[sector_id] !== null
                      ? this.props.sectors[sector_id]['distance']
                      :
                      <span>
                        <span style={{'position': "relative", 'top': "-6px"}}>No point</span>
                        <i className="material-icons"
                           style={{'position': "relative", 'top': "1px", 'cursor': "help"}}
                           title="No viable round-trip point found"
                        >&#xE88F;</i>
                      </span>
                  }
                </td>
                <td>
                  {
                    this.props.sectors[sector_id] !== null
                      ?
                        this.props.sectors[sector_id].hasOwnProperty('route')
                        && typeof this.props.sectors[sector_id]['route'] !== "string"
                          ?
                          (this.props.sectors[sector_id]['route']['length_m'] + ' m')
                          :
                          this.props.sectors[sector_id]['route']
                      :
                      "No point <=> no routes"
                  }
                </td>
                <td>
                  {
                    this.props.sectors[sector_id] !== null
                      ?
                      this.props.sectors[sector_id].hasOwnProperty('route')
                      && typeof this.props.sectors[sector_id]['route'] !== "string"
                        ?
                        this.props.sectors[sector_id]['route']['disposed'].map(disposed=>disposed.id).join(", ")
                        :
                        this.props.sectors[sector_id]['route']
                      :
                      "No routes <=> No disposed"
                  }
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}