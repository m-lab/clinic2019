package pipeline

import (
	"reflect"
	"testing"
	"time"

	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

func Test_runPipeline(t *testing.T) {

	testIncident := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2019, time.April, 1, 0, 0, 0, 0, time.UTC),
		31.046068,
		21.27035,
		0.326146, 4788063)

	tests := []struct {
		name string

		// input string
		want incident.DefaultIncident
	}{
		{
			name: "Test that csv and incident arrays are generated",
			// input: "incidentfile.csv",
			want: *testIncident,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			incidents := runPipeline()
			got := incidents[0]
			// TODO: do I need to verify that something was written locally?
			// TODO: should I make a spy for the two functions i'm calling to make sure they're getting called?
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("runPipeline() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CsvParser_was_called() {

}
