import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import AutoWidth from 'react-auto-width';
import logo from './demo-logo-center.png';
import './App.css';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import * as moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chart_support/assets/base.scss';

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

var chartId = "providers-time-series"
var colors = {naus_AS11486x: "rgb(125, 25, 125)", nauswaseattle_AS11398x: "rgb(69, 160, 58)", nauswaseattle_AS21928: "rgb(125, 66, 25)"}

var myMoment = moment({year: 2018, month: 10, day: 1}).format("YYYY-MM-DD hh:mm:ss")

var counts = [
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment},
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
  {count: 52652, upload_speed_mbps_median: 4.581, rtt_avg: 41.468, retransmit_avg: 0.017, download_speed_mbps_median: 19.241, date: myMoment },
]

var clientIspCounts = [
  {count: 21481, date: myMoment},
  {count: 21502, date: myMoment},
  {count: 23735, date: myMoment},
  {count: 19670, date: myMoment},
  {count: 18610, date: myMoment},
  {count: 19667, date: myMoment},
  {count: 22707, date: myMoment},
  {count: 23928, date: myMoment},
  {count: 23577, date: myMoment},
  {count: 16772, date: myMoment},
  {count: 5569, date: myMoment}
]

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
  }
  

  toggleIncident() {
    alert(this.state.hasIncident);
    this.setState({ hasIncident: !this.state.hasIncident });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <button onClick={this.toggleIncident.bind(this)}>Toggle Incident</button> 
          <Row className="Chart-row">
            <AutoWidth>
              <LineChartWithCounts
                id={chartId}
                hasIncident={this.state.hasIncident}
                colors={colors}
                counts={counts}
                highlightCounts={clientIspCounts}
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
