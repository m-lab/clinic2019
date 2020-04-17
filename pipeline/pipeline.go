package pipeline

import (
	"os/exec"

	//csvParser "github.com/m-lab/clinic2019/CsvParser"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

type IncidentProducer interface {
	FindIncidents()
}

type AnalyzerIncidents struct{}

func (ai *AnalyzerIncidents) findIncidents() {
	exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
}

func runPipeline() []incident.DefaultIncident {
	// Run script that generates CSV
	var i AnalyzerIncidents
	i.findIncidents()
	csvParser.createHierarchy("incidents.csv", "/Users/jacquigiese/Desktop/incidents")
	// TODO: remove the csv file

}
