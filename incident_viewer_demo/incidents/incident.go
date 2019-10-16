package time
import "time"

type Incident interface {
	getGoodPeriod() (time.Time, time.Time)
	getBadPeriod() (time.Time, time.Time)
	getSeverity() float64
	getTestsAffected() int
}