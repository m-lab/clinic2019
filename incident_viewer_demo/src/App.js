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

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

var topClientIsps = require('./sample_data/top_client_isps.json');
var selectedClientIspInfo = require('./sample_data/selected_client_isp_info.json');

function onSelectedClientIspsChange(e) {
  // TODO: seems hard coded, need to double check this works for any case. Find a better way for this
  var selected_isp_id = e[3];
  alert(selected_isp_id); // gives the id of the selected isp
}

var chartId = "providers-time-series"
var colors = {na_AS11486x: "rgb(69, 160, 58)", na_AS11404: "rgb(125, 25, 125)", na_AS10774x: "rgb(225, 166, 25)"}

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

// Convert series and annotationseries dates to moment objs
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
    }

    // bind handlers
    this.toggleIncident = this.toggleIncident.bind(this);
  }
  
  toggleIncident() {
    this.setState({ hasIncident: !this.state.hasIncident });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="showIncident" onClick={this.toggleIncident}>Toggle Incident Viewer</button> 
          <div className="client-isp-selector">
            <h5>Client ISPs</h5>
            {/* TODO(amy): onChange function needs to change, right now is an empty function. This function
                will handle the updating of the dropdown. (Similar to mouse over function on graph issue).
                Note: will need to update incident index based on what selected. Also will need to populate
                dropdown with only incident ISPs (righ now showing ALL). Will also need toggle the boolean
                display incident (show incident overlay or not). Icon component also not rendering, need to
                look at. Also look at the mlab-vis-client repo to make sure we add the ? helper icon */}
            <IspSelect
              isps={topClientIsps}
              selected={selectedClientIspInfo}
              onChange={onSelectedClientIspsChange}
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
