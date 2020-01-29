package pipeline

import (
	"testing"
)

func Test_runPipeline(t *testing.T) {

	// testIncident :=

	// tests := []struct {
	// 	name string

	// 	// input string
	// 	want  incident.DefaultIncident
	// }{
	// 	{
	// 		name:  "The first entry in the incidents array",
	// 		// input: "incidentfile.csv",
	// 		want:  *testIncident,
	// 	},
	// }

	// for _, tt := range tests {
	// t.Run(tt.name, func( /*t *testing.T*/ ) {
	runPipeline()
	// TODO: do I need to verify that something was written locally?
	// TODO: should I make a spy for the two functions i'm calling to make sure they're getting called?
	// if !reflect.DeepEqual(got, tt.want) {
	// 	t.Errorf("CsvParser() = %v, want %v", got, tt.want)
	// }
	// })
	// }
}
