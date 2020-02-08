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

func CsvParser(filePath string) [100]incident.DefaultIncident {

	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
	var incidentArray [100]incident.DefaultIncident
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

	for i := 0; i < 100; i++ {

		rec, err = reader.Read()
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
		goodTimeStart := timeStart.AddDate(-1, 0, 0)
		goodTimeEnd := timeStart

		//the empty space string accounts for an empty space in the structure of the csv file
		severityString := strings.Split(rec[5], " ")
		severity, _ := strconv.ParseFloat(severityString[1], 64)

		testsAffected, _ := strconv.Atoi(rec[0])

		avgGoodDString := strings.Split(rec[6], " ")
		avgGoodDS, _ := strconv.ParseFloat(avgGoodDString[1], 64)

		avgBadDString := strings.Split(rec[7], " ")
		avgBadDS, _ := strconv.ParseFloat(avgBadDString[1], 64)

		// NEW STYLE - use this instead
		incidentArray[i] = &incident.DefaultIncident{
			goodTimeStart, goodTimeEnd, timeStart, timeEnd, avgGoodDS,
			avgBadDS, severity, testsAffected
		}
	}

	return incidentArray
}

//* This function takes in an array of 100 default incidents because that is what is provided by the csvParser above *//
func convertDefaultIncidentToIncident(arr [100]incident.DefaultIncident) []incident.Incident {
	incidentArr := make([]incident.Incident, len(arr), len(arr))
	for i := range arr {
		incidentArr[i] = &arr[i]
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

	for i := 0; i < numObjects; i++ {
		gpStart, gpEnd := arr[i].GetGoodPeriod()
		bpStart, bpEnd := arr[i].GetBadPeriod()
		gMetric := arr[i].GetGoodMetric()
		bMetric := arr[i].GetBadMetric()
		severity := arr[i].GetSeverity()
		testsAffected := arr[i].GetTestsAffected()
		gpInfo := arr[i].GetGoodPeriodInfo()
		bpInfo := arr[i].GetBadPeriodInfo()
		iInfo := arr[i].GetIncidentInfo()
		inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, severity, testsAffected, gpInfo, bpInfo, iInfo}
		objs[i] = arr[i].MakeIncident()
	}
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
