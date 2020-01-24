package csvParser

import (
	"builtin"
	"fmt"
	"encoding/csv"
	"container/list"
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

		locationString := strings.Split(rec[2], " ")[1]
		
		ASN := strings.Split(rec[1], " ")[1]
		

		defaultIncident := new(incident.DefaultIncident)

		defaultIncident.Init(goodTimeStart, goodTimeEnd, timeStart, timeEnd, avgGoodDS,
			avgBadDS, ASN, locationString, severity, testsAffected)

		incidentArray[i] = *defaultIncident

	}

	return incidentArray
}

func convertDefaultIncidentToIncident(arr []incident.DefaultIncident) []incident.Incident {
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
	// incidentsList := list.New()
	// incidentsList = incidentsList.Init()

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
		locationString := arr[i].GetLocation()
		ASN := arr[i].GetASN()
		inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, ASN, locationString, severity, testsAffected, gpInfo, bpInfo, iInfo}
		
		//incidentsList.PushBack(inc)
		objs[i] = inc
	}
	bytes, err := json.Marshal(objs)
	//bytes,err := json.Marshal(incidentsList)
	n, err := f.Write(bytes)

	if err != nil {
		log.Fatal(n)
		log.Fatal(err)
		f.Close()
		return f
	}
	

	return f
}

func breakTheLocCodeDown(locationCode string) []string{
	
	locationCodesArr := make([]string, 0)
	 
	if (len(locationCode)) > 6 {
		for i := 0; i < 6; i = i + 2 {
			append(locationCodesArr, locationCode[i:i+2])
		}

		append(locationCodesArr, locationCode[6:])
		return locationCodesArr
	}

	for i := 0; i < len(locationCode); i = i + 2 {
		append(locationCodesArr, locationCodesArr[i:i+2])
	}

	return locationCodesArr
	
}

//check if na or eu exist for example
func doesDirExist(originPath string, dir string) bool {
	actualPath := originPath + "/" + dir

	if _, err := os.Stat(actualPath); !os.IsNotExist(err) {
		return true
	}

	return false
}

func doesJsonFileExist(path string, asn string) (bool, string) {
	
	filepath := path + "/" +  asn + ".json"
	info, err := os.Stat(filePath)

	if (os.IsNotExist(err) || info.IsDir()) {
		return false, ""
	}

	return true, filepath // make sure this a file not a dir
}

//have this return the final path for now 
func dynamicallyMakeDir(originPath string, locationCode string, asn string) string {
	//just return the path for now and think deep later 

	locationCodeArr := breakTheLocCodeDown(locationCode)
	locationCodeArrLen := len(locationCodeArr)

	for i := 0; locationCodeArrLen; i++ {

		if !doesDirExist(originPath, locationCodeArr[i]) {
			err := MkdirAll(originPath + "/" + locationCodeArr[i])

			if err != nil {
		  		t.Fatalf("MkdirAll %q: %s", originPath, err)
			}
		}

		originPath = originPath + "/" + locationCodeArr[i]

	}

	if doesJsonFileExist(originPath, asn) {
		// now add incident to this file because its asp file is present
		//file out how to add incident to a file
	}

	//the else case of creating a file and adding the incident to it

	return originPath
	
}

func readJsonFileAddToIt(filenamepath string, incident incident.Incident) {
	
	//Open Json file

	jsonFile, err := os.Open(filenamepath)

	byteValue, _ := ioutil.ReadAll(jsonFile)

	var incidents []incident.Incident

	json.Unmarshal (byteValue, &incidents)

	incidents = append(incidents, incident)

	result, err := json.Marshal(incidents)

	var err = os.Remove(filenamepath)


}

func placeIncidentInFileStruct(incident incident.Incident) {
	// call the right function that end up putting the incident in the right location
}