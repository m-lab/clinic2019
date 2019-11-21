import React, { PureComponent, PropTypes } from 'react';
import d3 from '../chart_support/d3';
import { multiExtent, findClosestSorted, findEqualSorted } from '../chart_support/array';
import { colorsFor } from '../chart_support/color';
import { standardLineChunkedDefinitions } from '../chart_support/chart';
import Legend from '../chart_support/d3-components/Legend/Legend.js';
import addComputedProps from '../chart_support/addComputedProps';
import { testThreshold } from '../chart_support/constants';

import './LineChart.scss';
import moment from 'moment';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    idKey,
    labelKey,
    series = [],
    goodIncidentSeries,
    badIncidentSeries,
    hasIncident,
    forceZeroMin,
    height,
    paddingLeft = 50,
    paddingRight = 20,
    threshold,
    width,
    xExtent,
    xKey,
    yExtent,
    yKey,
    yFormatter,
  } = props;
  let {
    colors,
    annotationSeries = [],
    xScale,
  } = props;


  // ensure annotation series is an array
  if (annotationSeries && !Array.isArray(annotationSeries)) {
    annotationSeries = [annotationSeries];
  }

  // initialize a color scale unless one was provided
  if (series && !colors) {
    colors = colorsFor(series, (d) => d.meta[idKey]);
  }

  const padding = {
    top: 20,
    right: paddingRight,
    bottom: 40,
    left: paddingLeft,
  };

  const plotAreaWidth = width - padding.left - padding.right;

  const combinedData = [...series, ...annotationSeries];

  // compute legend properties and make room for it at the top.
  const legend = new Legend({
    data: combinedData,
    colors,
    formatter: yFormatter,
    width: plotAreaWidth,
    idKey,
    labelKey,
  });

  padding.top += legend.height;

  const plotAreaHeight = height - padding.top - padding.bottom;

  const xMin = 0;
  const xMax = plotAreaWidth;
  const yMin = plotAreaHeight;
  const yMax = 0;

  // set up the domains based on extent. Use the prop if provided, otherwise calculate
  let xDomain = xExtent;
  if (!xDomain) {
    xDomain = multiExtent(combinedData, d => d[xKey], oneSeries => oneSeries.results);
  }
  let yDomain = yExtent;
  if (!yDomain) {
    yDomain = multiExtent(combinedData, d => d[yKey], oneSeries => oneSeries.results) || [];

    if (yDomain[0] == null) {
      yDomain[0] = 0;
    }
    if (yDomain[1] == null) {
      yDomain[1] = 1;
    }
  }

  // force 0 as the min in the yDomain if specified
  if (forceZeroMin) {
    yDomain = [0, yDomain ? yDomain[1] : 1];
  }

  // use the props xScale if provided, otherwise compute it
  if (!xScale) {
    xScale = d3.scaleTime().range([xMin, xMax]);
    if (xDomain) {
      xScale.domain(xDomain);
    }
  }
  const yScale = d3.scaleLinear().range([yMin, yMax]);
  if (yDomain) {
    yScale.domain(yDomain);
  }

  // function to generate paths for each series
  const lineChunked = d3.lineChunked()
    .x((d) => xScale(d[xKey]))
    .y((d) => yScale(d[yKey]))
    .curve(d3.curveMonotoneX)
    .defined(d => d[yKey] != null)
    .accessData(d => d.results)
    .lineStyles({
      stroke: (d) => colors[d.meta[idKey]] || '#aaa',
      'stroke-width': 1.5,
    })
    .chunk(d => (d.count > threshold ? 'line' : 'below-threshold'))
    .chunkDefinitions(standardLineChunkedDefinitions((d) => colors[d.meta[idKey]] || '#aaa'));


  // function to generate paths for each annotation series
  const annotationLineChunked = d3.lineChunked()
    .x(lineChunked.x())
    .y(lineChunked.y())
    .curve(lineChunked.curve())
    .defined(lineChunked.defined())
    .accessData(lineChunked.accessData())
    .lineStyles({
      stroke: '#aaa',
      'stroke-width': 1,
    })
    .chunk(d => (d.count > threshold ? 'line' : 'below-threshold'))
    .chunkDefinitions(standardLineChunkedDefinitions('#aaa'))
    .transitionInitial(false);

  const incidentLineGenerator = d3.line()
  .x((d) => xScale(d.x))
  .y((d) => yScale(d.y));

  const incidentShadingGenerator = d3.area()
    .curve(d3.curveMonotoneX)
    .x((d) => xScale(d.x))
    .y0((d) => yScale(d.y0))
    .y1((d) => yScale(d.y1));

  return {
    annotationLineChunked,
    annotationSeries,
    goodIncidentSeries,
    badIncidentSeries,
    incidentLineGenerator,
    incidentShadingGenerator,
    colors,
    plotAreaHeight,
    padding,
    plotAreaWidth,
    legend,
    lineChunked,
    xScale,
    yScale,
  };
}

/**
 * A line chart that uses d3 to draw. Assumes X is a time scale.
 */
class LineChart extends PureComponent {
  static propTypes = {
    annotationLineChunked: React.PropTypes.func,
    goodIncidentSeries: React.PropTypes.object,
    badIncidentSeries: React.PropTypes.object,
    annotationSeries: PropTypes.array,
    // Obect mapping series IDs to colors
    colors: PropTypes.object,
    // true Whether the min y value should always be 0.
    forceZeroMin: PropTypes.bool,
    // The height in pixels of the SVG chart
    height: React.PropTypes.number,
    // The date being highlighted in the chart
    highlightDate: React.PropTypes.object,
    // The line being highlighted in the chart
    highlightLine: React.PropTypes.object,
    // The ID of the SVG chart (needed for PNG export)
    id: React.PropTypes.string,
    idKey: React.PropTypes.string,
    // Whether this is being nested inside an SVG, if true renders a <g>
    inSvg: React.PropTypes.bool,
    labelKey: React.PropTypes.string,
    legend: React.PropTypes.object,
    lineChunked: React.PropTypes.func,
    // Callback when the mouse moves across the main area of the chart *   passes in the hovered upon date
    onHighlightDate: React.PropTypes.func,
    // Callback when a series is highlighted
    onHighlightLine: React.PropTypes.func,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    // The array of series data (e.g., [{ meta, results }, ...])
    series: PropTypes.array,
    threshold: PropTypes.number,
    // The width in pixels of the SVG chart
    width: React.PropTypes.number,
    // The min and max value of the xKey in the chart
    xExtent: PropTypes.array,
    // The key to read the x value from in the data
    xKey: React.PropTypes.string,
    xScale: PropTypes.func,
    // The label to show on the Y axis
    yAxisLabel: React.PropTypes.string,
    // The unit to show on the Y axis label
    yAxisUnit: React.PropTypes.string,
    // The min and max value of the yKey in the chart
    yExtent: PropTypes.array,
    // Format function that takes a y value and outputs a string
    yFormatter: PropTypes.func,
    // The key to read the y value from in the data
    yKey: React.PropTypes.string,
    yScale: PropTypes.func,
  }

  static defaultProps = {
    forceZeroMin: true,
    idKey: 'id',
    labelKey: 'label',
    threshold: testThreshold,
    xKey: 'x',
    yFormatter: d => d,
    yKey: 'y',
  }

  constructor(...args) {
    super(...args);

    // bind handlers
    this.onHoverLegendEntry = this.onHoverLegendEntry.bind(this);
  }

  /**
   * When the react component mounts, setup the d3 vis
   */
  componentDidMount() {
    this.setup();
  }

  /**
   * When the react component updates, update the d3 vis
   */
  componentDidUpdate() {
    this.update();
  }

  /**
   * Callback for when the mouse hovers over a legend entry
   *
   * @param {Object} oneSeries an item from the series array or annotationSeries array
   * @return {void}
   */
  onHoverLegendEntry(oneSeries) {
    const { onHighlightLine } = this.props;
    if (onHighlightLine) {
      onHighlightLine(oneSeries);
    }
  }

  /**
   * Callback for when the user moves the mouse across
   *
   * @param {Array} mouse the [x, y] mouse coordinates in chart space (pixels)
   * @return {void}
   */
  onMouseMove(mouse) {
    // TODO: make in alphabetical order
    const { plotAreaHeight, goodIncidentSeries, badIncidentSeries, onHighlightDate, series, xScale , xKey, yScale, yKey } = this.props;
    
    const goodDescription1 = "Average Download Speed: 50 mb/s"
    const goodDescription2 = "August 2015 - July 2016"

    if (!onHighlightDate) {
      return;
    }
    if (mouse === null) {
      // mouse out
      this.highlightDate.style('display', 'none');
      return;
    }
    else {
      this.highlightDate.style('display', 'block');
      
      let closest;
      const [mouseX, mouseY] = mouse;
      // moving around, find nearest x value.
      if (series && series.length) {
        const checkSeries = series[0];
        closest = findClosestSorted(checkSeries.results, mouseX, d => xScale(d[xKey]))[xKey];
      }

      this.refLine
        .attr('x1', xScale(closest))
        .attr('x2', xScale(closest));

      const highlightedDate = moment(closest);
      const goodYmax = yScale(goodIncidentSeries.download_speed_mbps_median);
      const badYmax = yScale(badIncidentSeries.download_speed_mbps_median);
      this.infoHoverBox.selectAll('*').remove();

      // TODO: Change values to use the correct JSON attributes
      const width = xScale(goodIncidentSeries.end) - xScale(goodIncidentSeries.start);
      const rectFitsText = width < 500;
      const verticalTextShifter = 0.45; // NOTE: This needs to be tuned based on font size and number of lines :(

      // Draw the hover state for the good period information
      if (highlightedDate.isBefore(goodIncidentSeries.end) && highlightedDate.isSameOrAfter(goodIncidentSeries.start) && mouseY > goodYmax) {
        this.infoHoverBox.append('rect')
        .classed("good-incident-area", true)
        .attr('x', xScale(goodIncidentSeries.start))
        .attr('y', goodYmax)
        .attr('width', width)
        .attr('height', plotAreaHeight-goodYmax);

        if (rectFitsText) {
          this.infoHoverBox.append('text')
          .classed('good-hover-text', true)
          .attr('x', xScale(goodIncidentSeries.start) + 0.5*width)
          .attr('y', goodYmax + verticalTextShifter*(plotAreaHeight-goodYmax))
          .append('svg:tspan')
          .attr('x', xScale(goodIncidentSeries.start) + 20)
          .attr('dy', 0)
          .text(goodDescription1)
          .append('svg:tspan')
          .attr('x', xScale(goodIncidentSeries.start) + 20)
          .attr('dy', 20)
          .text(goodDescription2)
        }
      }

      // Draw the hover state for the bad period information
      if (highlightedDate.isSameOrBefore(badIncidentSeries.end) && highlightedDate.isSameOrAfter(badIncidentSeries.start) && mouseY > badYmax) {
        this.infoHoverBox.append('rect')
        .classed("bad-incident-area", true)
        .attr('x', xScale(badIncidentSeries.start))
        .attr('y', badYmax)
        .attr('width', width)
        .attr('height', plotAreaHeight-badYmax)
        
        if (rectFitsText) {
          this.infoHoverBox.append('text')
          .classed('bad-hover-text', true)
          .attr('x', xScale(badIncidentSeries.start) + 0.5*width)
          .attr('y', badYmax + verticalTextShifter*(plotAreaHeight-badYmax))
          .append('svg:tspan')
          .attr('x', xScale(badIncidentSeries.start) + 20)
          .attr('dy', 0)
          .text(goodDescription1)
          .append('svg:tspan')
          .attr('x', xScale(badIncidentSeries.start) + 20)
          .attr('dy', 20)
          .text(goodDescription2)
        }
      }

      // Draw the hover state for the incident information
      if (highlightedDate.isSameOrBefore(badIncidentSeries.end) && highlightedDate.isSameOrAfter(badIncidentSeries.start) && mouseY < badYmax && mouseY > goodYmax) {
        this.infoHoverBox.append('rect')
        .classed("incident-area", true)
        .attr('x', xScale(badIncidentSeries.start))
        .attr('y', goodYmax)
        .attr('width', xScale(badIncidentSeries.end) - xScale(badIncidentSeries.start))
        .attr('height', badYmax-goodYmax)
      }
    }
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { height, width, plotAreaHeight } = this.props;

    // add in white background for saving as PNG
    d3.select(this.root).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.root)
      .append('g'); // transformed to have margin in update()


    this.legendContainer = this.g.append('g').classed('legend', true);

    // add in axis groups
    this.xAxis = this.g.append('g').classed('x-axis', true);
    this.xAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // add in groups for data
    this.annotationLines = this.g.append('g').classed('annotation-lines-group', true);
    this.lines = this.g.append('g').classed('lines-group', true);
    this.circles = this.g.append('g').classed('circles-group', true);
    this.goodIncidentLine = this.g.append('g').classed('good-incident-line', true);
    this.badIncidentLine = this.g.append('g').classed('bad-incident-line', true);
    this.incidentArrowLine = this.g.append('g').classed('incident-arrow-line', true);
    this.incidentArrowTri = this.g.append('g').classed('incident-arrow-tri', true);
    this.goodIncidentShading = this.g.append('g').classed('good-incident-shading', true);
    this.badIncidentShading = this.g.append('g').classed('bad-incident-shading', true);
    

    // container for showing the x highlighte date indicator
    this.highlightDate = this.g.append('g').attr('class', 'highlight-date');
    this.refLine = this.highlightDate.append('line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', plotAreaHeight + 3)
      .attr('class', 'highlight-ref-line');
    this.infoHoverBox = this.highlightDate.append('g')


    // add in a rect to fill out the area beneath the hovered on X date
    // BELOW CODE IS FOR X AXIS ANNOTATION BELOW HOVER LINE
    // this.highlightDate.append('rect')
    //   .attr('x', -45)
    //   .attr('width', 90)
    //   .attr('y', 0) // should be set to plotAreaHeight
    //   .attr('height', 20)
    //   .style('fill', '#fff');
    // this.highlightDate.append('text')
    //   .attr('class', 'highlight-x')
    //   .attr('dy', 17)
    //   .attr('text-anchor', 'middle');

    // container for showing the highlighted line
    this.highlightLine = this.g.append('g').attr('class', 'highlight-line');
    this.highlightLine.append('rect').attr('class', 'series-overlay');
    this.highlightLine.append('g');

    // add in mouse listener -- this should be added above the lines and axes
    const that = this;
    this.mouseListener = this.g.append('rect')
      .attr('class', 'mouse-listener')
      .style('fill', '#f00')
      .style('stroke', 'none')
      .style('opacity', 0)
      .on('mousemove', function mouseMoveListener() {
        that.onMouseMove.call(that, d3.mouse(this));
      })
      .on('mouseout', () => this.onMouseMove(null));
    this.update();
  }

  getYAxisLabel() {
    const { yAxisLabel, yAxisUnit } = this.props;
    return `${yAxisLabel}${yAxisUnit ? ` (${yAxisUnit})` : ''}`;
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    const { highlightDate, series = [], annotationSeries = [], xKey, padding,
      plotAreaHeight, plotAreaWidth } = this.props;

    // ensure we have room for the legend
    this.g.attr('transform', `translate(${padding.left} ${padding.top})`);
    this.mouseListener
      .attr('width', plotAreaWidth)
      .attr('height', plotAreaHeight + 25); // plus some to cover part of the x axis

    // see what the values are for the highlighted date if we have one
    let highlightValues;
    if (highlightDate != null) {
      // find the y value for the highlighted date
      highlightValues = series.concat(annotationSeries).map(oneSeries => {
        const value = findEqualSorted(oneSeries.results, highlightDate.unix(), d => d[xKey].unix());
        return value;
      });
    }
    
    this.updateIncident();

    this.updateLegend(highlightValues);
    this.updateAxes();
    this.updateAnnotationLines();
    this.updateLines();
    this.updateHighlightDate(highlightValues);
    this.updateHighlightLine();
  }

  updateHighlightDate(highlightValues) {
    const { highlightDate, xScale, plotAreaHeight, yScale, yKey, series, colors, idKey } = this.props;

    // render the x-axis marker for highlightDate
    if (highlightDate == null) {
      this.highlightDate.style('display', 'none');
    } else {
      this.highlightDate
        .style('display', '')
        .attr('transform', `translate(${xScale(highlightDate)} 0)`);
      this.highlightDate.select('line')
        .attr('y2', plotAreaHeight + 3);

      this.highlightDate.select('rect')
        .attr('y', plotAreaHeight + 4);

      this.highlightDate.select('text')
        .attr('y', plotAreaHeight + 3)
        .text(highlightDate.format('MMM D YYYY'));

      const points = this.highlightDate.selectAll('circle').data(highlightValues);
      points.exit().remove();
      const entering = points.enter().append('circle');

      // don't filter out d values so we can use `i` to get the color
      points.merge(entering)
        .attr('class', 'highlight-circle')
        .style('display', d => ((d == null || d[yKey] == null) ? 'none' : ''))
        .attr('r', 3)
        .attr('cx', 0)
        .style('fill', (d, i) => {
          if (series[i] && colors[series[i].meta[idKey]]) {
            return d3.color(colors[series[i].meta[idKey]]).brighter(0.3);
          }

          return '#bbb';
        })
        .style('stroke', (d, i) => {
          if (series[i] && colors[series[i].meta[idKey]]) {
            return colors[series[i].meta[idKey]];
          }

          return '#aaa';
        })
        .attr('cy', d => (d == null ? 0 : yScale(d[yKey]) || 0));
    }
  }

  updateHighlightLine() {
    // render the highlight line
    const { highlightLine, lineChunked, plotAreaWidth, plotAreaHeight } = this.props;

    if (!highlightLine) {
      this.highlightLine.style('display', 'none');
    } else {
      this.highlightLine.style('display', '');
      this.highlightLine.select('g').datum(highlightLine).call(lineChunked);
      this.highlightLine.select('.series-overlay')
        .attr('width', plotAreaWidth)
        .attr('height', plotAreaHeight);
    }
  }

  updateLegend(highlightValues) {
    const { highlightLine, legend, yKey } = this.props;

    this.legendContainer.attr('transform', `translate(0 ${-legend.height})`);

    // map to just Y values
    const highlightYValues = highlightValues && highlightValues.map(d => (d == null ? d : d[yKey]));

    legend.render(this.legendContainer, highlightYValues, this.onHoverLegendEntry, highlightLine);
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { xScale, yScale, plotAreaHeight, padding, plotAreaWidth, yKey, yFormatter } = this.props;
    const xAxis = d3.axisBottom(xScale).tickSizeOuter(0);
    const yAxis = d3.axisLeft(yScale).ticks(Math.max(4, plotAreaHeight / 30)).tickSizeOuter(0);

    // use default formatter unless retransmit_avg since we want percentages rendered
    if (yKey === 'retransmit_avg') {
      yAxis.tickFormat(yFormatter);
    }

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text(this.getYAxisLabel());

    this.xAxis
      .attr('transform', `translate(0 ${plotAreaHeight + 3})`)
      .call(xAxis);

    this.xAxisLabel
      .attr('transform', `translate(${plotAreaWidth / 2} ${plotAreaHeight + (padding.bottom)})`)
      .text('Time');
  }

  /**
   * Render the lines in the chart
   */
  updateLines() {
    const { series, lineChunked } = this.props;

    if (!series) {
      this.lines.selectAll('*').remove();
      return;
    }

    const binding = this.lines.selectAll('g').data(series);

    // ENTER
    const entering = binding.enter().append('g');

    // ENTER + UPDATE
    binding.merge(entering)
      .transition()
      .call(lineChunked);

    // EXIT
    binding.exit().remove();
  }

  /**
   * Render the annotation lines in the chart
   */
  updateAnnotationLines() {
    const { annotationSeries, annotationLineChunked, xScale, yScale, yKey } = this.props;

    if (!annotationSeries || !annotationSeries.length) {
      this.annotationLines.selectAll('*').remove();
      return;
    }

    // handle normal lines via line chunked
    const normalLines = annotationSeries.filter(oneSeries => Array.isArray(oneSeries.results));

    const binding = this.annotationLines.selectAll('g').data(normalLines);

    // ENTER
    const entering = binding.enter().append('g');

    // ENTER + UPDATE
    binding.merge(entering)
      .transition()
      .call(annotationLineChunked);

    // EXIT
    binding.exit().remove();

    // handle constant lines
    const constantLines = annotationSeries.filter(oneSeries => !Array.isArray(oneSeries.results));
    const constantBinding = this.annotationLines.selectAll('.constant-line').data(constantLines);
    const constantEntering = constantBinding.enter().append('line');

    const [xMin, xMax] = xScale.range();

    constantBinding.merge(constantEntering)
      .classed('constant-line', true)
      .attr('x1', xMin)
      .attr('x2', xMax)
      .attr('y1', d => yScale(d.results[yKey]))
      .attr('y2', d => yScale(d.results[yKey]));

    constantBinding.exit().remove();
  }

  /**
   * Render the incident "good" and "bad" periods reference lines on the chart.
   */
  updateIncident() {
    const { goodIncidentSeries, badIncidentSeries, incidentLineGenerator } = this.props;

    const goodIncidentSeriesArray = [{x: goodIncidentSeries.start, y: goodIncidentSeries.download_speed_mbps_median}, {x: goodIncidentSeries.end, y: goodIncidentSeries.download_speed_mbps_median} ];
    const badIncidentSeriesArray = [{x: badIncidentSeries.start, y: badIncidentSeries.download_speed_mbps_median}, {x: badIncidentSeries.end, y: badIncidentSeries.download_speed_mbps_median} ];
    
    this.goodIncidentLine.selectAll('*').remove();
    this.badIncidentLine.selectAll('*').remove();

    this.updateIncidentArrow();
    this.updateIncidentShading();

    // LINES
    this.goodIncidentLine.append('path')
      .classed('good-incident-line', true)
      .attr('d', incidentLineGenerator(goodIncidentSeriesArray))
    
    this.badIncidentLine.append('path')
      .classed('bad-incident-line', true)
      .attr('d', incidentLineGenerator(badIncidentSeriesArray))
  }

  updateIncidentShading() {
    const { goodIncidentSeries, badIncidentSeries, incidentShadingGenerator, series } = this.props;
    
    var goodIncidentShadingArray = [];
    var badIncidentShadingArray = [];

    series[0].results
      .filter(entry => (entry.date.isSameOrAfter(goodIncidentSeries.start) && entry.date.isSameOrBefore(goodIncidentSeries.end)))
      .map(entry => (
        goodIncidentShadingArray.push(
          { x: entry.date, 
            y0: goodIncidentSeries.download_speed_mbps_median, 
            y1: entry.download_speed_mbps_median
          }
        )
      ));
    
    series[0].results
      .filter(entry => (entry.date.isSameOrAfter(badIncidentSeries.start) && entry.date.isSameOrBefore(badIncidentSeries.end)))
      .map(entry => (
        badIncidentShadingArray.push(
          { x: entry.date, 
            y0: badIncidentSeries.download_speed_mbps_median, 
            y1: entry.download_speed_mbps_median
          }
        )
      ));
    
    this.goodIncidentShading.selectAll('*').remove();
    this.badIncidentShading.selectAll('*').remove();

    this.goodIncidentShading.append('path')
      .attr('d', incidentShadingGenerator(goodIncidentShadingArray));

    this.badIncidentShading.append('path')
      .attr('d', incidentShadingGenerator(badIncidentShadingArray));
    
  
  }

  updateIncidentArrow() {
    const { goodIncidentSeries, badIncidentSeries, xScale, yScale } = this.props;

    const incidentArrowX = goodIncidentSeries.end;
    const triWidth = 20;
    const triHeight = 15;
    
    const incidentArrowLineArray = [{x: incidentArrowX, y: goodIncidentSeries.download_speed_mbps_median}, {x: incidentArrowX, y: badIncidentSeries.download_speed_mbps_median}];
    
    
    const incidentArrowTriArray = [
        {x: xScale(incidentArrowX), y: yScale(badIncidentSeries.download_speed_mbps_median)}, 
        {x: xScale(incidentArrowX) + triWidth/2, y: yScale(badIncidentSeries.download_speed_mbps_median) - triHeight}, 
        {x: xScale(incidentArrowX) - triWidth/2, y: yScale(badIncidentSeries.download_speed_mbps_median) - triHeight}
      ];

    this.incidentArrowLine.selectAll('*').remove();
    this.incidentArrowTri.selectAll('*').remove();

    //TRIANGLE
    this.incidentArrowTri.append('polygon')
      .classed('incident-arrow-tri', true)
      .data([incidentArrowTriArray])
      .attr('points', function(d) { 
        return d.map(function(d) {
            return [d.x,d.y].join(",");
        }).join(" ");
      });

    //LINE
    this.incidentArrowLine.append('line')
      .classed('incident-arrow-line', true)
      .attr('x1', xScale(incidentArrowLineArray[0].x))
      .attr('x2', xScale(incidentArrowLineArray[1].x))
      .attr('y1', yScale(incidentArrowLineArray[0].y))
      .attr('y2', yScale(incidentArrowLineArray[1].y)-triHeight/2);
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    const { height, id, inSvg, width } = this.props;

    if (inSvg) {
      return (
        <g
          className="line-chart chart"
          ref={node => { this.root = node; }}
        />
      );
    }

    return (
      <div>
        <svg
          id={id}
          className="line-chart chart"
          height={height}
          ref={node => { this.root = node; }}
          width={width}
        />
      </div>
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightDate'] })(LineChart);
