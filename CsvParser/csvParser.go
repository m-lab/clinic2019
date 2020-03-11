package csvParser

import (
	"fmt"
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

	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
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

		locationString := strings.Split(rec[2], " ")[1]

		ASN := strings.Split(rec[1], " ")[1]

		defaultIncident := new(incident.DefaultIncident)

		defaultIncident.Init(goodTimeStart, goodTimeEnd, timeStart, timeEnd, avgGoodDS,
			avgBadDS, ASN, locationString, severity, testsAffected)

		defaultIncidents = append(defaultIncidents, *defaultIncident)
		
		i++

	}
	return defaultIncidents
}

//convert a default incident that implements our interface to an incident object designed to exist in a json file
//It returns incident of type IncidentData to 
func convertDefaultIncidentToIncidentData(i incident.DefaultIncident) incident.IncidentData {
	gpStart, gpEnd := i.GetGoodPeriod()
	bpStart, bpEnd := i.GetBadPeriod()
	gMetric := i.GetGoodMetric()
	bMetric := i.GetBadMetric()
	severity := i.GetSeverity()
	testsAffected := i.GetTestsAffected()
	gpInfo := i.GetGoodPeriodInfo()
	bpInfo := i.GetBadPeriodInfo()
	iInfo := i.GetIncidentInfo()
	locationString := i.GetLocation()
	asn := i.GetASN()
	inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, asn, locationString, severity, testsAffected, gpInfo, bpInfo, iInfo}
	return inc
}

//Takes in a location code and breaks it down into different location levels
//Returns an array of string, where each string represents a location
func parseLocationCode(locationCode string) []string {
	locationCodesArr := make([]string, 0)

	if (len(locationCode)) > 6 {
		for i := 0; i < 6; i = i + 2 {
			locationCodesArr = append(locationCodesArr, locationCode[i:i+2])
		}

		locationCodesArr = append(locationCodesArr, locationCode[6:])

		return locationCodesArr
	}

	for i := 0; i < len(locationCode); i = i + 2 {
		locationCodesArr = append(locationCodesArr, locationCode[i:i+2])
	}

	return locationCodesArr
}

//checks if a specific directory, which corresponds to a specifi location, has been made
//Returns a bool
func dirExists(originPath string, dir string) bool {
	actualPath := originPath + "/" + dir

	if _, err := os.Stat(actualPath); !os.IsNotExist(err) {
		return true
	}

	return false
}

//constructs incidents file hierarchy on basis of an incident location code
//construction happens dynamically and returns the path where an incident ends up sitting on the disk 
func dynamicallyMakeDir(originPath string, locationCode string) string {
	locationCodeArr := parseLocationCode(locationCode)
	locationCodeArrLen := len(locationCodeArr)

	for i := 0; i < locationCodeArrLen; i++ {

		if !dirExists(originPath, locationCodeArr[i]) {
			err := os.MkdirAll(originPath+"/"+locationCodeArr[i], 0755)

			if err != nil {
				log.Fatal(err)
			}
		}

		originPath = originPath + "/" + locationCodeArr[i]
	}

	return originPath
}

//uses all the helper functions above to dynamically store incidents in a file tree hierachy
func placeIncidentInFileStruct(originPath string, incMap map[string]map[string][]incident.IncidentData) {
	//this will dynmamically create the dir to store the input incident if it needs to

	for key, value := range incMap {
		pathToAsnJsonFiles := dynamicallyMakeDir(originPath, key)

		for asnkey, asnValue := range value {
			filePath := pathToAsnJsonFiles + "/" + asnkey + ".json"
			f, err := os.Create(filePath)

			if err != nil {
				fmt.Printf(err.Error())
				fmt.Printf("\n")
				return
			}
			
			result, errorMarshal := json.Marshal(asnValue)

			if errorMarshal != nil {
				fmt.Printf(errorMarshal.Error())
				fmt.Printf("\n")
				return			

			}

			n, errWrite := f.Write(result)

			if errWrite != nil {
				fmt.Printf(errWrite.Error())
				fmt.Printf("\n")
				fmt.Printf("%d",n)				
				return
			}

			errClose := f.Close()

			if errClose != nil {
				fmt.Printf(errClose.Error())
				fmt.Print("\n")
				return

			}
		}
	}
}

//given an array of an incidents, this function places them in a map with every location having asn map of incidents
//mapped to it
func incidentsMemPlacer(incArr []incident.DefaultIncident) map[string]map[string][]incident.IncidentData{

	incidentsMemMap := make(map[string]map[string][]incident.IncidentData)
	incNum := len(incArr)

	for i := 0; i < incNum; i++{

		// new location
		_, found := incidentsMemMap[incArr[i].GetLocation()]
		if  (!found) {
			incidentsAsnMap := make(map[string][]incident.IncidentData)
			var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
			incidentsAsnMap[incArr[i].GetASN()] = append(incidents, convertDefaultIncidentToIncidentData(incArr[i]))
			incidentsMemMap[incArr[i].GetLocation()] = incidentsAsnMap
		
		} else {
			// new asn within an existing location
			_, valFound := incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()]
			if  !valFound {
				var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
				incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()] = append(incidents, convertDefaultIncidentToIncidentData(incArr[i]))
		
			//already existing asn within an exisiting location
			} 
			if (valFound) {
				incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()] = append(incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()], convertDefaultIncidentToIncidentData(incArr[i]))
			}
		}
	}

	return incidentsMemMap
}