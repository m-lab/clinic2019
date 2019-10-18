package time

import(
	"io"
	"time"
  	"log"
	"os"
	"strconv"
	"encoding/csv"
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

func CsvParser(filePath string) [100]DefaultIncident{

	//just assume that you have 100 rows in the csv and then return an array of 1OO incidents
	var incidentArray [100]DefaultIncident

	const shortForm = "2006-02-24"

	f, err := os.Open(filePath)

	if err != nil{
		log.Fatalf("Cannot open '%s':%s\n", filePath, err.Error())
	}
	
	defer f.Close();

	reader := csv.NewReader(f);

	reader.Comma = ';'

	//this reads the header and probably increments r
	rec, err := reader.Read();

	if err != nil{
		log.Fatal(err)
	}

	for i := 1 ; i < 100; i++{
	
		rec, err = reader.Read()

		if err != nil{
			if err == io.EOF{
				break
			}
			log.Fatal(err)
		}

		timeStart, _ := time.Parse(shortForm, rec[3])
		timeEnd, _ := time.Parse(shortForm, rec[4])
		severity, _ := strconv.ParseFloat(rec[5], 32)
		testsAffected, _ := strconv.Atoi(rec[0])

		defaultIncident := DefaultIncident{ timeStart, timeEnd, severity, testsAffected}

		incidentArray[i] = defaultIncident

	}

	return incidentArray
}