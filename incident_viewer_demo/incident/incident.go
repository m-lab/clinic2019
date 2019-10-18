package incident

import "time"

type Incident interface {
	getGoodPeriod() (time.Time, time.Time)
	getBadPeriod() (time.Time, time.Time)
	getSeverity() float64
	getTestsAffected() int
	getSeverityUnits() string
}

type DefaultIncident struct {
	goodStartTime time.Time
	goodEndTime   time.Time
	badStartTime  time.Time
	badEndTime    time.Time
	severity      float64
	testsAffected int
}

func (i *DefaultIncident) getGoodPeriod() (time.Time, time.Time) {
	return i.goodStartTime, i.goodEndTime
}

func (i *DefaultIncident) getBadPeriod() (time.Time, time.Time) {
	return i.badStartTime, i.badEndTime
}

func (i *DefaultIncident) getSeverity() float64 {
	return i.severity
}

func (i *DefaultIncident) getTestsAffected() int {
	return i.testsAffected
}

func (i *DefaultIncident) getSeverityUnits() string {
	return "percent"
}
