package pipeline

import (
	"os"
	"os/exec"

	csvParser "github.com/m-lab/clinic2019/CsvParser"
)

var BUCKET_NAME = "incidents-location-hierarchy"
var INCIDENT_CSV = "incidents.csv"

func findIncidents() {
	runSignalSearcher := "go run github.com/m-lab/signal-searcher  | sort -nk1 > " + INCIDENT_CSV
	cmd := exec.Command("bash", "-c", runSignalSearcher)
	cmd.Run()
}

func runPipeline() {
	// Generate a CSV file of incidents
	findIncidents()

	// Temporary place a directory of incidents on the user's desktop to copy files to GCS
	usersPath := os.Getenv("HOME")
	incidentPath := usersPath + "/Desktop/generatedIncidents/"
	csvParser.CreateHierarchy(incidentPath, INCIDENT_CSV, BUCKET_NAME)

	// Remove CSV file and directory of incidents
	os.Remove(INCIDENT_CSV)
	os.RemoveAll(incidentPath)

}
