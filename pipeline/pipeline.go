// TODO: figure out how to run signal searcher from here
// TODO: and then pass that generated csv through csvparser
// TODO: so that it can make files in google cloud storage

package pipeline

import (
	"fmt"

	"github.com/m-lab/clinic2019/csvParser"
)

func runPipeline() {
	// Run script that generates CSV
	// exec.Command("bash", "-c", "go run github.com/m-lab/signal-searcher  | sort -nk1 > incidents.csv").Output()
	incidents := csvParser.CsvParser("incidents.csv")
	fmt.Printf("%d", len(incidents))

}
