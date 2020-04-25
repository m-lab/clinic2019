package pipeline

import (
	"os"
	"os/exec"

	"github.com/m-lab/clinic2019/csvParser"
)

var BUCKET_NAME = "incidents-location-hierarchy"

// var BUCKET_NAME = "incident_mounting_test"
var INCIDENT_CSV = "incidents.csv"

type IncidentProducer interface {
	findIncidents()
}

type AnalyzerIncidents struct{}

func (ai *AnalyzerIncidents) findIncidents() {
	runSignalSearcher := "go run github.com/m-lab/signal-searcher  | sort -nk1 > " + INCIDENT_CSV
	cmd := exec.Command("bash", "-c", runSignalSearcher)
	cmd.Run()
}

func runPipeline() {
	// Run script that generates CSV of incidents
	var i AnalyzerIncidents
	i.findIncidents()

	// Temporary place a directory of incidents on the user's desktop to copy files to GCS
	usersPath := os.Getenv("HOME")
	incidentPath := usersPath + "/Desktop/generatedIncidents/"
	csvParser.CreateHierarchy(incidentPath, INCIDENT_CSV, BUCKET_NAME)

	// Remove CSV file and directory of incidents
	os.Remove(INCIDENT_CSV)
	os.RemoveAll(incidentPath)

}
