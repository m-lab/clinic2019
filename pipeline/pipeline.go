package pipeline

import (
	"os"
	"os/exec"

	//csvParser "github.com/m-lab/clinic2019/CsvParser"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

type IncidentProducer interface {
	FindIncidents()
}

type AnalyzerIncidents struct{}

func (ai *AnalyzerIncidents) findIncidents() {
	// I think this will generate the CSV without needing a cmd.Run()
	exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
}

func runPipeline() []incident.DefaultIncident {
	// Run script that generates CSV
	var i AnalyzerIncidents
	i.findIncidents()
	// Use os.Getenv("HOME") to get the /Users/[username] path
	// When submitting, replace bucket name with "incidents-location-hierarchy"
	csvParser.createHierarchy("incidents.csv", "/Users/jacquigiese/Desktop/incidentFileHierarchy", "incident_mounting_test")
	// TODO: remove the csv file
	os.Remove("incidents.csv")

}
