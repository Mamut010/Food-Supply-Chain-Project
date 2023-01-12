package utils

import (
	"time"
)

// ParseTime parses a timestamp in string form and returns the corresponding time.Time object.
// Conventional Go placeholders for Time:
// 1 --> Month
// 2 --> Day
// 3 --> Hour
// 4 --> Minute
// 5 --> Second
// 06 --> Last two digits of Year
// 2006 --> Full Year
// E.g.: To parse a timestamp into MM/DD/YY date format, the format passed to this function should be: 01/02/06.
// Note: If the format is incorrect or the given toParse string does not match the format, a time.Time object representing zero value is returned.
func ParseTime(toParse string, format string) time.Time {
	toTime, error := time.Parse(format, toParse)
	if error != nil {
		return time.Time{}
	}
	return toTime
}

// ParseTimeDefault parses a timestamp in MM/DD/YYYY format and return the corresponding time.Time object.
// Note: If the given toParse string does not match the format, a time.Time object representing zero value is returned
func ParseTimeDefault(toParse string) time.Time {
	// Format for MM/DD/YYYY is 1/2/2006
	return ParseTime(toParse, "1/2/2006")
}
