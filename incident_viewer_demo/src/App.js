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
      showShading: true,
      hoverBorder: false,
      originalColors: true,
    }

    // bind handlers
    this.toggleIncident = this.toggleIncident.bind(this);
    this.toggleShading = this.toggleShading.bind(this);
    this.toggleHoverBorder = this.toggleHoverBorder.bind(this);
    this.toggleGraphShadingColors = this.toggleGraphShadingColors.bind(this);
  }
  
  // Functions for toggling states and rendering the graph
  toggleIncident() {
    this.setState({ hasIncident: !this.state.hasIncident });
  }

  toggleShading() {
    this.setState({ showShading: !this.state.showShading });
  }

  toggleHoverBorder() {
    this.setState({ hoverBorder: !this.state.hoverBorder });
  }

  toggleGraphShadingColors() {
    this.setState({ originalColors: !this.state.originalColors });
  }

  render() {
    const toggleButtonClassName = this.state.hasIncident ? "" : "Hidden-Row";
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button className="Large-Btn" onClick={this.toggleIncident}>Toggle Incident Viewer</button>
          <Row className="Chart-row">
            <AutoWidth>
              <LineChartWithCounts
                id={chartId}
                hasIncident={this.state.hasIncident}
                showShading={this.state.showShading}
                hoverBorder={this.state.hoverBorder}
                originalColors={this.state.originalColors}
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
          <Row className={toggleButtonClassName}>
            <button className="Small-Btn" onClick={this.toggleShading}>Toggle Shading</button>
            <button className="Small-Btn" onClick={this.toggleHoverBorder}>Toggle Hover Border</button>
            {this.state.showShading &&
              <button className="Small-Btn" onClick={this.toggleGraphShadingColors}>Toggle Graph Shading Colors</button>
            }
          </Row>
        </header>
      </div>
    );
  }
}
export default App;
