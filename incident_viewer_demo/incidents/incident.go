import "time"

type Incident interface {
	getGoodPeriod() (Time, Time)
	getBadPeriod() (Time, Time)
	getSeverity() float64
	getTestsAffected() int
}