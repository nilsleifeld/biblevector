package embedding

import (
	"fmt"
	"strings"
)

func VectorToString(vector []float64) string {
	b := strings.Builder{}
	b.WriteRune('[')
	for i, v := range vector {
		b.WriteString(fmt.Sprintf("%f", v))
		if i != len(vector)-1 {
			b.WriteRune(',')
		}
	}
	b.WriteRune(']')
	return b.String()
}
