import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import AutoWidth from 'react-auto-width';
import logo from './demo-logo-center.png';
import './App.scss';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import IspSelect from './IspSelect/IspSelect.jsx'
import * as moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chart_support/assets/base.scss';
import Icon from './Icon.jsx';
import { colorsFor } from './chart_support/color';

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

// TODO: delete unused JSON before sending a pull request
// var topClientIsps = require('./sample_data/all_isps.json'); // all ISPs for this query
var ispsWithIncidents = require('./sample_data/isps_with_incidents.json'); // ISPs with incidents for this query

var chartId = "providers-time-series"

// Reading and loading JSON files with sample ISP data
var clientIspTimeSeriesData = require('./sample_data/newDemoData.json');

// Reading and loading JSON files with sample Incident data
const incident = require('./incidents.json');
const incidentData = incident[0]
// convert dates to moment objects
incidentData.goodPeriodStart = moment(incidentData.goodPeriodStart);
incidentData.goodPeriodEnd = moment(incidentData.goodPeriodEnd);
incidentData.badPeriodStart = moment(incidentData.badPeriodStart);
incidentData.badPeriodEnd = moment(incidentData.badPeriodEnd);

console.log("incident Data", incidentData)

const colors = colorsFor(clientIspTimeSeriesData, (d) => d.meta.id);
// var colors = {na_AS11486x: "rgb(69, 160, 58)", na_AS11404: "rgb(125, 25, 125)", na_AS10774x: "rgb(225, 166, 25)"}

// Convert series dates to moment objs
for (var isp in clientIspTimeSeriesData) {
  for (var i = 0; i < clientIspTimeSeriesData[isp].extents.date.length; i++) {
    clientIspTimeSeriesData[isp].extents.date[i] = moment(clientIspTimeSeriesData[isp].extents.date[i]);
  }
  for (var j = 0; j < clientIspTimeSeriesData[isp].results.length; j++) {
    clientIspTimeSeriesData[isp].results[j].date = moment(clientIspTimeSeriesData[isp].results[j].date);
  }
}

function onHighlightTimeSeriesDate(date) {}

var highlightTimeSeriesDate = null;

function onHighlightTimeSeriesLine(series) {}

var highlightTimeSeriesLine = undefined;

var viewMetric = {
  "formatter": undefined,  // function here is a REALLY big one, but I doubt this is causing the issue
  "label": "Download Speed", 
  "unit": "Mbps",
  "datakey": "download_speed_mbps_median"
}

//////////////////////////////////////////////////////////////////////////
// Done handling the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      hasIncident: false,
      selected_isp: null, // This is the selected ISP object
    }

    // bind handlers
    this.toggleIncident = this.toggleIncident.bind(this);
    this.onSelectedClientIspsChange = this.onSelectedClientIspsChange.bind(this);
  }

  onSelectedClientIspsChange(values) {
    var selected_isp_id;
    var valLen = values.length;
    if (valLen === 0) {
      this.setState({ selected_isp: null });
    }
    else {
      if (valLen === 1) {
        selected_isp_id = values[0];
      } else {
        selected_isp_id = values[1];
      }
  
      var json_obj = {};
      for (var obj in ispsWithIncidents) {
        if (ispsWithIncidents[obj].client_asn_number === selected_isp_id) {
          json_obj = ispsWithIncidents[obj];
        }
      }
      this.setState({ selected_isp: json_obj });
      console.log(this.state.selected_isp);
    }
  }
  
  toggleIncident() {
    this.setState({ hasIncident: !this.state.hasIncident });
  }

  render() {
    var selected = this.state.selected_isp ? [this.state.selected_isp] : [];
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="showIncident" onClick={this.toggleIncident}>
            <Icon
              name="exclamation"
              className=""
              onClick={undefined}
            />
            <span> </span>
            Incident Found</button> 
          <div className="isp-select-row">
            <IspSelect
              isps={ispsWithIncidents}
              selected={selected}
              onChange={this.onSelectedClientIspsChange}
              placeholder="Show Incident"
            />
          </div>
          <Row className="Chart-row">
            <AutoWidth>
              <LineChartWithCounts
                id={chartId}
                hasIncident={this.state.hasIncident}
                incidentData={incidentData}
                colors={colors}
                series={clientIspTimeSeriesData}
                onHighlightDate={onHighlightTimeSeriesDate}
                highlightDate={highlightTimeSeriesDate}
                onHighlightLine={onHighlightTimeSeriesLine}
                highlightLine={highlightTimeSeriesLine}
                yFormatter={viewMetric.formatter}
                xKey="date"
                yAxisLabel={viewMetric.label}
                yAxisUnit={viewMetric.unit}
                yKey={viewMetric["datakey"]}
              />
            </AutoWidth>
          </Row>
        </header>
      </div>
    );
  }
}
export default App;
