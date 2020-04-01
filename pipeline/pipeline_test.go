package pipeline

import (
	"reflect"
	"testing"
	"time"

	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
	"github.com/m-lab/signal-searcher/analyzer"
)

type mockIncidentProducer struct{}

func (mock *mockIncidentProducer) findIncidents() []analyzer.Incident {
	inc := analyzer.Incident{
		Start:              time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		End:                time.Date(2019, time.April, 1, 0, 0, 0, 0, time.UTC),
		AffectedCount:      4788063,
		GoodPeriodDownload: 31.046068,
		BadPeriodDownload:  21.27035,
	}
	incArr := []analyzer.Incident{inc}
	return incArr
}

// TODO: make a fake implementation of the class that gets called and then use that
// to test hard coded input/output pairs
// type incidentArrayTest struct {
// 	arr [100]incident.DefaultIncident
// }

// func (i incidentArrayTest) findIncidents() [1]analyzer.Incident {
// 	inc := analyzer.Incident{
// 		Start:              time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
// 		End:                time.Date(2019, time.April, 1, 0, 0, 0, 0, time.UTC),
// 		AffectedCount:      4788063,
// 		GoodPeriodDownload: 31.046068,
// 		BadPeriodDownload:  21.27035,
// 	}
// 	incArr := [1]analyzer.Incident{inc}
// 	return incArr
// }

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
