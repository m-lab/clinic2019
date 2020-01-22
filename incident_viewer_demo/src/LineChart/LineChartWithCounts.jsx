import React, { PureComponent, PropTypes } from 'react';
import d3 from '../chart_support/d3';

import { colorsFor } from '../chart_support/color';
import LineChart from './LineChart.jsx';
import { multiExtent } from '../chart_support/array';
import addComputedProps from '../chart_support/addComputedProps';
import { testThreshold } from '../chart_support/constants';

/**
 * Figure out what is needed for both charts
 */
function visProps(props) {
  const { width, xExtent, xKey, idKey } = props;
  let { highlightLine, colors, annotationSeries = [], series } = props;

  series = Array.isArray(series) ? series : [series];

  // en ure annotation series is an array
  if (annotationSeries && !Array.isArray(annotationSeries)) {
    annotationSeries = [annotationSeries];
  }

  const padding = {
    right: 50,
    left: 50,
  };
  const plotAreaWidth = width - padding.left - padding.right;

  const xMin = 0;
  const xMax = plotAreaWidth;

  let xDomain = xExtent;

  if (!xDomain && series) {
    xDomain = multiExtent([...series, ...annotationSeries], d => d[xKey], oneSeries => oneSeries.results);
  }

  const xScale = d3.scaleTime().range([xMin, xMax]);
  if (xDomain) {
    xScale.domain(xDomain);
  }

  // initialize a color scale
  if (series && !colors) {
    colors = colorsFor(series, (d) => d.meta[idKey]);
  } else if (!colors) {
    colors = {};
  }

  // ensure we have the series for the highlighted line
  if (highlightLine && !series.includes(highlightLine)) {
    highlightLine = null;
  }

  // assumes the first series has the max length
  const numBins = series && series.length ? series[0].length : 1;
  return {
    series,
    padding,
    numBins,
    xScale,
    colors,
    highlightLine,
  };
}


/**
 * Chart for showing line and count together.
 */
class LineChartWithCounts extends PureComponent {
  static propTypes = {
    // annotationSeries The array of series data not included in count (e.g., [{ meta, results }, ...]) *   or just a single object of series data.
    annotationSeries: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    colors: PropTypes.object,
    countChartHeight: PropTypes.number,
    countExtent: PropTypes.array,
    counts: PropTypes.array,
    // forceZeroMin=true Whether the min y value should always be 0.
    forceZeroMin: PropTypes.bool,
    // height The height in pixels of the SVG chart
    height: PropTypes.number,
    highlightCounts: PropTypes.array,
    // highlightDate The date being highlighted in the chart
    highlightDate: PropTypes.object,
    // highlightLine The line being highlighted in the chart
    highlightLine: PropTypes.object,
    // id The ID of the SVG chart (needed for PNG export)
    id: PropTypes.string,
    idKey: PropTypes.string,
    lineChartHeight: PropTypes.number,
    numBins: PropTypes.number,
    // onHighlightDate Callback when the mouse moves across the main area of the chart *   passes in the hovered upon date
    onHighlightDate: PropTypes.func,
    // onHighlightLine Callback when a series is highlighted
    onHighlightLine: PropTypes.func,
    padding: PropTypes.object,
    // series The array of series data (e.g., [{ meta, results }, ...])
    series: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
    // width The width in pixels of the SVG chart
    width: PropTypes.number,
    // xExtent The min and max value of the xKey in the chart
    xExtent: PropTypes.array,
    // xKey The key to read the x value from in the data
    xKey: PropTypes.string,
    xScale: PropTypes.func,
    // yAxisLabel The label to show on the Y axis
    yAxisLabel: PropTypes.string,
    // yAxisUnit The unit to show on the Y axis label
    yAxisUnit: PropTypes.string,
    // yExtent The min and max value of the yKey in the chart
    yExtent: PropTypes.array,
    // yFormatter Format function that takes a y value and outputs a string
    yFormatter: PropTypes.func,
    // yKey The key to read the y value from in the data
    yKey: PropTypes.string,
  }

  static defaultProps = {
    threshold: testThreshold,
    idKey: 'id',
    labelKey: 'label',
    lineChartHeight: 350,
    countChartHeight: 80,
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { id, width, annotationSeries, series, padding, xScale, colors, lineChartHeight,
      countChartHeight, hasIncident, incidentData } = this.props;

    const height = lineChartHeight + countChartHeight;
    return (
      <div className="line-chart-with-counts-container">
        <svg
          id={id}
          className="line-chart-with-counts chart"
          width={width}
          height={height}
        >
          <rect x={0} y={0} width={width} height={height} fill={'#fff'} />
          <g>
            <LineChart
              {...this.props}
              series={series}
              colors={colors}
              annotationSeries={annotationSeries}
              id={undefined}
              inSvg
              height={lineChartHeight}
              paddingLeft={padding.left}
              paddingRight={padding.right}
              xScale={xScale}
              hasIncident={hasIncident}
              incident={incidentData}
            />
          </g>
        </svg>
      </div>
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightDate'] })(LineChartWithCounts);
