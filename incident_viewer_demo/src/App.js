import React from 'react';
import logo from './mlab-logo.png';
import './App.css';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import * as LocationPageActions from './chart_support/actions';

// // Handle all of the discombobulated variables that the chart takes in.
var chartId = "providers-time-series"
var colors = {nauswaseattle_AS13367x: "rgb(106, 34, 92)", nauswaseattle_AS11398x: "rgb(69, 160, 58)", nauswaseattle_AS21928: "rgb(125, 66, 25)"} 
var counts = null
var clientIspCounts = []
var clientIspTimeSeriesData = []
var annotationTimeSeries = []
var onHighlightTimeSeriesDate = []
var highlightTimeSeriesDate = {
  onHighlightTimeSeriesDate(date) {
    var dispatch = this.props.dispatch;

    dispatch(LocationPageActions.highlightTimeSeriesDate(date));
  }
}
var onHighlightTimeSeriesLine = {
  onHighlightTimeSeriesLine(series) {
    var dispatch = this.props.dispatch;

    dispatch(LocationPageActions.highlightTimeSeriesLine(series));
  } 
}
var highlightTimeSeriesLine = null

// var yFormatter = { ƒ >-.1f }
var viewMetric = {
  formatter: undefined,
  label: "Download Speed",
  unit: "Mbps",
  datakey: "download_speed_mbps_median"
}

// id:  "providers-time-series"
// colors:  {nauswaseattle_AS13367x: "rgb(106, 34, 92)", nauswaseattle_AS11398x: "rgb(69, 160, 58)", nauswaseattle_AS21928: "rgb(125, 66, 25)"} 
// counts:  undefined 
// highlightCounts:  [] 
// series:  [] 
// annotationSeries:  [] 
// onHighlightDate:  ƒ onHighlightTimeSeriesDate(date) {
//     var dispatch = this.props.dispatch;

//     dispatch(LocationPageActions.highlightTimeSeriesDate(date));
// } 
// highlightDate:  undefined 
// onHighlightLine:  ƒ onHighlightTimeSeriesLine(series) {
//     var dispatch = this.props.dispatch;

//     dispatch(LocationPageActions.highlightTimeSeriesLine(series));
// } 
// highlightLine:  undefined 
// yFormatter: { ƒ >-.1f }
// xKey:  "date"
// yAxisLabel:  Download Speed 
// yAxisUnit:  Mbps 
// yKey:  "download_speed_mbps_median"


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
