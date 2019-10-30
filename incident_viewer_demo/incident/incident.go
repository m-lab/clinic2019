package incident

import (
	"strconv"
	"time"
)

type Incident interface {
	getGoodPeriod() (time.Time, time.Time)
	getBadPeriod() (time.Time, time.Time)
	getSeverity() float64
	getTestsAffected() int
	getGoodPeriodInfo() string
	getBadPeriodInfo() string
	getIncidentInfo() string
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

func (i *DefaultIncident) getGoodPeriod() (time.Time, time.Time) {
	return i.goodStartTime, i.goodEndTime
}

func (i *DefaultIncident) getBadPeriod() (time.Time, time.Time) {
	return i.badStartTime, i.badEndTime
}

func (i *DefaultIncident) getSeverity() float64 {
	return i.severityDecimal
}

func (i *DefaultIncident) getTestsAffected() int {
	return i.numTestsAffected
}

func (i *DefaultIncident) getGoodPeriodInfo() string {
	ds := strconv.FormatFloat(i.avgGoodDS, 'f', 2, 64)
	s := i.goodStartTime.String()
	e := i.goodEndTime.String()
	return "Average download speed: " + ds + " from " + s + " - " + e
}

func (i *DefaultIncident) getBadPeriodInfo() string {
	ds := strconv.FormatFloat(i.avgBadDS, 'f', 2, 64)
	s := i.badStartTime.String()
	e := i.badEndTime.String()
	return "Average download speed: " + ds + " from " + s + " - " + e
}

func (i *DefaultIncident) getIncidentInfo() string {
	s := strconv.FormatFloat(i.severityDecimal, 'f', 2, 64)
	ta := strconv.Itoa(i.numTestsAffected)
	return "Download speed dropped by " + s + " affecting " + ta + "tests"
}
