import React, { PureComponent, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { batchActions } from 'redux-batched-actions';
import { browserHistory } from 'react-router';
import momentPropTypes from 'react-moment-proptypes';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import AutoWidth from 'react-auto-width';

import * as LocationPageSelectors from '../../redux/locationPage/selectors';
import * as LocationPageActions from '../../redux/locationPage/actions';
import * as LocationsSelectors from '../../redux/locations/selectors';
import * as LocationsActions from '../../redux/locations/actions';
import * as LocationClientIspActions from '../../redux/locationClientIsp/actions';

import timeAggregationFromDates from '../../utils/timeAggregationFromDates';
import { multiMergeMetaIntoResults, mergeMetaIntoResults } from '../../utils/exports';
import { metrics, defaultStartDate, defaultEndDate } from '../../constants';

import {
  ChartExportControls,
  LineChartWithCounts,
  HourChartWithCounts,
  LineChartSmallMult,
  MetricSelector,
  TimeAggregationSelector,
  StatusWrapper,
  IspSelect,
  DateRangeSelector,
  Breadcrumbs,
  ScatterGroup,
  HistoGroup,
  SummaryTable,
  HelpTip,
} from '../../components';

import { LocationSearch } from '../../containers';

import UrlHandler from '../../url/UrlHandler';
import urlConnect from '../../url/urlConnect';
import queryRebuild from '../../url/queryRebuild';

import './LocationPage.scss';

// TODO: Finish removing code from this file that is not necessary for our demo.

// Define how to read/write state to URL query parameters
const urlQueryConfig = {
  viewMetric: { type: 'string', defaultValue: 'download', urlKey: 'metric' },
  compareMetricX: { type: 'string', defaultValue: 'download', urlKey: 'compareX' },
  compareMetricY: { type: 'string', defaultValue: 'upload', urlKey: 'compareY' },

  // chart options
  showBaselines: { type: 'boolean', defaultValue: false, urlKey: 'baselines' },
  showRegionalValues: { type: 'boolean', defaultValue: true, urlKey: 'regional' },

  // selected time
  startDate: { type: 'date', urlKey: 'start', defaultValue: defaultStartDate },
  endDate: { type: 'date', urlKey: 'end', defaultValue: defaultEndDate },
  timeAggregation: { type: 'string', urlKey: 'aggr' },
  selectedClientIspIds: { type: 'set', urlKey: 'isps', persist: false },
};
const urlHandler = new UrlHandler(urlQueryConfig, browserHistory);

function mapStateToProps(state, propsWithUrl) {
  return {
    ...propsWithUrl,
    autoTimeAggregation: LocationPageSelectors.getAutoTimeAggregation(state, propsWithUrl),
    clientIspHourly: LocationPageSelectors.getLocationClientIspHourly(state, propsWithUrl),
    clientIspTimeSeries: LocationPageSelectors.getLocationClientIspTimeSeries(state, propsWithUrl),
    colors: LocationPageSelectors.getColors(state, propsWithUrl),
    compareMetrics: LocationPageSelectors.getCompareMetrics(state, propsWithUrl),
    highlightHourly: LocationPageSelectors.getHighlightHourly(state, propsWithUrl),
    highlightTimeSeriesDate: LocationPageSelectors.getHighlightTimeSeriesDate(state, propsWithUrl),
    highlightTimeSeriesLine: LocationPageSelectors.getHighlightTimeSeriesLine(state, propsWithUrl),
    hourlyExtents: LocationPageSelectors.getHourlyExtents(state, propsWithUrl),
    locationInfo: LocationsSelectors.getLocationInfo(state, propsWithUrl),
    locationAndClientIspTimeSeries: LocationPageSelectors.getLocationAndClientIspTimeSeries(state, propsWithUrl),
    locationHourly: LocationPageSelectors.getLocationHourly(state, propsWithUrl),
    locationTimeSeries: LocationsSelectors.getLocationTimeSeries(state, propsWithUrl),
    annotationTimeSeries: LocationPageSelectors.getAnnotationTimeSeries(state, propsWithUrl),
    selectedClientIspInfo: LocationPageSelectors.getLocationSelectedClientIspInfo(state, propsWithUrl),
    summary: LocationPageSelectors.getSummaryData(state, propsWithUrl),
    timeAggregation: LocationPageSelectors.getTimeAggregation(state, propsWithUrl),
    timeSeriesStatus: LocationPageSelectors.getTimeSeriesStatus(state, propsWithUrl),
    topClientIsps: LocationsSelectors.getLocationTopClientIsps(state, propsWithUrl),
    viewMetric: LocationPageSelectors.getViewMetric(state, propsWithUrl),
  };
}


class LocationPage extends PureComponent {
  static propTypes = {
    annotationTimeSeries: PropTypes.array,
    autoTimeAggregation: PropTypes.bool,
    clientIspHourly: PropTypes.array,
    clientIspTimeSeries: PropTypes.object,
    colors: PropTypes.object,
    compareMetrics: PropTypes.object,
    dispatch: PropTypes.func,
    endDate: momentPropTypes.momentObj,
    highlightHourly: PropTypes.number,
    highlightTimeSeriesDate: PropTypes.object,
    highlightTimeSeriesLine: PropTypes.object,
    hourlyExtents: PropTypes.object,
    location: PropTypes.object, // route location
    locationAndClientIspTimeSeries: PropTypes.array,
    locationHourly: PropTypes.object,
    locationId: PropTypes.string,
    locationInfo: PropTypes.object,
    locationTimeSeries: PropTypes.object,
    selectedClientIspIds: PropTypes.array,
    selectedClientIspInfo: PropTypes.array,
    showBaselines: PropTypes.bool,
    showRegionalValues: PropTypes.bool,
    startDate: momentPropTypes.momentObj,
    summary: PropTypes.object,
    timeAggregation: PropTypes.string,
    timeSeriesStatus: PropTypes.string,
    topClientIsps: PropTypes.array,
    viewMetric: PropTypes.object,
  }

  constructor(props) {
    super(props);

    // bind handlers
    this.onHighlightTimeSeriesDate = this.onHighlightTimeSeriesDate.bind(this);
    this.onHighlightTimeSeriesLine = this.onHighlightTimeSeriesLine.bind(this);
    this.onSelectedClientIspsChange = this.onSelectedClientIspsChange.bind(this);
  }

  componentDidMount() {
    this.fetchData(this.props);
  }

  componentWillReceiveProps(nextProps) {
    this.fetchData(nextProps);
  }

  /**
   * Fetch the data for the page if needed
   */
  fetchData(props) {
    const { dispatch, locationId, timeAggregation, startDate, endDate, topClientIsps, selectedClientIspIds } = props;
    const options = {
      startDate,
      endDate,
    };

    dispatch(LocationsActions.fetchInfoIfNeeded(locationId));
    dispatch(LocationsActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId, options));
    dispatch(LocationsActions.fetchHourlyIfNeeded(timeAggregation, locationId, options));
    dispatch(LocationsActions.fetchTopClientIspsIfNeeded(locationId));
    // setup selected ISPs if needed
    if (topClientIsps && topClientIsps.length) {
      // if we don't have selected client ISPs yet, select the top ones.
      if (!selectedClientIspIds) {
        // once we have the client ISPs for the location, if we don't have selected client ISPs,
        // set the selected client ISPs to the top 3 for the location.
        const newSelectedIsps = [];
        topClientIsps.slice(0, 3).forEach(clientIsp => {
          const clientIspId = clientIsp.client_asn_number;
          newSelectedIsps.push(clientIspId);
        });
        dispatch(LocationPageActions.changeSelectedClientIspIds(newSelectedIsps));
      }
    }

    this.fetchSelectedClientIspData(props);
  }

  fetchSelectedClientIspData(props) {
    const { dispatch, locationId, timeAggregation, startDate, endDate, selectedClientIspIds } = props;
    const options = {
      startDate,
      endDate,
    };
    // fetch data for selected Client ISPs
    if (selectedClientIspIds) {
      selectedClientIspIds.forEach(clientIspId => {
        dispatch(LocationClientIspActions.fetchInfoIfNeeded(locationId, clientIspId));
        dispatch(LocationClientIspActions.fetchTimeSeriesIfNeeded(timeAggregation, locationId,
          clientIspId, options));
        dispatch(LocationClientIspActions.fetchHourlyIfNeeded(timeAggregation, locationId,
          clientIspId, options));
      });
    }
  }

  /**
   * Callback for when a date is highlighted in time series
   */
  onHighlightTimeSeriesDate(date) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightTimeSeriesDate(date));
  }

  /**
   * Callback for when a line is highlighted in time series
   */
  onHighlightTimeSeriesLine(series) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.highlightTimeSeriesLine(series));
  }


  /**
   * Callback for when The Selected Client ISPs change
   * @param {Array} ispIds Ids of currently selected ISPs
   */
  onSelectedClientIspsChange(ispIds) {
    const { dispatch } = this.props;
    dispatch(LocationPageActions.changeSelectedClientIspIds(ispIds));
  }

  renderCityProviders() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && (locationInfo.shortLabel || locationInfo.label)) || 'Loading...';
    return (
      <div className="section">
        <header>
          <Row>
            <h2>{locationName}</h2>
          </Row>
        </header>
        <Row>
          <Col md={3}>
            {this.renderClientIspSelector()}
          </Col>
          <Col md={9}>
            {this.renderCompareProviders()}
          </Col>
        </Row>
      </div>
    );
  }

  renderClientIspSelector() {
    const { topClientIsps = [], selectedClientIspInfo } = this.props;

    return (
      <div className="client-isp-selector">
        <h5>Client ISPs <HelpTip id="client-isp-tip" /></h5>
        <IspSelect
          isps={topClientIsps}
          selected={selectedClientIspInfo}
          onChange={this.onSelectedClientIspsChange}
        />
      </div>
    );
  }

  renderCompareProviders() {
    const { clientIspTimeSeries, highlightTimeSeriesDate, highlightTimeSeriesLine,
      locationId, locationTimeSeries, timeSeriesStatus, viewMetric, colors,
      annotationTimeSeries } = this.props;
    const chartId = 'providers-time-series';

    // use location totals as the counts
    const counts = locationTimeSeries && locationTimeSeries.results;

    // show the sum of the selected ISP counts if no highlighted ISP
    const { data: clientIspTimeSeriesData, counts: clientIspCounts } = clientIspTimeSeries;

    return (
      <div className="subsection">
        <header>
          <h3>Compare Providers</h3>
        </header>
        <StatusWrapper status={timeSeriesStatus}>
          <AutoWidth>
            <LineChartWithCounts
              id={chartId}
              colors={colors}
              counts={counts}
              highlightCounts={clientIspCounts}
              series={clientIspTimeSeriesData}
              annotationSeries={annotationTimeSeries}
              onHighlightDate={this.onHighlightTimeSeriesDate}
              highlightDate={highlightTimeSeriesDate}
              onHighlightLine={this.onHighlightTimeSeriesLine}
              highlightLine={highlightTimeSeriesLine}
              yFormatter={viewMetric.formatter}
              xKey="date"
              yAxisLabel={viewMetric.label}
              yAxisUnit={viewMetric.unit}
              yKey={viewMetric.dataKey}
            />
          </AutoWidth>
        </StatusWrapper>
      </div>
    );
  }

  renderBreadCrumbs() {
    const { locationInfo, location } = this.props;

    return (
      <Breadcrumbs
        info={locationInfo}
        query={queryRebuild(location.query, urlQueryConfig)}
      />
    );
  }

  renderLocationSearch() {
    const { location } = this.props;

    return (
      <LocationSearch
        query={queryRebuild(location.query, urlQueryConfig)}
      />
    );
  }

  renderLocationHeader() {
    return (
      <Row className="location-header">
        <Col md={8}>
          {this.renderBreadCrumbs()}
        </Col>
        <Col md={4} className="pull-left">
          {this.renderLocationSearch()}
        </Col>
      </Row>
    );
  }

  render() {
    const { locationInfo } = this.props;
    const locationName = (locationInfo && (locationInfo.shortLabel || locationInfo.label)) || 'Location';

    return (
      <div className="LocationPage">
        <Helmet title={locationName} />
        {this.renderLocationHeader()}
        {this.renderCityProviders()}
      </div>
    );
  }
}

export default urlConnect(urlHandler, mapStateToProps)(LocationPage);
