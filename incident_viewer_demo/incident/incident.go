package incident

import "time"

type Incident interface {
	goodPeriod() (time.Time, time.Time)
	badPeriod() (time.Time, time.Time)
	severity() float64
	testsAffected() int
	goodPeriodInfo() string
	badPeriodInfo() string
	incidentInfo() string
}

type DefaultIncident struct {
	goodStartTime    time.Time
	goodEndTime      time.Time
	badStartTime     time.Time
	badEndTime       time.Time
	severityDecimal  float64
	numTestsAffected int
}

func (i *DefaultIncident) goodPeriod() (time.Time, time.Time) {
	return i.goodStartTime, i.goodEndTime
}

func (i *DefaultIncident) badPeriod() (time.Time, time.Time) {
	return i.badStartTime, i.badEndTime
}

func (i *DefaultIncident) severity() float64 {
	return i.severityDecimal
}

func (i *DefaultIncident) testsAffected() int {
	return i.numTestsAffected
}

func (i *DefaultIncident) goodPeriodInfo() string {
	return "good info placeholder text"
}

func (i *DefaultIncident) badPeriodInfo() string {
	return "bad info placeholder text"
}

func (i *DefaultIncident) incidentInfo() string {
	return "incident info placeholder text"
}
