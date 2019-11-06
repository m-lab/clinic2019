package csvParser

import(
	"io"
	"time"
  	"log"
	"os"
	"strconv"
	"encoding/csv"
	"strings"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)


func CsvParser(filePath string) [100]incident.DefaultIncident{

	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
	var incidentArray [100]incident.DefaultIncident
	var rec []string
	const shortForm = "2006-01-02"

	f, err := os.Open(filePath)

	if err != nil{
		log.Fatalf("Cannot open '%s':%s\n", filePath, err.Error())
	}
	
	defer f.Close();

	reader := csv.NewReader(f);

	reader.Comma = ','

	//Uncomment this if the csv file has a header

	// rec, err = reader.Read();

	// if err != nil{
	// 	log.Fatal(err)
	// }

	
	for i := 0 ; i < 100; i++{
		
		rec, err = reader.Read()
		if err != nil{
			if err == io.EOF{
				break
			}
			log.Fatal(err)
		}

		//knowing the structure of the csv file, retrieve some values
		badTimeStartString := strings.Split(rec[3], " ");
		timeStart, _:= time.Parse(shortForm, badTimeStartString[1])
		
		badTimeEndString := strings.Split(rec[4], " ")
		timeEnd, _ := time.Parse(shortForm, badTimeEndString[1])
		
		goodTimeStart := timeStart.AddDate(-1,0,0)
		goodTimeEnd := timeStart

		severityString := strings.Split(rec[5], " ")
		severity, _ := strconv.ParseFloat(severityString[1], 64)
		
		testsAffected, _ := strconv.Atoi(rec[0])
	
		avgGoodDString := strings.Split(rec[6], " ")
		avgGoodDS, _ := strconv.ParseFloat(avgGoodDString[1], 64)

		avgBadDString :=  strings.Split(rec[7], " ")
		avgBadDS, _ := strconv.ParseFloat(avgBadDString[1], 64)

		defaultIncident := new(incident.DefaultIncident)
		
		defaultIncident.Init(goodTimeStart, goodTimeEnd, timeStart, timeEnd, avgGoodDS,
		avgBadDS, severity, testsAffected)

		incidentArray[i] = *defaultIncident

	}

	return incidentArray
}

 