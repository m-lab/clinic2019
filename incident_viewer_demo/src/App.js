import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import AutoWidth from 'react-auto-width';
import logo from './demo-logo-center.png';
import './App.scss';
import LineChartWithCounts from './LineChart/LineChartWithCounts.jsx'
import IspSelect from './IspSelect/IspSelect.jsx'
import * as moment from 'moment';
import 'bootstrap/dist/css/bootstrap.min.css';
import './chart_support/assets/base.scss';

//////////////////////////////////////////////////////////////////////////
// Handle all of the discombobulated variables that the chart takes in. //
//////////////////////////////////////////////////////////////////////////

// TODO(amy): put these lists into a seperate JSON file I can read into
var topClientIsps = [
  {
    "last_three_months_test_count": 1030768,
    "client_asn_name": "AT&T",
    "test_count": 20288358,
    "last_six_months_test_count": 3036374,
    "last_year_test_count": 6908186,
    "client_asn_number": "AS10774x",
    "id": "AS10774x",
    "label": "AT&T"
  },
  {
    "last_three_months_test_count": 927279,
    "client_asn_name": "Time Warner Cable",
    "test_count": 20512707,
    "last_six_months_test_count": 2670316,
    "last_year_test_count": 6351128,
    "client_asn_number": "AS10796x",
    "id": "AS10796x",
    "label": "Time Warner Cable"
  },
  {
    "last_three_months_test_count": 848520,
    "client_asn_name": "Verizon",
    "test_count": 16188648,
    "last_six_months_test_count": 2514377,
    "last_year_test_count": 5837213,
    "client_asn_number": "AS11486x",
    "id": "AS11486x",
    "label": "Verizon"
  },
  {
    "last_three_months_test_count": 368703,
    "client_asn_name": "CenturyLink",
    "test_count": 7760161,
    "last_six_months_test_count": 1053698,
    "last_year_test_count": 2532605,
    "client_asn_number": "AS11398x",
    "id": "AS11398x",
    "label": "CenturyLink"
  },
  {
    "last_three_months_test_count": 32560,
    "client_asn_name": "Level 3",
    "test_count": 495584,
    "last_six_months_test_count": 91749,
    "last_year_test_count": 200103,
    "client_asn_number": "AS10753x",
    "id": "AS10753x",
    "label": "Level 3"
  },
  {
    "last_three_months_test_count": 21649,
    "client_asn_name": "ONE",
    "test_count": 519834,
    "last_six_months_test_count": 65462,
    "last_year_test_count": 156433,
    "client_asn_number": "AS11492",
    "id": "AS11492",
    "label": "ONE"
  },
  {
    "last_three_months_test_count": 30205,
    "client_asn_name": "Midcontinent Media",
    "test_count": 358948,
    "last_six_months_test_count": 77736,
    "last_year_test_count": 155222,
    "client_asn_number": "AS11232",
    "id": "AS11232",
    "label": "Midcontinent Media"
  },
  {
    "last_three_months_test_count": 16867,
    "client_asn_name": "vanoppen.biz",
    "test_count": 363650,
    "last_six_months_test_count": 50197,
    "last_year_test_count": 118749,
    "client_asn_number": "AS11404",
    "id": "AS11404",
    "label": "vanoppen.biz"
  },
  {
    "last_three_months_test_count": 6680,
    "client_asn_name": "Cisco Systems",
    "test_count": 126282,
    "last_six_months_test_count": 33448,
    "last_year_test_count": 79286,
    "client_asn_number": "AS109",
    "id": "AS109",
    "label": "Cisco Systems"
  },
  {
    "last_three_months_test_count": 8272,
    "client_asn_name": "Logix",
    "test_count": 114708,
    "last_six_months_test_count": 25430,
    "last_year_test_count": 56394,
    "client_asn_number": "AS11215",
    "id": "AS11215",
    "label": "Logix"
  },
  {
    "last_three_months_test_count": 5841,
    "client_asn_name": "Aluminum Co. of America",
    "test_count": 40920,
    "last_six_months_test_count": 14479,
    "last_year_test_count": 33705,
    "client_asn_number": "AS10722",
    "id": "AS10722",
    "label": "Aluminum Co. of America"
  },
  {
    "last_three_months_test_count": 5573,
    "client_asn_name": "Spire Fiber",
    "test_count": 71055,
    "last_six_months_test_count": 14172,
    "last_year_test_count": 31630,
    "client_asn_number": "AS11272",
    "id": "AS11272",
    "label": "Spire Fiber"
  },
  {
    "last_three_months_test_count": 3722,
    "client_asn_name": "Oceanic Internet",
    "test_count": 87190,
    "last_six_months_test_count": 11326,
    "last_year_test_count": 27126,
    "client_asn_number": "AS10838",
    "id": "AS10838",
    "label": "Oceanic Internet"
  },
  {
    "last_three_months_test_count": 2906,
    "client_asn_name": "Internet Corp",
    "test_count": 67531,
    "last_six_months_test_count": 9160,
    "last_year_test_count": 24761,
    "client_asn_number": "AS10242",
    "id": "AS10242",
    "label": "Internet Corp"
  },
  {
    "last_three_months_test_count": 18,
    "client_asn_name": "Sprint Personal Communications Systems",
    "test_count": 230996,
    "last_six_months_test_count": 2611,
    "last_year_test_count": 17709,
    "client_asn_number": "AS10507",
    "id": "AS10507",
    "label": "Sprint Personal Communications Systems"
  },
  {
    "last_three_months_test_count": 2033,
    "client_asn_name": "Pioneer Long Distance",
    "test_count": 40292,
    "last_six_months_test_count": 6335,
    "last_year_test_count": 15008,
    "client_asn_number": "AS11650",
    "id": "AS11650",
    "label": "Pioneer Long Distance"
  },
  {
    "last_three_months_test_count": 2018,
    "client_asn_name": "Aerioconnect",
    "test_count": 28719,
    "last_six_months_test_count": 6329,
    "last_year_test_count": 14485,
    "client_asn_number": "AS10993",
    "id": "AS10993",
    "label": "Aerioconnect"
  },
  {
    "last_three_months_test_count": 1928,
    "client_asn_name": "Visionary Communications",
    "test_count": 37817,
    "last_six_months_test_count": 6522,
    "last_year_test_count": 13979,
    "client_asn_number": "AS10835",
    "id": "AS10835",
    "label": "Visionary Communications"
  },
  {
    "last_three_months_test_count": 2730,
    "client_asn_name": "Education Networks of America",
    "test_count": 29237,
    "last_six_months_test_count": 5753,
    "last_year_test_count": 11509,
    "client_asn_number": "AS11686",
    "id": "AS11686",
    "label": "Education Networks of America"
  },
  {
    "last_three_months_test_count": 1600,
    "client_asn_name": "Digital Service Consultants",
    "test_count": 18007,
    "last_six_months_test_count": 4807,
    "last_year_test_count": 11250,
    "client_asn_number": "AS10355",
    "id": "AS10355",
    "label": "Digital Service Consultants"
  }
];

var selectedClientIspInfo = [
  {
    "client_country": "United States",
    "location_key": "naus",
    "client_continent": "North America",
    "last_three_months_test_count": 848520,
    "client_country_code": "US",
    "client_asn_name": "Verizon",
    "test_count": 16188648,
    "client_continent_code": "NA",
    "last_six_months_test_count": 2514377,
    "last_year_test_count": 5837213,
    "client_asn_number": "AS11486x",
    "type": "country",
    "id": "naus_AS11486x",
    "label": "Verizon"
  },
  {
    "client_country": "United States",
    "location_key": "naus",
    "client_continent": "North America",
    "last_three_months_test_count": 1030768,
    "client_country_code": "US",
    "client_asn_name": "AT&T",
    "test_count": 20288358,
    "client_continent_code": "NA",
    "last_six_months_test_count": 3036374,
    "last_year_test_count": 6908186,
    "client_asn_number": "AS10774x",
    "type": "country",
    "id": "naus_AS10774x",
    "label": "AT&T"
  },
  {
    "client_country": "United States",
    "location_key": "naus",
    "client_continent": "North America",
    "last_three_months_test_count": 16867,
    "client_country_code": "US",
    "client_asn_name": "Wizard Cable",
    "test_count": 363650,
    "client_continent_code": "NA",
    "last_six_months_test_count": 50197,
    "last_year_test_count": 118749,
    "client_asn_number": "AS11404",
    "type": "country",
    "id": "naus_AS11404",
    "label": "Wizard Cable"
  }
];

function onSelectedClientIspsChange() {}

var chartId = "providers-time-series"
var colors = {naus_AS11486x: "rgb(69, 160, 58)", naus_AS11404: "rgb(125, 25, 125)", naus_AS10774x: "rgb(225, 166, 25)"}

// Reading and loading JSON files with sample data of an incident
var clientIspTimeSeriesData = require('./sample_data/custom_combined_isp_series.json');
var annotationTimeSeries = require('./sample_data/annotation_time_series_data.json');

// Convert series and annotationseries dates to moment objs
// var isp;
for (var isp in clientIspTimeSeriesData) {
  for (var i = 0; i < clientIspTimeSeriesData[isp].extents.date.length; i++) {
    clientIspTimeSeriesData[isp].extents.date[i] = moment(clientIspTimeSeriesData[isp].extents.date[i]);
    annotationTimeSeries.extents.date[i] = moment(annotationTimeSeries.extents.date[i]);
  }
  for (var j = 0; j < clientIspTimeSeriesData[isp].results.length; j++) {
    clientIspTimeSeriesData[isp].results[j].date = moment(clientIspTimeSeriesData[isp].results[j].date);
    annotationTimeSeries.results[j].date = moment(annotationTimeSeries.results[j].date);
  }
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
          <div className="client-isp-selector">
            <h5>Client ISPs</h5>
            {/* TODO(amy): onChange function needs to change, right now is an empty function. This function
                will handle the updating of the dropdown. (Similar to mouse over function on graph issue).
                Note: will need to update incident index based on what selected. Also will need to populate
                dropdown with only incident ISPs (righ now showing ALL). Will also need toggle the boolean
                display incident (show incident overlay or not). Icon component also not rendering, need to
                look at. Also look at the mlab-vis-client repo to make sure we add the ? helper icon */}
            <IspSelect
              isps={topClientIsps}
              selected={selectedClientIspInfo}
              onChange={onSelectedClientIspsChange}
            />
          </div>
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
