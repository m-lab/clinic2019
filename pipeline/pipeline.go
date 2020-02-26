package pipeline

import (
	"os/exec"

	csvParser "github.com/m-lab/clinic2019/CsvParser"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
	"github.com/m-lab/signal-searcher/analyzer"
)

type IncidentProducer interface {
	findIncidents() []analyzer.Incident
}

type incidentArray struct {
	arr [100]incident.DefaultIncident
}

func (i incidentArray) findIncidents() {
	exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
}

func runPipeline() [100]incident.DefaultIncident {
	// Run script that generates CSV
	var i incidentArray
	i.findIncidents()
	incidents := csvParser.CsvParser("incidents.csv")
	return incidents // eventually want to take this out
	// TODO: remove the csv file

}