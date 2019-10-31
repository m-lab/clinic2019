import React from 'react';
import logo from './mlab-logo.png';
import './App.css';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import * as LocationPageActions from './chart_support/actions';
import * as moment from 'moment';

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

var chartId = "providers-time-series"
var colors = {nauswaseattle_AS13367x: "rgb(106, 34, 92)", nauswaseattle_AS11398x: "rgb(69, 160, 58)", nauswaseattle_AS21928: "rgb(125, 66, 25)"}

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

// moment( new Date('Oct 01, 2018 00:00:00') ).format("YYYY-MM-DD hh:mm:ss")

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
var clientIspTimeSeriesData = []
var annotationTimeSeries = []
function onHighlightTimeSeriesDate(date) {
  const { dispatch } = this.props;
  dispatch(LocationPageActions.highlightTimeSeriesDate(date));
}
var highlightTimeSeriesDate = {
  onHighlightTimeSeriesDate(date) {
    var dispatch = this.props.dispatch;

    dispatch(LocationPageActions.highlightTimeSeriesDate(date));
  }
}
function onHighlightTimeSeriesLine(series) {
  const { dispatch } = this.props;
  dispatch(LocationPageActions.highlightTimeSeriesLine(series));
 }
var highlightTimeSeriesLine = {
  onHighlightTimeSeriesLine(series) {
    var dispatch = this.props.dispatch;
    dispatch(LocationPageActions.highlightTimeSeriesLine(series));
  } 
}

var viewMetric = {
  formatter: undefined,
  label: "Download Speed", 
  unit: "Mbps",
  datakey: "download_speed_mbps_median"
}

//////////////////////////////////////////////////////////////////////////
// Done handling the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Hello M-Lab Team! Edit <code>src/App.js</code> to change this text.
        </p>
          <LineChartWithCounts
            id={chartId}
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
            yKey={viewMetric.dataKey}
          />
      </header>
    </div>
  );
}

export default App;
