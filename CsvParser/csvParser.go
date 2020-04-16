package csvParser

import (
	"encoding/csv"
	"encoding/json"
	"io"
	"log"
	"os"
	"strconv"
	"strings"
	"time"

	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)

func CsvParser(filePath string, numIncidents ...int) []incident.DefaultIncident {

	var defaultIncidents []incident.DefaultIncident = make([]incident.DefaultIncident, 0)
	var rec []string
	const shortForm = "2006-01-02"

	f, err := os.Open(filePath)

	if err != nil {
		log.Fatalf("Cannot open '%s':%s\n", filePath, err.Error())
	}

	defer f.Close()

	reader := csv.NewReader(f)

	reader.Comma = ','

	//Uncomment this if the csv file has a header

	// rec, err = reader.Read();

	// if err != nil{
	// 	log.Fatal(err)
	// }

	if len(numIncidents) > 1 {
		log.Fatal("Please only input one integer to signify the number of incidents you would like to generate.")
	}

	var i = 0
	for {
		rec, err = reader.Read()
		if len(numIncidents) == 1 && i == numIncidents[0] {
			break
		}
		if err != nil {
			if err == io.EOF {
				break
			}
			log.Fatal(err)

		}

		//knowing the structure of the csv file, retrieve some values
		badTimeStartString := strings.Split(rec[3], " ")
		timeStart, _ := time.Parse(shortForm, badTimeStartString[1])

		badTimeEndString := strings.Split(rec[4], " ")
		timeEnd, _ := time.Parse(shortForm, badTimeEndString[1])

		//the good period starts one year prior to the start of the bad period in this demo
		goodStartTime := timeStart.AddDate(-1, 0, 0)
		goodEndTime := timeStart

		//the empty space string accounts for an empty space in the structure of the csv file
		severityString := strings.Split(rec[5], " ")
		severity, _ := strconv.ParseFloat(severityString[1], 64)

		testsAffected, _ := strconv.Atoi(rec[0])

		avgGoodDString := strings.Split(rec[6], " ")
		avgGoodDS, _ := strconv.ParseFloat(avgGoodDString[1], 64)

		avgBadDString := strings.Split(rec[7], " ")
		avgBadDS, _ := strconv.ParseFloat(avgBadDString[1], 64)

		// Make an instance of a DefaultIncident that is compatible with the Incident interface
		defaultIncident := new(incident.DefaultIncident)
		defaultIncident.MakeIncidentData(goodStartTime, goodEndTime, timeStart, timeEnd, avgGoodDS, avgBadDS, severity, testsAffected)

		defaultIncidents = append(defaultIncidents, *defaultIncident)

		i++

	}
	return defaultIncidents
}

//* This function takes in an array of default incidents *//
func convertDefaultIncidentToIncident(defaultIncidents []incident.DefaultIncident) []incident.Incident {
	incidentArr := make([]incident.Incident, len(defaultIncidents), len(defaultIncidents))
	for i := range defaultIncidents {
		incidentArr[i] = &defaultIncidents[i]
	}
	return incidentArr
}

func makeJsonObjFile(arr []incident.Incident) *os.File {
	// numObjects determines how many incidents are stored in the json
	const numObjects = 1
	f, err := os.Create("incidents.json")
	var objs [numObjects]incident.IncidentData
	if err != nil {
		log.Fatal(err)
		return f
	}

	// Use data retrieved through the Incident interface to create incidents formatted for JSON
	for i := 0; i < numObjects; i++ {
		inc := arr[i]
		var incidentData = incident.IncidentData{}
		incidentData.MakeJsonIncident(inc.GetIncidentData())
		objs[i] = incidentData
	}

	// Write the incident JSON file
	bytes, err := json.Marshal(objs)
	n, err := f.Write(bytes)

	if err != nil {
		log.Fatal(n)
		log.Fatal(err)
		f.Close()
		return f
	}

	return f
}
