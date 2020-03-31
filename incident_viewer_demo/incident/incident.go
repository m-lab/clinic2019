package incident

import (
	"time"
)

//* All incident types must implement the Incident interface *//
type Incident interface {
	MakeIncidentData() *IncidentData // put all below methods into this one
	// GetGoodPeriod() (time.Time, time.Time)
	// GetBadPeriod() (time.Time, time.Time)
	// GetGoodMetric() float64
	// GetBadMetric() float64
	// GetSeverity() float64
	// GetTestsAffected() int
	// GetGoodPeriodInfo() string
	// GetBadPeriodInfo() string
	// GetIncidentInfo() string
}

//* This is the incident format for the JSON file *//
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

//* An incident for a 30% or more drop in download speed over a period of a year or longer *//
type DefaultIncident struct {
	goodStartTime    time.Time
	goodEndTime      time.Time
	badStartTime     time.Time
	badEndTime       time.Time
	avgGoodDS        float64
	avgBadDS         float64
	severityDecimal  float64
	numTestsAffected int
}

//**************************************//
//    		CONSTRUCTORS
//**************************************//

// func (i *IncidentData) Init(
// 	goodTimeStart time.Time,
// 	goodTimeEnd time.Time,
// 	badTimeStart time.Time,
// 	badTimeEnd time.Time,
// 	goodMetric float64,
// 	badMetric float64,
// 	severity float64,
// 	testsAffected int,
// 	goodPeriodInfo string,
// 	badPeriodInfo string,
// 	incidentInfo string) {

// 	i.GoodPeriodStart = goodTimeStart
// 	i.GoodPeriodEnd = goodTimeEnd
// 	i.BadPeriodStart = badTimeStart
// 	i.GoodPeriodMetric = goodMetric
// 	i.BadPeriodMetric = badMetric
// 	i.BadPeriodEnd = badTimeEnd
// 	i.Severity = severity
// 	i.NumTestsAffected = testsAffected
// 	i.GoodPeriodInfo = goodPeriodInfo
// 	i.BadPeriodInfo = badPeriodInfo
// 	i.IncidentInfo = incidentInfo
// }

// func (i *DefaultIncident) Init(goodTimeStart time.Time, goodTimeEnd time.Time,
// 	badTimeStart time.Time,
// 	badTimeEnd time.Time,
// 	avgDSGood float64,
// 	avgDSBad float64,
// 	severity float64,
// 	testsAffected int) {

// 	i.goodStartTime = goodTimeStart
// 	i.goodEndTime = goodTimeEnd
// 	i.badStartTime = badTimeStart
// 	i.badEndTime = badTimeEnd
// 	i.avgGoodDS = avgDSGood
// 	i.avgBadDS = avgDSBad
// 	i.severityDecimal = severity
// 	i.numTestsAffected = testsAffected
// }

//**************************************//
//    		GETTER METHODS
//**************************************//

// func (i *DefaultIncident) GetGoodPeriod() (time.Time, time.Time) {
// 	return i.goodStartTime, i.goodEndTime
// }

// func (i *DefaultIncident) GetBadPeriod() (time.Time, time.Time) {
// 	return i.badStartTime, i.badEndTime
// }

// func (i *DefaultIncident) GetGoodMetric() float64 {
// 	return i.avgGoodDS
// }

// func (i *DefaultIncident) GetBadMetric() float64 {
// 	return i.avgBadDS
// }

// func (i *DefaultIncident) GetSeverity() float64 {
// 	return i.severityDecimal
// }

// func (i *DefaultIncident) GetTestsAffected() int {
// 	return i.numTestsAffected
// }

// func (i *DefaultIncident) GetGoodPeriodInfo() string {
// 	ds := strconv.FormatFloat(i.avgGoodDS, 'f', 2, 64)
// 	return "Average download speed: " + ds + " mb/s"
// }

// func (i *DefaultIncident) GetBadPeriodInfo() string {
// 	ds := strconv.FormatFloat(i.avgBadDS, 'f', 2, 64)
// 	return "Average download speed: " + ds + " mb/s"
// }

// func (i *DefaultIncident) GetIncidentInfo() string {
// 	s := strconv.FormatFloat(i.severityDecimal*100, 'f', 2, 64)
// 	ta := strconv.Itoa(i.numTestsAffected)
// 	return "Download speed dropped by " + s + "% affecting " + ta + " tests"
// }
