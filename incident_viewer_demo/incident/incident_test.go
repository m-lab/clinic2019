package incident

import (
	"reflect"
	"testing"
	"time"
)

type timeAr struct {
	start time.Time
	end   time.Time
}

func Test_goodPeriod(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name  string
		input DefaultIncident
		want  timeAr
	}{
		{
			name: "Return two time objects",
			input: DefaultIncident{time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
				time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC),
				time.Date(2001, 12, 12, 1, 0, 0, 0, time.UTC),
				time.Date(2002, 12, 12, 0, 0, 0, 0, time.UTC),
				0.5,
				123456,
			},
			want: timeAr{time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
				time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC)},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			s, e := (&tt.input).goodPeriod()
			got := timeAr{s, e}
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("goodPeriod() = %v, want %v", got, tt.want)
			}
		})
	}
}
