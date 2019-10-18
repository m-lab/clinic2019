package incident

import (
	"testing"
	"time"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

func Test_getGoodPeriod(t *testing.T) {
	type args struct {
	}
	tests := []struct {
		name string
		input DefaultIncident
		want time.Time, time.Time
	}{
		{
			name: "Return two time objects"
			input: DefaultIncident{time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
									time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC),
									time.Date(2001, 12, 12, 1, 0, 0, 0, time.UTC),
									time.Date(2002, 12, 12, 0, 0, 0, 0, time.UTC),
									0.5,
									123456
								}
			want: time.Date(2000, 12, 12, 0, 0, 0, 0, time.UTC),
			time.Date(2001, 12, 12, 0, 0, 0, 0, time.UTC),
		}
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := getGoodPeriod(tt.input); !reflect.DeepEqual(got, tt.want) {
				t.Errorf("getGoodPeriod() = %v, want %v", got, tt.want)
			}
		})
	}
}
