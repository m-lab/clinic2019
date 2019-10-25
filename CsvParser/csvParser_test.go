package CsvParser

import (
	"testing"
	"reflect"
	"time"
)


func Test_CsvParserEntries(t *testing.T){

	tests := []struct {
		name string
		input string
		want DefaultIncident
	}{
		{
			name: "The first entry in the array",
			input: "newincidents.csv",
			want: DefaultIncident {time.Date(2013, time.September, 1, 0, 0, 0, 0, time.UTC), 
				time.Date(2015, time.September, 1, 0, 0, 0, 0, time.UTC), 0.318335, 134},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T){
			incidents := CsvParser(tt.input)
			got := incidents[0]
			if !reflect.DeepEqual(got, tt.want){
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CsvParserSize(t *testing.T){

	tests := []struct {
		name string
		input string
		want int
	}{
		{
			name: "The size of the incidents array",
			input: "newincidents.csv",
			want: 100,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T){
			incidents := CsvParser(tt.input)
			got := len(incidents)
			if !reflect.DeepEqual(got, tt.want){
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}

func Test_CsvParserFourthEntry(t *testing.T){

	tests := []struct {
		name string
		input string
		want DefaultIncident
	}{
		{
			name: "The first entry in the array",
			input: "newincidents.csv",
			want: DefaultIncident {time.Date(2015, time.January, 1, 0, 0, 0, 0, time.UTC), 
				time.Date(2017, time.August, 1, 0, 0, 0, 0, time.UTC), 0.433592, 65},
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T){
			incidents := CsvParser(tt.input)
			got := incidents[3]
			if !reflect.DeepEqual(got, tt.want){
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}