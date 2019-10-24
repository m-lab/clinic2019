package CsvParser

import (
	"testing"
	"reflect"
)


func Test_CsvParser(t *testing.T){

	tests := []struct {
		name string
		input string
		want float64
	}{
		{
			name: "The first entry in the array",
			input: "newincidents.csv",
			want: 0.318335,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T){
			incidents := CsvParser(tt.input)
			got := incidents[0].getSeverity()
			if !reflect.DeepEqual(got, tt.want){
				t.Errorf("CsvParser() = %v, want %v", got, tt.want)
			}
		})
	}
}