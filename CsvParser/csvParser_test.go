package csvParser

import (
	"os"
	"reflect"
	"testing"
	"time"
	"path/filepath"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

func Test_CsvParserEntries(t *testing.T) {

	testIncident := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2017, time.January, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2019, time.April, 1, 0, 0, 0, 0, time.UTC),
		31.046068,
		21.27035,
		"AS11486x",
		"naus",
		0.326146, 4788063)

	tests := []struct {
		name string

		input string
		want  incident.DefaultIncident
	}{
		{
			name:  "The first entry in the incidents array",
			input: "incidentfile.csv",
			want:  *testIncident,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			incidents := CsvParser(tt.input)
			got := incidents[0]
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CsvParserSize(t *testing.T) {

	tests := []struct {
		name  string
		input string
		want  int
	}{
		{
			name:  "The size of the incidents array",
			input: "incidentfile.csv",
			want:  100,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			incidents := CsvParser(tt.input)
			got := len(incidents)
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CsvParserFourthEntry(t *testing.T) {

	testIncident := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS10774x",
		"nauscalosangeles",
		0.321565, 68089)

	tests := []struct {
		name  string
		input string
		want  incident.DefaultIncident
	}{
		{
			name:  "The 50th entry in the incident array",
			input: "incidentfile.csv",
			want:  *testIncident,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			incidents := CsvParser(tt.input)
			got := incidents[50]
			if !reflect.DeepEqual(got, tt.want) {
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_MakeJsonObjFile(t *testing.T) {

	testIncidentArr := make([]incident.Incident, 1, 1)
	incidents := CsvParser("incidentfile.csv")
	testIncident := convertDefaultIncidentToIncident(incidents)
	testIncidentArr[0] = testIncident[0]

	tests := []struct {
		name  string
		input []incident.Incident
	}{
		{
			name:  "Create a file with one entry",
			input: testIncidentArr,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			makeJsonObjFile(tt.input)
			if _, err := os.Stat("incidents.json"); os.IsNotExist(err) {
				t.Errorf("File does not exist")
			}
		})
	}
}

func Test_FileHierachy(t *testing.T) {
	ex, err := os.Executable()
	if err != nil {
		panic(err)
	}
	originPath := filepath.Dir(ex)

	testIncident := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS10774x",
		"nauscaclaremont",
		0.3565, 68089)

	tests := []struct {
		name        string
		firstInput  string
		secondInput incident.DefaultIncident
	}{
		{
			name:        "Check of the directories are being created",
			firstInput:  originPath,
			secondInput: *testIncident,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			placeIncidentInFileStruct(tt.firstInput, tt.secondInput)
			if _, err := os.Stat(originPath + "/na/us"); os.IsNotExist(err) {
				t.Errorf("File does not exist")
			}
		})
	}
}
