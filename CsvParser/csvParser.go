package CsvParser

import(
	"io"
	"fmt"
	"time"
  	"log"
	"os"
	"strconv"
	"encoding/csv"
	"strings"
)

type Incident interface {
	//getGoodPeriod() (time.Time, time.Time)
	getBadPeriod() (time.Time, time.Time)
	getSeverity() float64
	getTestsAffected() int
	getSeverityUnits() string
}

type DefaultIncident struct {
	//goodStartTime time.Time
	//goodEndTime   time.Time
	badStartTime  time.Time
	badEndTime    time.Time
	severity      float64
	testsAffected int
}

func (i *DefaultIncident) getSeverity() float64 {
	return i.severity
}

func (i *DefaultIncident) getTestsAffected() int {
	return i.testsAffected
}

func CsvParser(filePath string) [100]DefaultIncident{

	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
	var incidentArray [100]DefaultIncident

	const shortForm = "2006-01-02"

	f, err := os.Open(filePath)

	if err != nil{
		log.Fatalf("Cannot open '%s':%s\n", filePath, err.Error())
	}
	
	defer f.Close();

	reader := csv.NewReader(f);

	reader.Comma = ','

	//this reads the header and probably increments r
	rec, err := reader.Read();

	if err != nil{
		log.Fatal(err)
	}

	for i := 0 ; i < 100; i++{
	
		rec, err = reader.Read()

		// fmt.Print(rec)
		// fmt.Print("about to be weird")
		// fmt.Print(rec[0])

		if err != nil{
			if err == io.EOF{
				break
			}
			log.Fatal(err)
		}

		timeStartString := strings.Split(rec[3], " ");
		timeStart, _:= time.Parse(shortForm, timeStartString[1])
		
		timeEndString := strings.Split(rec[4], " ")
		timeEnd, _ := time.Parse(shortForm, timeEndString[1])
		
		severityString := strings.Split(rec[5], " ")
		severity, _ := strconv.ParseFloat(severityString[1], 64)
		//fmt.Print(severity)
		//fmt.Print(status)
		testsAffected, _ := strconv.Atoi(rec[0])
		//fmt.Print(testsAffected)

		defaultIncident := DefaultIncident{ timeStart, timeEnd, severity, testsAffected}

		incidentArray[i] = defaultIncident

	}

	return incidentArray
}

func main(){

	arrays := CsvParser("newincidents.cv")
	fmt.Print(arrays[0])
}