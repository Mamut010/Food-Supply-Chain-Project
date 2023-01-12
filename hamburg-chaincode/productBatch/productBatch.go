package productBatch

import (
	"time"

	"github.com/hyperledger/fabric-samples/chaincode/thinh-chaincode/product"
)

// LocationEntryInfo stores current location, destination and time stamp at the arrival time of a product batch
type LocationEntryInfo struct {
	CurrentLocation  string    `json:"currentLocation"`
	Destination      string    `json:"destination"`
	ArrivalTimestamp time.Time `json:"ArrivalTimestamp"`
}

// Define a batch of products
type ProductBatch struct {
	DocType           string            `json:"docType"`
	ID                string            `json:"id"`
	Products          []product.Product `json:"products"`
	ManufacturerID    string            `json:"manufacturerID"`
	DistributorID     string            `json:"distributorID"`
	RetailerID        string            `json:"retailerID"`
	LocationEntryInfo LocationEntryInfo `json:"locationEntryInfo"`
	Status            string            `json:"status"`
}
