import React from 'react';
import logo from './mlab-logo.png';
import './App.css';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'

// // Handle all of the discombobulated variables that the chart takes in.
var chartId = "providers-time-series"
var colors = ""
var counts = ""
var clientIspCounts = ""
var clientIspTimeSeriesData = ""
var annotationTimeSeries = ""
var highlightTimeSeriesDate = ""
var highlightTimeSeriesLine = ""
var viewMetric = ""


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
          // onHighlightDate={this.onHighlightTimeSeriesDate}
          highlightDate={highlightTimeSeriesDate}
          // onHighlightLine={this.onHighlightTimeSeriesLine}
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
