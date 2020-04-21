package main

import (
	"os"
	"os/exec"

	"github.com/m-lab/clinic2019/csvParser"
)

type IncidentProducer interface {
	FindIncidents()
}

type AnalyzerIncidents struct{}

func (ai *AnalyzerIncidents) findIncidents() {
	// I think this will generate the CSV without needing a cmd.Run()
	exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
}

func runPipeline() {
	// Run script that generates CSV
	var i AnalyzerIncidents
	i.findIncidents()
	// Use os.Getenv("HOME") to get the /Users/[username] path
	// When submitting, replace bucket name with "incidents-location-hierarchy"
	csvParser.CreateHierarchy("incidents.csv", "/Users/jacquigiese/Desktop/clinicTest/", "incident_mounting_test")
	// Remove the csv file
	os.Remove("incidents.csv")

}

func main() {
	runPipeline()
}
