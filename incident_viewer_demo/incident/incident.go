package incident

import (
	"strconv"
	"time"
)

/* All incident types must implement the Incident interface */
type Incident interface {
	MakeIncidentData(goodTimeStart time.Time, goodTimeEnd time.Time,
		badTimeStart time.Time,
		badTimeEnd time.Time,
		avgDSGood float64,
		avgDSBad float64,
		severityDecimal float64,
		testsAffected int)
	GetIncidentData() (time.Time, time.Time, time.Time, time.Time, float64, float64, float64, int, string, string, string)
}

/* This is the incident format for the JSON file */
type IncidentData struct {
	GoodPeriodStart  time.Time `json:"goodPeriodStart"`
	GoodPeriodEnd    time.Time `json:"goodPeriodEnd"`
	BadPeriodStart   time.Time `json:"badPeriodStart"`
	BadPeriodEnd     time.Time `json:"badPeriodEnd"`
	GoodPeriodMetric float64   `json:"goodPeriodMetric"`
	BadPeriodMetric  float64   `json:"badPeriodMetric"`
	Severity         float64   `json:"severity"`
	NumTestsAffected int       `json:"numTestsAffected"`
	GoodPeriodInfo   string    `json:"goodPeriodInfo"`
	BadPeriodInfo    string    `json:"badPeriodInfo"`
	IncidentInfo     string    `json:"incidentInfo"`
}

/* An incident for a 30% or more drop in download speed over a period of a year or longer */
type DefaultIncident struct {
	goodStartTime    time.Time
	goodEndTime      time.Time
	badStartTime     time.Time
	badEndTime       time.Time
	avgGoodDS        float64
	avgBadDS         float64
	severity         float64
	numTestsAffected int
	goodPeriodInfo   string
	badPeriodInfo    string
	incidentInfo     string
}

/* Create an IncidentData object to be stored in JSON format */
func (i *IncidentData) MakeJsonIncident(
	goodTimeStart time.Time,
	goodTimeEnd time.Time,
	badTimeStart time.Time,
	badTimeEnd time.Time,
	goodMetric float64,
	badMetric float64,
	severity float64,
	testsAffected int,
	goodPeriodInfo string,
	badPeriodInfo string,
	incidentInfo string) {

	i.GoodPeriodStart = goodTimeStart
	i.GoodPeriodEnd = goodTimeEnd
	i.BadPeriodStart = badTimeStart
	i.BadPeriodEnd = badTimeEnd
	i.GoodPeriodMetric = goodMetric
	i.BadPeriodMetric = badMetric
	i.Severity = severity
	i.NumTestsAffected = testsAffected
	i.GoodPeriodInfo = goodPeriodInfo
	i.BadPeriodInfo = badPeriodInfo
	i.IncidentInfo = incidentInfo
}

/* Assign data members and set appropriate text for information fields */
func (i *DefaultIncident) MakeIncidentData(goodTimeStart time.Time, goodTimeEnd time.Time,
	badTimeStart time.Time,
	badTimeEnd time.Time,
	avgDSGood float64,
	avgDSBad float64,
	severityDecimal float64,
	testsAffected int) {

	gds := strconv.FormatFloat(avgDSGood, 'f', 2, 64)
	bds := strconv.FormatFloat(avgDSGood, 'f', 2, 64)
	s := strconv.FormatFloat(severityDecimal*100, 'f', 2, 64)
	ta := strconv.Itoa(testsAffected)

	i.goodStartTime = goodTimeStart
	i.goodEndTime = goodTimeEnd
	i.badStartTime = badTimeStart
	i.badEndTime = badTimeEnd
	i.avgGoodDS = avgDSGood
	i.avgBadDS = avgDSBad
	i.severity = severityDecimal
	i.numTestsAffected = testsAffected
	i.goodPeriodInfo = "Average download speed: " + gds + " mb/s"
	i.badPeriodInfo = "Average download speed: " + bds + " mb/s"
	i.incidentInfo = "Download speed dropped by " + s + "% affecting " + ta + " tests"

}

/* Retrieve all Incident fields */
func (i *DefaultIncident) GetIncidentData() (time.Time, time.Time, time.Time, time.Time, float64, float64, float64, int, string, string, string) {
	return i.goodStartTime, i.goodEndTime, i.badStartTime, i.badEndTime, i.avgGoodDS, i.avgBadDS, i.severity, i.numTestsAffected, i.goodPeriodInfo, i.badPeriodInfo, i.incidentInfo
}
