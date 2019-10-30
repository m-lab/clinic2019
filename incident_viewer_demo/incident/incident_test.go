package incident

import (
	"reflect"
	"testing"
	"time"
)

/* Incident used for testing */
var i DefaultIncident = DefaultIncident{time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
	time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC),
	time.Date(2001, 12, 12, 1, 0, 0, 0, time.UTC),
	time.Date(2002, 12, 12, 0, 0, 0, 0, time.UTC),
	50.2,
	25.1,
	0.5,
	123456,
}

/* Struct used for testing a time period */
type timeAr struct {
	start time.Time
	end   time.Time
}

func Test_getGoodPeriod(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name  string
		input DefaultIncident
		want  timeAr
	}{
		{
			name:  "Return two time objects for the good period",
			input: i,
			want: timeAr{time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
				time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC)},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s, e := (&tt.input).getGoodPeriod()
			got := timeAr{s, e}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getGoodPeriod() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getBadPeriod(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name  string
		input DefaultIncident
		want  timeAr
	}{
		{
			name:  "Return two time objects for the bad period",
			input: i,
			want: timeAr{time.Date(2001, 12, 12, 1, 0, 0, 0, time.UTC),
				time.Date(2002, 12, 12, 0, 0, 0, 0, time.UTC)},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s, e := (&tt.input).getBadPeriod()
			got := timeAr{s, e}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getBadPeriod() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getSeverity(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name  string
		input DefaultIncident
		want  float64
	}{
		{
			name:  "Return a decimal number between 0 and 1 representing the severity",
			input: i,
			want:  0.5,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := (&tt.input).getSeverity()
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getSeverity() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_getTestsAffected(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name  string
		input DefaultIncident
		want  int
	}{
		{
			name:  "Return an integer number representing the number of tests affected",
			input: i,
			want:  123456,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got := (&tt.input).getTestsAffected()
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getTestsAffected() = %v, want %v", got, tt.want)
			}
		})
	}
}
