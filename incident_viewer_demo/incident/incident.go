package incident

import (
	"strconv"
	"time"
)

type Incident interface {
	GetGoodPeriod() (time.Time, time.Time)
	GetBadPeriod() (time.Time, time.Time)
	GetSeverity() float64
	GetTestsAffected() int
	GetGoodPeriodInfo() string
	GetBadPeriodInfo() string
	GetIncidentInfo() string
}

type IncidentData struct {
	GoodPeriodStart  time.Time `json:"goodPeriodStart"`
	GoodPeriodEnd    time.Time `json:"goodPeriodEnd"`
	BadPeriodStart   time.Time `json:"badPeriodStart"`
	BadPeriodEnd     time.Time `json:"badPeriodEnd"`
	Severity         float64   `json:"severity"`
	NumTestsAffected int       `json:"numTestsAffected"`
	GoodPeriodInfo   string    `json:"goodPeriodInfo"`
	BadPeriodInfo    string    `json:"badPeriodInfo"`
	IncidentInfo     string    `json:"incidentInfo"`
}

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

func (i *DefaultIncident) Init(goodTimeStart time.Time, goodTimeEnd time.Time,
	badTimeStart time.Time,
	badTimeEnd time.Time,
	avgDSGood float64,
	avgDSBad float64,
	severity float64,
	testsAffected int) {

	i.goodStartTime = goodTimeStart
	i.goodEndTime = goodTimeEnd
	i.badStartTime = badTimeStart
	i.badEndTime = badTimeEnd
	i.avgGoodDS = avgDSGood
	i.avgBadDS = avgDSBad
	i.severityDecimal = severity
	i.numTestsAffected = testsAffected
}

func (i *DefaultIncident) GetGoodPeriod() (time.Time, time.Time) {
	return i.goodStartTime, i.goodEndTime
}

func (i *DefaultIncident) GetBadPeriod() (time.Time, time.Time) {
	return i.badStartTime, i.badEndTime
}

func (i *DefaultIncident) GetSeverity() float64 {
	return i.severityDecimal
}

func (i *DefaultIncident) GetTestsAffected() int {
	return i.numTestsAffected
}

func (i *DefaultIncident) GetGoodPeriodInfo() string {
	ds := strconv.FormatFloat(i.avgGoodDS, 'f', 2, 64)
	s := i.goodStartTime.String()
	e := i.goodEndTime.String()
	return "Average download speed: " + ds + " from " + s + " - " + e
}

func (i *DefaultIncident) GetBadPeriodInfo() string {
	ds := strconv.FormatFloat(i.avgBadDS, 'f', 2, 64)
	s := i.badStartTime.String()
	e := i.badEndTime.String()
	return "Average download speed: " + ds + " from " + s + " - " + e
}

func (i *DefaultIncident) GetIncidentInfo() string {
	s := strconv.FormatFloat(i.severityDecimal, 'f', 2, 64)
	ta := strconv.Itoa(i.numTestsAffected)
	return "Download speed dropped by " + s + " affecting " + ta + " tests"
}
