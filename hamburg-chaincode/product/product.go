package product

import (
	"time"
)

// Product a product
type Product struct {
	DocType         string    `json:"docType"`
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Category        string    `json:"category"`
	Origin          string    `json:"origin"`
	UnitPrice       float64   `json:"unitPrice"`
	UnitMeasurement string    `json:"unitMeasurement"`
	Quantity        int       `json:"quantity"`
	ProductionDate  time.Time `json:"productionDate,omitempty"`
	ExpirationDate  time.Time `json:"expirationDate,omitempty"`
	ImageSource     string    `json:"imageSource"`
	Available       bool      `json:"available"` // This field indicates whether the product is available to be sold
}
