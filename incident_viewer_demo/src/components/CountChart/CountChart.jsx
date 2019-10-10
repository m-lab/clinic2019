import React, { PureComponent, PropTypes } from 'react';
import d3 from '../../d3';
import addComputedProps from '../../hoc/addComputedProps';
import { testThreshold } from '../../constants';

import { formatNumber } from '../../utils/format';

import './CountChart.scss';

/**
 * Figure out what is needed to render the chart
 * based on the props of the component
 */
function visProps(props) {
  const {
    height,
    paddingLeft = 50,
    paddingRight = 20,
    width,
    xKey,
    xExtent,
    yExtent,
    yKey,
    data,
    numBins,
    maxBinWidth,
  } = props;
  let { xScale } = props;

  const padding = {
    top: 15,
    right: paddingRight,
    bottom: 10,
    left: paddingLeft,
  };

  const plotAreaWidth = width - padding.left - padding.right;
  const plotAreaHeight = height - padding.top - padding.bottom;

  const xMin = 0;
  const xMax = plotAreaWidth;
  const yMin = plotAreaHeight;
  const yMax = 0;

  // set up the domains based on extent. Use the prop if provided, otherwise calculate
  const xDomain = xExtent || d3.extent(data, d => d[xKey]);
  let yDomain = yExtent || d3.extent(data, d => d[yKey]);

  // use the props xScale if provided, otherwise compute it
  if (!xScale) {
    xScale = d3.scaleLinear().domain(xDomain).range([xMin, xMax]);
  }

  // force a zero minimum
  yDomain = [0, yDomain[1]];

  // provide a default in the event that there is no yExtent and data.length = 0
  if (yDomain[1] == null) {
    yDomain[1] = 100;
  }

  // ensure a minimum y-domain size to prevent full sized rects at 0 value
  if (yDomain[0] === yDomain[1]) {
    yDomain = [yDomain[0], yDomain[0] + 1];
  }

  const yScale = d3.scaleLinear().domain(yDomain).range([yMin, yMax]).clamp(true);
  const binWidth = Math.min(maxBinWidth,
      (xMax - xMin) / (numBins || data.length));

  return {
    binWidth,
    plotAreaHeight,
    padding,
    plotAreaWidth,
    xScale,
    yScale,
  };
}

/**
 * This chart is intended to be used paired with another chart. It
 * shares the same x-axis, width, margin left and margin right as the
 * other chart. See LineChartWithCounts and HourChartWithCounts.
 */
class CountChart extends PureComponent {
  static propTypes = {
    binWidth: PropTypes.number,
    data: PropTypes.array,
    height: PropTypes.number,
    // Color used to render the highlighted bars if provided
    highlightColor: PropTypes.string,
    // The x value being highlighted in the chart
    highlightCount: PropTypes.any,
    // Used to highlight a subset of the count data (typically a series object with { meta, results })
    highlightData: PropTypes.array,
    maxBinWidth: React.PropTypes.number,
    numBins: PropTypes.number,
    // Callback when the mouse hovers over a bar. Passes in the x value.
    onHighlightCount: PropTypes.func,
    padding: PropTypes.object,
    plotAreaHeight: PropTypes.number,
    plotAreaWidth: PropTypes.number,
    threshold: PropTypes.number,
    width: PropTypes.number,
    xExtent: PropTypes.array,
    xKey: React.PropTypes.string,
    xScale: React.PropTypes.func,
    yExtent: PropTypes.array,
    yKey: React.PropTypes.string,
    yScale: React.PropTypes.func,
  };

  static defaultProps = {
    data: [],
    xKey: 'x',
    yKey: 'count',
    highlightColor: '#aaa',
    maxBinWidth: 40,
    threshold: testThreshold,
  };

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
   * callback for when mouse hovers over a count bar
   */
  onHoverCountBar(xValue) {
    const { onHighlightCount } = this.props;
    if (onHighlightCount) {
      onHighlightCount(xValue);
    }
  }

  /**
   * Initialize the d3 chart - this is run once on mount
   */
  setup() {
    const { width, height, padding, plotAreaHeight, plotAreaWidth } = this.props;

    // add in white background for saving as PNG
    d3.select(this.root).append('rect')
      .classed('chart-background', true)
      .attr('width', width)
      .attr('height', height)
      .attr('x', 0)
      .attr('y', 0)
      .attr('fill', '#fff');

    this.g = d3.select(this.root)
      .append('g')
      .attr('transform', `translate(${padding.left} ${padding.top})`);

    // add in axis groups
    this.yAxis = this.g.append('g').classed('y-axis', true);
    this.yAxisLabel = this.g.append('text')
      .attr('class', 'axis-label')
      .attr('text-anchor', 'middle');

    // render a line for the x-axis (no ticks)
    this.xAxis = this.g.append('g').classed('x-axis', true)
      .attr('transform', `translate(0 ${plotAreaHeight})`);

    this.xAxis.append('line')
      .attr('x1', 0)
      .attr('x2', plotAreaWidth);

    // add in groups for data
    this.bars = this.g.append('g').classed('bars-group', true);
    this.highlightBars = this.g.append('g').classed('highlight-bars-group', true);
    this.mouseHandlers = this.g.append('g').classed('mouse-handlers-group', true)
      .on('mouseleave', () => this.onHoverCountBar(null));

    this.highlightCountBar = this.g.append('g').attr('class', 'highlight-count-bar');
    this.highlightCountBar.append('rect');
    this.highlightCountBar.append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', 12);

    this.update();
  }

  /**
   * Update the d3 chart - this is the main drawing function
   */
  update() {
    this.updateAxes();
    this.updateMainBars();
    this.updateHighlightBars();
    this.updateHighlightCountBar();
    this.updateMouseHandlers();
  }

  /**
   * Render the x and y axis components
   */
  updateAxes() {
    const { yScale, plotAreaHeight, padding } = this.props;
    const yAxis = d3.axisLeft(yScale)
      .ticks(Math.max(3, plotAreaHeight / 30))
      .tickSizeOuter(0)
      .tickFormat((d) => formatNumber(d, true));

    this.yAxis.call(yAxis);
    this.yAxisLabel
      .attr('transform', `rotate(270) translate(${-plotAreaHeight / 2} ${-padding.left + 12})`)
      .text('Test Count');
  }

  /**
   * Render the main count bars (not the highlight ones)
   */
  updateMainBars() {
    const { data } = this.props;

    this.updateBars(this.bars, data, '#ccc');
  }

  /**
   * Render the highlight count bars
   */
  updateHighlightBars() {
    const { highlightData, highlightColor } = this.props;

    this.updateBars(this.highlightBars, highlightData, highlightColor);
  }

  /**
   * Render rects as mouse handlers
   */
  updateMouseHandlers() {
    const {
      data,
      xKey,
      xScale,
      yScale,
      binWidth,
    } = this.props;

    const binding = this.mouseHandlers.selectAll('.mouse-handler').data(data);
    const entering = binding.enter()
      .append('rect')
        .attr('class', 'mouse-handler')
        .style('pointer-events', 'all')
        .style('fill', '#f00')
        .style('fill-opacity', 0.0)
        .style('stroke', 'none')
        .on('mouseenter', d => this.onHoverCountBar(d[xKey]));

    binding.merge(entering)
      .attr('y', 0)
      // set the width to fill the space until the next bin
      .attr('width', (d, i) => (i === data.length - 1 ?
        binWidth :
        xScale(data[i + 1][xKey]) - xScale(d[xKey])))
      .attr('height', yScale.range()[0])
      .attr('x', d => xScale(d[xKey]));

    binding.exit().remove();
  }

  /**
   * Helper function to render the rects
   */
  updateBars(root, data = [], color = '#ccc') {
    const {
      xKey,
      xScale,
      yKey,
      yScale,
      binWidth,
      plotAreaHeight,
      threshold,
    } = this.props;

    const d3Color = d3.color(color);
    const lighterColor = d3Color ? d3Color.brighter(0.3) : undefined;
    const belowThresholdFill = d3.color(lighterColor);
    belowThresholdFill.opacity = 0.2;
    const belowThresholdStroke = belowThresholdFill.darker(0.3);

    const binding = root.selectAll('.data-bar').data(data);

    // ENTER
    const entering = binding.enter()
      .append('rect')
        .attr('x', d => xScale(d[xKey]))
        .attr('y', yScale(0))
        .attr('width', binWidth)
        .attr('height', 0)
        .attr('class', 'data-bar')
        .style('shape-rendering', 'crispEdges')
        .style('fill', d => (d.count < threshold ? belowThresholdFill : lighterColor))
        .style('stroke', d => (d.count < threshold ? belowThresholdStroke : color));

    // ENTER + UPDATE
    binding.merge(entering)
      .attr('x', d => xScale(d[xKey]))
      .attr('width', binWidth)
      .transition()
        .attr('y', d => yScale(d[yKey] || 0))
        .attr('height', d => plotAreaHeight - yScale(d[yKey] || 0))
        .style('fill', d => (d.count < threshold ? belowThresholdFill : lighterColor))
        .style('stroke', d => (d.count < threshold ? belowThresholdStroke : color));

    // EXIT
    binding.exit()
      .remove();
  }

  /**
   * Render the highlighted count bar
   */
  updateHighlightCountBar() {
    const { highlightCount } = this.props;
    const {
      data,
      highlightData,
      xKey,
      xScale,
      yKey,
      yScale,
      binWidth,
      plotAreaHeight,
    } = this.props;

    if (highlightCount == null) {
      this.highlightCountBar.style('display', 'none');
    } else {
      let d;
      // if we have highlight data, look for the value in there. otherwise look in data
      const searchData = highlightData || data;
      if (highlightCount.isSame) {
        d = searchData.find(datum => highlightCount.isSame(datum[xKey]));
      } else {
        d = searchData.find(datum => datum[xKey] === highlightCount);
      }

      // skip if we have no matching point to highlight
      if (d == null) {
        return;
      }

      this.highlightCountBar
        .style('display', '')
        .attr('transform', `translate(${xScale(d[xKey])} ${yScale(d[yKey] || 0)})`);

      const barHeight = plotAreaHeight - yScale(d[yKey] || 0);
      this.highlightCountBar.select('rect')
        .attr('width', binWidth)
        .attr('height', barHeight)
        .style('fill', '#bbb')
        .style('stroke', '#aaa');

      this.highlightCountBar.select('text')
        .attr('x', binWidth / 2)
        .attr('y', -15)
        .text(formatNumber(d[yKey]));
    }
  }

  /**
   * The main render method. Defers chart rendering to d3 in `update` and `setup`
   * @return {React.Component} The rendered container
   */
  render() {
    return (
      <g className="CountChart chart" ref={node => { this.root = node; }} />
    );
  }
}

export default addComputedProps(visProps, { changeExclude: ['highlightCount'] })(CountChart);
