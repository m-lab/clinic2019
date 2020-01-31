import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import AutoWidth from 'react-auto-width';
import logo from './demo-logo-center.png';
import './App.scss';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import IspSelect from './IspSelect/IspSelect.jsx'
import HelpTip from './HelpTip/HelpTip.jsx'

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

var chartId = "providers-time-series"

// Reading and loading JSON files with sample ISP data
var clientIspTimeSeriesData = require('./sample_data/newDemoData.json');

// Reading and loading JSON files with sample Incident data
const incident = require('./sample_data/demo_incidentData.json');
const incidentData = incident
const colors = colorsFor(clientIspTimeSeriesData, (d) => d.meta.id);

const ispsWithIncidents = [];
for (var asn in incidentData) {
  const asnData = {
    "client_asn_name": asn,
    "client_asn_number": asn
  }
  ispsWithIncidents.push(asnData);
}

if (incidentData) {
  // convert dates to moment objects
  for (var asn in incidentData) {
    for (var incIndex = 0; incIndex < incidentData[asn].length; incIndex++) {
      incidentData[asn][incIndex].goodPeriodStart = moment(incidentData[asn][incIndex].goodPeriodStart);
      incidentData[asn][incIndex].goodPeriodEnd = moment(incidentData[asn][incIndex].goodPeriodEnd);
      incidentData[asn][incIndex].badPeriodStart = moment(incidentData[asn][incIndex].badPeriodStart);
      incidentData[asn][incIndex].badPeriodEnd = moment(incidentData[asn][incIndex].badPeriodEnd);
    }
  }
}

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
      this.setState({ selected_isp: json_obj }, () => { 
        console.log(this.state.selected_isp.client_asn_number);
      });
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
          <div className="upper-row">
            <button className="showIncident" onClick={this.toggleIncident}>
              <Icon
                name="exclamation"
                className="exclamation"
                onClick={undefined}
              />
              Incident Found
            </button>
            <div className="isp-select-div">
              <h5>Incident ISPs <HelpTip id="incident-isp-tip" /></h5>
              <IspSelect
                isps={ispsWithIncidents}
                selected={selected}
                onChange={this.onSelectedClientIspsChange}
                placeholder="Show Incident"
              />
            </div> 
          </div>
          <Row className="Chart-row">
            <AutoWidth>
              <LineChartWithCounts
                id={chartId}
                hasIncident={this.state.hasIncident}
                incidentData={incidentData}
                selectedASN={this.state.selected_isp ? this.state.selected_isp.client_asn_number: null }
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
