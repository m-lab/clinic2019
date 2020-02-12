package pipeline

import (
	"fmt"

	"github.com/m-lab/clinic2019/csvParser"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

func runPipeline() [100]incident.DefaultIncident {
	// Run script that generates CSV
	// exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
	incidents := csvParser.CsvParser("incidents.csv")
	fmt.Printf("%d", len(incidents))
	return incidents // eventually want to take this out
	// TODO: remove the csv file

}
