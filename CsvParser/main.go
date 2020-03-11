package main
//"container/list"
import (
	"encoding/csv"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"os"
	"strconv"
	"strings"
	"time"
	"github.com/m-lab/clinic2019/incident_viewer_demo/incident"
)
// func CsvParser(filePath string, numIncidents ...int) []incident.DefaultIncident {
// 	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
// 	var defaultIncidents []incident.DefaultIncident = make([]incident.DefaultIncident, 0)
// 	var rec []string
// 	const shortForm = "2006-01-02"
// 	f, err := os.Open(filePath)
// 	if err != nil {
// 		log.Fatalf("Cannot open '%s':%s\n", filePath, err.Error())
// 	}
// 	defer f.Close()
// 	reader := csv.NewReader(f)
// 	reader.Comma = ','
// 	//Uncomment this if the csv file has a header
// 	// rec, err = reader.Read();
// 	// if err != nil{
// 	// 	log.Fatal(err)
// 	// }
// 	if len(numIncidents) > 1 {
// 		log.Fatal("Please only input one integer to signify the number of incidents you would like to generate.")
// 	}
// 	var i = 0
// 	for {
// 		rec, err = reader.Read()
// 		if len(numIncidents) == 1 && i == numIncidents[0] {
// 			break
// 		}
// 		if err != nil {
// 			if err == io.EOF {
// 				break
// 			}
// 			log.Fatal(err)
// 		}
// 		//knowing the structure of the csv file, retrieve some values
// 		badTimeStartString := strings.Split(rec[3], " ")
// 		timeStart, _ := time.Parse(shortForm, badTimeStartString[1])
// 		badTimeEndString := strings.Split(rec[4], " ")
// 		timeEnd, _ := time.Parse(shortForm, badTimeEndString[1])
// 		//the good period starts one year prior to the start of the bad period in this demo
// 		goodTimeStart := timeStart.AddDate(-1, 0, 0)
// 		goodTimeEnd := timeStart
// 		//the empty space string accounts for an empty space in the structure of the csv file
// 		severityString := strings.Split(rec[5], " ")
// 		severity, _ := strconv.ParseFloat(severityString[1], 64)
// 		testsAffected, _ := strconv.Atoi(rec[0])
// 		avgGoodDString := strings.Split(rec[6], " ")
// 		avgGoodDS, _ := strconv.ParseFloat(avgGoodDString[1], 64)
// 		avgBadDString := strings.Split(rec[7], " ")
// 		avgBadDS, _ := strconv.ParseFloat(avgBadDString[1], 64)
// 		locationString := strings.Split(rec[2], " ")[1]
// 		ASN := strings.Split(rec[1], " ")[1]
// 		defaultIncident := new(incident.DefaultIncident)
// 		defaultIncident.Init(goodTimeStart, goodTimeEnd, timeStart, timeEnd, avgGoodDS,
// 			avgBadDS, ASN, locationString, severity, testsAffected)
// 		defaultIncidents = append(defaultIncidents, *defaultIncident)
// 		i++
// 	}
// 	return defaultIncidents
// }
// //* This function takes in an array of 100 default incidents because that is what is provided by the csvParser above *//
// func convertDefaultIncidentToIncident(arr [100]incident.DefaultIncident) []incident.Incident {
// 	incidentArr := make([]incident.Incident, len(arr), len(arr))
// 	for i := range arr {
// 		incidentArr[i] = &arr[i]
// 	}
// 	return incidentArr
// }
// func makeJsonObjFile(arr []incident.Incident) *os.File {
// 	// numObjects determines how many incidents are stored in the json
// 	const numObjects = 1
// 	f, err := os.Create("incidents.json")
// 	var objs [numObjects]incident.IncidentData
// 	// incidentsList := list.New()
// 	// incidentsList = incidentsList.Init()
// 	if err != nil {
// 		log.Fatal(err)
// 		return f
// 	}
// 	for i := 0; i < numObjects; i++ {
// 		gpStart, gpEnd := arr[i].GetGoodPeriod()
// 		bpStart, bpEnd := arr[i].GetBadPeriod()
// 		gMetric := arr[i].GetGoodMetric()
// 		bMetric := arr[i].GetBadMetric()
// 		severity := arr[i].GetSeverity()
// 		testsAffected := arr[i].GetTestsAffected()
// 		gpInfo := arr[i].GetGoodPeriodInfo()
// 		bpInfo := arr[i].GetBadPeriodInfo()
// 		iInfo := arr[i].GetIncidentInfo()
// 		locationString := arr[i].GetLocation()
// 		ASN := arr[i].GetASN()
// 		inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, ASN, locationString, severity, testsAffected, gpInfo, bpInfo, iInfo}
// 		//incidentsList.PushBack(inc)
// 		objs[i] = inc
// 	}
// 	bytes, err := json.Marshal(objs)
// 	//bytes,err := json.Marshal(incidentsList)
// 	n, err := f.Write(bytes)
// 	if err != nil {
// 		log.Fatal(n)
// 		log.Fatal(err)
// 		f.Close()
// 		return f
// 	}
// 	return f
// }
// //convert a default incident that implements our interface to a less safe incident type to be dumped on .json file
// func convertDefaultIncidentToIncidentData(i incident.DefaultIncident) incident.IncidentData {
// 	gpStart, gpEnd := i.GetGoodPeriod()
// 	bpStart, bpEnd := i.GetBadPeriod()
// 	gMetric := i.GetGoodMetric()
// 	bMetric := i.GetBadMetric()
// 	severity := i.GetSeverity()
// 	testsAffected := i.GetTestsAffected()
// 	gpInfo := i.GetGoodPeriodInfo()
// 	bpInfo := i.GetBadPeriodInfo()
// 	iInfo := i.GetIncidentInfo()
// 	locationString := i.GetLocation()
// 	ASN := i.GetASN()
// 	inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, ASN, locationString, severity, testsAffected, gpInfo, bpInfo, iInfo}
// 	return inc
// }
// // break the location code into approapriate locations
// func breakTheLocCodeDown(locationCode string) []string {
// 	locationCodesArr := make([]string, 0)
// 	if (len(locationCode)) > 6 {
// 		for i := 0; i < 6; i = i + 2 {
// 			locationCodesArr = append(locationCodesArr, locationCode[i:i+2])
// 		}
// 		locationCodesArr = append(locationCodesArr, locationCode[6:])
// 		return locationCodesArr
// 	}
// 	for i := 0; i < len(locationCode); i = i + 2 {
// 		locationCodesArr = append(locationCodesArr, locationCode[i:i+2])
// 	}
// 	return locationCodesArr
// }
// //check if na or eu locations directories exist for example
// func doesDirExist(originPath string, dir string) bool {
// 	actualPath := originPath + "/" + dir
// 	if _, err := os.Stat(actualPath); !os.IsNotExist(err) {
// 		return true
// 	}
// 	return false
// }
// //check if a .json file of incidents for an asn(isp) exists in a specific location/dir
// func doesJsonFileExist(path string, asn string) (bool, string) {
// 	filePath := path + "/" + asn + ".json"
// 	info, err := os.Stat(filePath)
// 	if os.IsNotExist(err) || info.IsDir() {
// 		return false, filePath
// 	}
// 	return true, filePath
// }
// //construct location dir hierachy as you look at an incident and return the path that the incident ends up in
// func dynamicallyMakeDir(originPath string, locationCode string, asn string) string {
// 	locationCodeArr := breakTheLocCodeDown(locationCode)
// 	locationCodeArrLen := len(locationCodeArr)
// 	for i := 0; i < locationCodeArrLen; i++ {
// 		if !doesDirExist(originPath, locationCodeArr[i]) {
// 			os.Mkdir(originPath+"/"+locationCodeArr[i], os.ModePerm)
// 			// if err != nil {
// 			// 	fmt.Printf("Err\n")
// 			// 	log.Fatal(err)
// 			// 	//think about the implication of this error
// 			// }
// 		}
// 		originPath = originPath + "/" + locationCodeArr[i]
// 	}
// 	return originPath
// }
// func readJsonFileAddToIt(filenamepath string, i incident.DefaultIncident) {
// 	jsonFile, _ := os.Open(filenamepath)
// 	byteValue, _ := ioutil.ReadAll(jsonFile)
// 	var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
// 	json.Unmarshal(byteValue, &incidents)
// 	incidents = append(incidents, convertDefaultIncidentToIncidentData(i)) // add an incident to it
// 	result, _ := json.Marshal(incidents)
// 	os.Remove(filenamepath)
// 	f, _ := os.Create(filenamepath)
// 	n, err := f.Write(result)
// 	if err != nil {
// 		log.Fatal(n)
// 		log.Fatal(err)
// 	}
// 	defer f.Close()
// }
// //uses all the helper functions above to dynamically store incidents in a file tree hierachy
// func placeIncidentInFileStruct(originPath string, i incident.DefaultIncident) {
// 	//this will dynmamically create the dir to store the input incident if it needs to
// 	pathToJsonFile := dynamicallyMakeDir(originPath, i.GetLocation(), i.GetASN())
// 	fileExistance, filepath := doesJsonFileExist(pathToJsonFile, i.GetASN())
// 	if fileExistance {
// 		readJsonFileAddToIt(filepath, i)
// 		//return
// 	}

// 	if (!fileExistance) {

// 		var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
// 		incidents = append(incidents, convertDefaultIncidentToIncidentData(i)) // add an incident to it
// 		result, _ := json.Marshal(incidents)
// 		//fmt.Printf(string(result))
// 		f, _ := os.Create(filepath)
		
// 		n, err := f.Write(result)
// 		//fmt.Printf(string(result))
// 		fmt.Printf("\n")
// 		if err != nil {
// 			fmt.Printf("\n")
// 			fmt.Printf(filepath)
// 			fmt.Printf(err.Error())
// 			log.Fatal(n)
// 			log.Fatal(err)
// 			f.Close()
// 		}
// 		defer f.Close()

// 	}
	
// }

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

//* This function takes in an array of 100 default incidents because that is what is provided by the csvParser above *//
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
		asn := arr[i].GetASN()
		inc := incident.IncidentData{gpStart, gpEnd, bpStart, bpEnd, gMetric, bMetric, asn, locationString, severity, testsAffected, gpInfo, bpInfo, iInfo}

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

//check if a .json file of incidents for an asn(isp) exists in a specific location/dir
func jsonFileExists(path string, asn string) (bool, string) {
	filePath := path + "/" + asn + ".json"
	info, err := os.Stat(filePath)

	if os.IsNotExist(err) || info.IsDir() {
		return false, filePath
	}

	return true, filePath
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

//appends a new incident to an already existing json file of incidents in a specific directory
func readJsonFileAddToIt(filenamepath string, i incident.DefaultIncident) {
	jsonFile, _ := os.Open(filenamepath)
	byteValue, _ := ioutil.ReadAll(jsonFile)

	var incidents []incident.IncidentData = make([]incident.IncidentData, 0)

	json.Unmarshal(byteValue, &incidents)

	incidents = append(incidents, convertDefaultIncidentToIncidentData(i)) // add an incident to it

	result, _ := json.Marshal(incidents)

	os.Remove(filenamepath)

	f, _ := os.Create(filenamepath)
	n, err := f.Write(result)

	if err != nil {
		log.Fatal(n)
		log.Fatal(err.Error())
	}

	f.Close()

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

func incidentsMemPlacer(incArr []incident.DefaultIncident) map[string]map[string][]incident.IncidentData{

	incidentsMemMap := make(map[string]map[string][]incident.IncidentData)
	incNum := len(incArr)

	for i := 0; i < incNum; i++{
		// new location
		_, found := incidentsMemMap[incArr[i].GetLocation()]
		if  !found {

			incidentsAsnMap := make(map[string][]incident.IncidentData)
			var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
			incidentsAsnMap[incArr[i].GetASN()] = append(incidents, convertDefaultIncidentToIncidentData(incArr[i]))
			//value = incidentsAsnMap
			incidentsMemMap[incArr[i].GetLocation()] = incidentsAsnMap
		
		// already existing location
		} else {
			// new asn // may be use pointers instead
			_, valFound := incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()]
			if  !valFound {
				incidentsAsnMap, _ := incidentsMemMap[incArr[i].GetLocation()]
				var incidents []incident.IncidentData = make([]incident.IncidentData, 0)
				incidentsAsnMap[incArr[i].GetASN()] = append(incidents, convertDefaultIncidentToIncidentData(incArr[i]))

				incidentsMemMap[incArr[i].GetLocation()] = incidentsAsnMap
		
			//already existing asn
			} else {
				//var incidents []incident.IncidentData = incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()]
				incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()] = append(incidentsMemMap[incArr[i].GetLocation()][incArr[i].GetASN()], convertDefaultIncidentToIncidentData(incArr[i]))
			}
		
		}
	}

	return incidentsMemMap

}

func main() {
	os.Setenv("GOOGLE_APPLICATION_CREDENTIALS","//Users/clinc1920/Downloads/hmc-mlab-clinic-2019-bb5aabf9d64a.json")
	//incidentArray := CsvParser("incidentfile.csv")

	testIncident := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS13774x",
		"asjp",
		0.3565, 68089)

	testIncidentTwo := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS10774xhjkh",
		"anjp",
		0.6532, 68089)

	testIncidentThree := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS30774xkgg",
		"asjp",
		0.3565, 68089)

	testIncidentFour := new(incident.DefaultIncident)
	testIncident.Init(time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC).AddDate(-1, 0, 0),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2016, time.July, 1, 0, 0, 0, 0, time.UTC),
		time.Date(2018, time.April, 1, 0, 0, 0, 0, time.UTC),
		7.862733,
		5.334354,
		"AS32774xjk",
		"apjp",
		0.4565, 68089)

	incidentArrManual := make([]incident.DefaultIncident, 0)
	incidentArrManual = append(incidentArrManual, *testIncident)
	incidentArrManual = append(incidentArrManual, *testIncidentTwo)
	incidentArrManual = append(incidentArrManual, *testIncidentThree)
	incidentArrManual = append(incidentArrManual, *testIncidentFour)

	fmt.Printf("%d",len(incidentArrManual))
	fmt.Printf("\n")

	incidentsMap := incidentsMemPlacer(incidentArrManual)
	fmt.Printf("%d", len(incidentsMap))
	fmt.Printf("\n")
	fmt.Printf("%d", len(incidentsMap["asjp"]))
	fmt.Printf("\n")
	for key, val := range incidentsMap {
		fmt.Printf(key)
		fmt.Printf("\n")
		for k, _ := range val{
			fmt.Printf(k)
			fmt.Printf("\n")
			fmt.Printf("pascal")
		}
	}
	//fmt.Printf(incidentsMap)


	placeIncidentInFileStruct("/Users/clinc1920/go/src/github.com/m-lab/clinic2019/CsvParser", incidentsMap)
	
}