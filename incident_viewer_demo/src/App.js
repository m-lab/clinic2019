import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import AutoWidth from 'react-auto-width';
import logo from './demo-logo-center.png';
import './App.scss';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import * as moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chart_support/assets/base.scss';

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

var chartId = "providers-time-series"
var colors = {naus_AS11486x: "rgb(125, 25, 125)", nauswaseattle_AS11398x: "rgb(69, 160, 58)", nauswaseattle_AS21928: "rgb(125, 66, 25)"}

// Reading and loading JSON files with sample data of an incident
var clientIspTimeSeriesData = require('./sample_data/client_isp_time_series_data.json');
var annotationTimeSeries = require('./sample_data/annotation_time_series_data.json');

// Convert series and annotationseries dates to moment objs
for (var i = 0; i < clientIspTimeSeriesData.extents.date.length; i++) {
  clientIspTimeSeriesData.extents.date[i] = moment(clientIspTimeSeriesData.extents.date[i]);
  annotationTimeSeries.extents.date[i] = moment(annotationTimeSeries.extents.date[i]);
}
for (var j = 0; j < clientIspTimeSeriesData.results.length; j++) {
  clientIspTimeSeriesData.results[j].date = moment(clientIspTimeSeriesData.results[j].date);
  annotationTimeSeries.results[j].date = moment(annotationTimeSeries.results[j].date);
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
          <Row className="Chart-row">
            <AutoWidth>
              <LineChartWithCounts
                id={chartId}
                hasIncident={this.state.hasIncident}
                colors={colors}
                series={clientIspTimeSeriesData}
                annotationSeries={annotationTimeSeries}
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
