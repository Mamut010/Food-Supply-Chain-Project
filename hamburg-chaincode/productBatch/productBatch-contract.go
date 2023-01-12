package productBatch

import (
	"encoding/json"
	"errors"
	"fmt"
	"time"

	"github.com/hyperledger/fabric-chaincode-go/shim"
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
	"github.com/hyperledger/fabric-samples/chaincode/thinh-chaincode/product"
	"github.com/hyperledger/fabric-samples/chaincode/thinh-chaincode/utils"
)

// ProductBatchContract contract for handling a product batch's writing and reading from the world state
type ProductBatchContract struct {
	contractapi.Contract
}

// HistoryBatchQueryResult structure used for returning the result of history query
type HistoryBatchQueryResult struct {
	Record    *ProductBatch `json:"record"`
	TxId      string        `json:"txId"`
	Timestamp time.Time     `json:"timestamp"`
	IsDelete  bool          `json:"isDelete"`
}

const index = "status~name"
const docType = "productBatch"

// Helper function to get the current timestamp
func getCurrentTime(ctx utils.RoleBasedTransactionContextInterface) time.Time {
	currentTime, err := ctx.GetStub().GetTxTimestamp()
	if err != nil {
		fmt.Println(err)
		return time.Time{}
	}

	return currentTime.AsTime()
}

// Helper function to return the delivery status over given locations
func updateStatus(ctx utils.RoleBasedTransactionContextInterface, batchID string, newLocation string) (string, error) {
	productBatchBytes, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return "", errors.New("unable to interact with the world state")
	}

	var productBatch ProductBatch
	err = json.Unmarshal(productBatchBytes, &productBatch)
	if err != nil {
		return "", err
	}
	currentLocation := productBatch.LocationEntryInfo.CurrentLocation
	destination := productBatch.LocationEntryInfo.Destination
	if currentLocation != "" {
		if destination == newLocation && productBatch.RetailerID != "" {
			productBatch.Status = "Arrived"
		} else if destination != "" && destination != newLocation {
			productBatch.Status = "Out for delivery"
		} else {
			productBatch.Status = "Packaging"
		}
	}
	return productBatch.Status, nil
}

// CreateProductBatch adds a new batch of product to the world state using id as key
func (s *ProductBatchContract) CreateProductBatch(ctx utils.RoleBasedTransactionContextInterface, batchID string,
	productID string, quantity int, manufacturerID string, currentLocation string) error {

	// Check the role of client
	role := ctx.GetRole()
	if role != "Manufacturer" {
		return fmt.Errorf("cannot create a new batch id %s with role %s as manufacturer privilege needed", batchID, role)
	}

	// Check if a product batch is already exist
	existing, err := ctx.GetStub().GetState(batchID)

	if err != nil {
		return errors.New("unable to interact with the world state")
	} else if existing != nil {
		return fmt.Errorf("cannot create a new product batch in the world state as id %s already exists", batchID)
	}

	var products []product.Product
	productBytes, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return errors.New("unable to interact with the world state")
	} else if productBytes == nil {
		return fmt.Errorf("cannot create a new product batch in the world state as the product of id %s not exist", productID)
	}

	var loadedProduct product.Product
	var newQuantity int
	err = json.Unmarshal(productBytes, &loadedProduct)
	if err != nil {
		return err
	} else if !loadedProduct.Available {
		return fmt.Errorf("cannot create a batch id %s related to this product id %s as its not available to be sold", batchID, productID)
	}

	if quantity > loadedProduct.Quantity {
		return fmt.Errorf("cannot create a batch id %s related to this product id %s as maximum allowed quantity exceeded", batchID, productID)
	} else {
		newQuantity = loadedProduct.Quantity - quantity
		loadedProduct.Quantity = quantity
	}

	products = append(products, loadedProduct)

	productBatch := new(ProductBatch)
	productBatch.DocType = docType
	productBatch.ID = batchID
	productBatch.Products = products
	productBatch.ManufacturerID = manufacturerID
	productBatch.DistributorID = ""
	productBatch.RetailerID = ""
	productBatch.LocationEntryInfo = LocationEntryInfo{currentLocation, "", getCurrentTime(ctx)}
	productBatch.Status = "Order Confirmed"

	batchBytes, _ := json.Marshal(productBatch)

	// Update new quantity to product
	loadedProduct.Quantity = newQuantity
	err = product.SaveUpdate(ctx, &loadedProduct)
	if err != nil {
		return err
	}

	// Put obj in the world state
	err = ctx.GetStub().PutState(batchID, []byte(batchBytes))

	if err != nil {
		return errors.New("unable to interact with the world state")
	}

	//  Create an index to enable category-based range queries.
	//  This will enable very efficient state range queries based on composite keys matching indexName~status~*
	statusBatchIndexKey, err := ctx.GetStub().CreateCompositeKey(index, []string{productBatch.Status, productBatch.ID})
	if err != nil {
		return err
	}

	//  Save index entry to world state. Only the key name is needed, no need to store a duplicate copy of the batch.
	//  Note - passing a 'nil' value will effectively delete the key from state, therefore we pass null character as value
	value := []byte{0x00}
	return ctx.GetStub().PutState(statusBatchIndexKey, value)
}

// ReadProductBatch retrieves a product batch from the ledger
func (s *ProductBatchContract) ReadProductBatch(ctx utils.RoleBasedTransactionContextInterface, batchID string) (*ProductBatch, error) {
	productBatchBytes, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return nil, fmt.Errorf("failed to get the product batch %s: %v", batchID, err)
	}
	if productBatchBytes == nil {
		return nil, fmt.Errorf("product batch %s does not exist", batchID)
	}

	var productBatch ProductBatch
	err = json.Unmarshal(productBatchBytes, &productBatch)
	if err != nil {
		return nil, err
	}

	return &productBatch, nil
}

// SaveBatchUpdate saves a product to the world state
func SaveBatchUpdate(ctx utils.RoleBasedTransactionContextInterface, productBatch *ProductBatch) error {
	productBatchID := productBatch.ID
	productBatchBytes, _ := json.Marshal(productBatch)

	err := ctx.GetStub().PutState(productBatchID, []byte(productBatchBytes))

	if err != nil {
		return fmt.Errorf("failed to update product %s: %v", productBatchID, err)
	}

	return nil
}

// UpdateCurrentLocation updates a product batch's location using id as key
func (s *ProductBatchContract) UpdateCurrentLocation(ctx utils.RoleBasedTransactionContextInterface, batchID string, newLocation string) error {
	role := ctx.GetRole()
	if role != "Manufacturer" && role != "Distributor" {
		return fmt.Errorf("cannot update current location of batch id %s as manufacturer or distributor privilege needed", batchID)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	//  Return without any errors if there is no change in location
	if productBatch.LocationEntryInfo.CurrentLocation == newLocation {
		return nil
	}

	productBatch.LocationEntryInfo = LocationEntryInfo{newLocation, productBatch.LocationEntryInfo.Destination, getCurrentTime(ctx)}

	productBatch.Status, err = updateStatus(ctx, batchID, newLocation)
	if err != nil {
		return fmt.Errorf("cannot update delivery status for product batch id %s: %v", batchID, err)
	}

	return SaveBatchUpdate(ctx, productBatch)
}

// UpdateDestination updates a product batch's destination using id as key
func (s *ProductBatchContract) UpdateDestination(ctx utils.RoleBasedTransactionContextInterface, batchID string, newDestination string) error {
	role := ctx.GetRole()
	if role != "Manufacturer" && role != "Distributor" {
		return fmt.Errorf("cannot update destination of batch id %s as manufacturer or distributor privilege needed", batchID)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	//  Return without any errors if there is no change in location
	if productBatch.Status == "Arrived" || productBatch.LocationEntryInfo.Destination == newDestination {
		return nil
	}

	productBatch.LocationEntryInfo = LocationEntryInfo{productBatch.LocationEntryInfo.CurrentLocation, newDestination, getCurrentTime(ctx)}

	return SaveBatchUpdate(ctx, productBatch)
}

// UpdateDistributorID updates a product batch's distributor id
func (s *ProductBatchContract) AddProductsToBatch(ctx utils.RoleBasedTransactionContextInterface, batchID string, productID string, quantity int) error {
	role := ctx.GetRole()
	if role != "Manufacturer" {
		return fmt.Errorf("cannot add products to batch id %s as manufacturer privilege needed", batchID)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	products := productBatch.Products
	productBytes, err := ctx.GetStub().GetState(productID)
	if err != nil {
		return errors.New("unable to interact with the world state")
	} else if productBytes == nil {
		return fmt.Errorf("cannot create a new product batch in the world state as the product of id %s not exist", productID)
	}

	// Check if the new product already exists in the batch
	for _, batchProduct := range products {
		if batchProduct.ID == productID {
			return fmt.Errorf("cannot add new product id %s to batch id %s as product already exists in the batch", batchProduct.ID, batchID)
		}
	}

	var loadedProduct product.Product
	var newQuantity int
	err = json.Unmarshal(productBytes, &loadedProduct)
	if err != nil {
		return err
	} else if !loadedProduct.Available {
		return fmt.Errorf("cannot add product id %s to batch id %s as the product is not available to be sold", productID, batchID)
	}

	if quantity > loadedProduct.Quantity {
		return fmt.Errorf("cannot create a batch id %s related to this product id %s as maximum allowed quantity exceeded", batchID, productID)
	} else {
		newQuantity = loadedProduct.Quantity - quantity
		loadedProduct.Quantity = quantity
	}

	products = append(products, loadedProduct)
	productBatch.Products = products

	// Update new quantity to product
	loadedProduct.Quantity = newQuantity
	err = product.SaveUpdate(ctx, &loadedProduct)
	if err != nil {
		return err
	}

	return SaveBatchUpdate(ctx, productBatch)
}

// UpdateDistributorID updates a product batch's distributor id
func (s *ProductBatchContract) UpdateDistributorID(ctx utils.RoleBasedTransactionContextInterface, batchID string, newDistributorID string) error {
	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	role := ctx.GetRole()
	if role != "Manufacturer" && role != "Distributor" {
		return fmt.Errorf("cannot update distributor id %s of batch id %s as manufacturer or distributor privilege needed", productBatch.DistributorID, batchID)
	}

	// If there is no change, just return without any errors
	if productBatch.DistributorID == newDistributorID {
		return nil
	}

	productBatch.DistributorID = newDistributorID

	return SaveBatchUpdate(ctx, productBatch)
}

func (s *ProductBatchContract) SendBatchToDistributor(ctx utils.RoleBasedTransactionContextInterface, batchID string) error {
	// Check role of client
	role := ctx.GetRole()
	if role != "Manufacturer" {
		return fmt.Errorf("cannot create a new batch id %s with role %s as manufacturer privilege needed", batchID, role)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	// Check if all prequisites are met
	if productBatch.DistributorID == "" {
		return fmt.Errorf("cannot send batch id %s to distributor as distributor not exist", batchID)
	} else if productBatch.LocationEntryInfo.CurrentLocation == "" {
		return fmt.Errorf("cannot send batch id %s to distributor as current location has not been updated", batchID)
	} else if productBatch.LocationEntryInfo.Destination == "" {
		return fmt.Errorf("cannot send batch id %s to distributor as destination has not been updated", batchID)
	}

	currentLocation := productBatch.LocationEntryInfo.CurrentLocation
	destination := productBatch.LocationEntryInfo.Destination
	productBatch.LocationEntryInfo = LocationEntryInfo{currentLocation, destination, getCurrentTime(ctx)}

	productBatch.Status, err = updateStatus(ctx, batchID, currentLocation)
	if err != nil {
		return err
	}

	return SaveBatchUpdate(ctx, productBatch)
}

// UpdateRetailerID updates a product batch's retailer id
func (s *ProductBatchContract) UpdateRetailerID(ctx utils.RoleBasedTransactionContextInterface, batchID string, newRetailerID string) error {
	// Check role of client
	role := ctx.GetRole()
	if role != "Manufacturer" && role != "Distributor" {
		return fmt.Errorf("cannot create a new batch id %s with role %s as manufacturer or distributor privilege needed", batchID, role)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	// If there is no change, just return without any errors
	if productBatch.RetailerID == newRetailerID {
		return nil
	}

	productBatch.RetailerID = newRetailerID

	return SaveBatchUpdate(ctx, productBatch)
}

func (s *ProductBatchContract) SendBatchToRetailer(ctx utils.RoleBasedTransactionContextInterface, batchID string) error {
	// Check role of client
	role := ctx.GetRole()
	if role != "Manufacturer" {
		return fmt.Errorf("cannot create a new batch id %s with role %s as manufacturer privilege needed", batchID, role)
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	// Check if retailer exists
	if productBatch.RetailerID == "" {
		return fmt.Errorf("cannot send batch id %s to retailer as retailer not exist", batchID)
	} else if productBatch.DistributorID == "" {
		return fmt.Errorf("cannot send batch id %s to retailer as distributor not exist", batchID)
	}

	currentLocation := productBatch.LocationEntryInfo.CurrentLocation
	destination := productBatch.LocationEntryInfo.Destination
	productBatch.LocationEntryInfo = LocationEntryInfo{currentLocation, destination, getCurrentTime(ctx)}

	productBatch.Status, err = updateStatus(ctx, batchID, currentLocation)
	if err != nil {
		return err
	}

	return SaveBatchUpdate(ctx, productBatch)
}

func (s *ProductBatchContract) MarkBatchAsDelivered(ctx utils.RoleBasedTransactionContextInterface, batchID string) error { 
	// Check role of client
	role := ctx.GetRole()
	if role != "Distributor" {
		return fmt.Errorf("only distributors should be able to deliver product batches")
	}

	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	// Check if retailer and distributor do actually exist
	if productBatch.RetailerID == "" {
		return fmt.Errorf("cannot mark product batch %s as delivered since retailer not exist", batchID)
	} else if productBatch.DistributorID == "" {
		return fmt.Errorf("cannot mark product batch %s as delivered since distributor not exist", batchID)
	}

	// If after updating status, the batch is confirmed to be arrived, marked it as delivered
	if productBatch.Status == "Arrived" {
		productBatch.Status = "Delivered"
	}

	return SaveBatchUpdate(ctx, productBatch)
}

// DeleteProductBatch removes a product batch key-value pair from the ledger
func (s *ProductBatchContract) DeleteProductBatch(ctx utils.RoleBasedTransactionContextInterface, batchID string) error {
	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	err = ctx.GetStub().DelState(batchID)
	if err != nil {
		return err
	}

	statusBatchIndexKey, err := ctx.GetStub().CreateCompositeKey(index, []string{productBatch.Status, productBatch.ID})
	if err != nil {
		return err
	}

	// Delete index entry
	return ctx.GetStub().DelState(statusBatchIndexKey)
}

// SortBatchProducts sorts only products on a batch
func (s *ProductBatchContract) SortBatchProducts(ctx utils.RoleBasedTransactionContextInterface, batchID string) error {
	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	products := productBatch.Products
	var newProducts []product.Product
	var newProduct product.Product
	today, _ := ctx.GetStub().GetTxTimestamp()

	for _, product := range products {
		productBytes, err := ctx.GetStub().GetState(product.ID)
		if err != nil {
			return err
		}
		err = json.Unmarshal(productBytes, &newProduct)
		if err != nil {
			return err
		}
		if today.AsTime().Before(product.ExpirationDate) || today.AsTime().Equal(product.ExpirationDate) {
			newProducts = append(newProducts, newProduct)
		}
	}
	productBatch.Products = newProducts

	return SaveBatchUpdate(ctx, productBatch)
}

// RemoveBatchProduct remove a product on a batch
func (s *ProductBatchContract) RemoveBatchProduct(ctx utils.RoleBasedTransactionContextInterface, batchID string, productID string) error {
	productBatch, err := s.ReadProductBatch(ctx, batchID)
	if err != nil {
		return err
	}

	products := productBatch.Products
	var newProducts []product.Product
	var newProduct product.Product

	for _, product := range products {
		productBytes, err := ctx.GetStub().GetState(product.ID)
		if err != nil {
			return err
		}
		err = json.Unmarshal(productBytes, &newProduct)
		if err != nil {
			return err
		}
		if product.ID != productID {
			newProducts = append(newProducts, newProduct)
		}
	}
	productBatch.Products = newProducts

	return SaveBatchUpdate(ctx, productBatch)
}

// BatchExists returns true when product with given ID exists in the ledger.
func (s *ProductBatchContract) BatchExists(ctx utils.RoleBasedTransactionContextInterface, batchID string) (bool, error) {
	productBytes, err := ctx.GetStub().GetState(batchID)
	if err != nil {
		return false, fmt.Errorf("failed to read product batch with id %s from world state. %v", batchID, err)
	}

	return productBytes != nil, nil
}

// constructQueryResponseFromIterator constructs a slice of product batches from the resultsIterator
func constructQueryResponseFromIterator(resultsIterator shim.StateQueryIteratorInterface) ([]*ProductBatch, error) {
	var productBatches []*ProductBatch
	for resultsIterator.HasNext() {
		queryResult, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}
		var productBatch ProductBatch
		err = json.Unmarshal(queryResult.Value, &productBatch)
		if err != nil {
			return nil, err
		}
		productBatches = append(productBatches, &productBatch)
	}

	return productBatches, nil
}

// GetBatchesByRange gets a range query based on the start and end IDs provided
func (s *ProductBatchContract) GetBatchesByRange(ctx utils.RoleBasedTransactionContextInterface, startID string, endID string) ([]*ProductBatch, error) {
	resultsIterator, err := ctx.GetStub().GetStateByRange(startID, endID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// GetBatchesByStatus performs a range query based on the status provided.
func (s *ProductBatchContract) GetBatchesByStatus(ctx utils.RoleBasedTransactionContextInterface, status string) ([]*ProductBatch, error) {
	queryString := fmt.Sprintf(`{
									"selector":{
										"docType":"%s",
										"status":"%s"
									}, 
									"use_index":[
										"_design/indexProductBatchStatusDoc", 
										"indexProductBatchStatus"
									]
								}`,
		docType, status)
	return getQueryResultForQueryString(ctx, queryString)
}

// getQueryResultForQueryString executes the passed in query string.
// The result set is built and returned as a byte array containing the JSON results.
func getQueryResultForQueryString(ctx utils.RoleBasedTransactionContextInterface, queryString string) ([]*ProductBatch, error) {

	resultsIterator, err := ctx.GetStub().GetQueryResult(queryString)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	return constructQueryResponseFromIterator(resultsIterator)
}

// QueryAllBatches queries for all batches.
// Only available on state databases that support rich query (e.g. CouchDB)
func (s *ProductBatchContract) QueryAllBatches(ctx utils.RoleBasedTransactionContextInterface) ([]*ProductBatch, error) {
	queryString := fmt.Sprintf(`{
									"selector":{
										"docType":"%s"
									}, 
									"use_index":[
										"_design/indexProductBatchDoc", 
										"indexProductBatch"
									]
								}`,
		docType)
	return getQueryResultForQueryString(ctx, queryString)
}

// QueryBatchesByStatus is an alias of GetBatchesByStatus()
func (s *ProductBatchContract) QueryBatchesByStatus(ctx utils.RoleBasedTransactionContextInterface, status string) ([]*ProductBatch, error) {
	return s.GetBatchesByStatus(ctx, status)
}

// GetBatchHistory return the chain of locationEntryInfo update of a product batch since issuance
func (t *ProductBatchContract) GetBatchHistory(ctx utils.RoleBasedTransactionContextInterface, batchID string) ([]HistoryBatchQueryResult, error) {
	resultsIterator, err := ctx.GetStub().GetHistoryForKey(batchID)
	if err != nil {
		return nil, err
	}
	defer resultsIterator.Close()

	var records []HistoryBatchQueryResult
	for resultsIterator.HasNext() {
		response, err := resultsIterator.Next()
		if err != nil {
			return nil, err
		}

		var productBatch ProductBatch
		if len(response.Value) > 0 {
			err = json.Unmarshal(response.Value, &productBatch)
			if err != nil {
				return nil, err
			}
		} else {
			productBatch = ProductBatch{
				ID: batchID,
			}
		}

		timestamp, err := response.Timestamp.AsTime(), response.Timestamp.CheckValid()
		if err != nil {
			return nil, err
		}

		record := HistoryBatchQueryResult{
			TxId:      response.TxId,
			Timestamp: timestamp,
			Record:    &productBatch,
			IsDelete:  response.IsDelete,
		}
		records = append(records, record)
	}

	return records, nil
}

// GetEvaluateTransactions returns functions of ProductBatchContract which are not tagged as submit
func (t *ProductBatchContract) GetEvaluateTransactions() []string {
	return []string{"ReadProductBatch", "GetBatchHistory",
		"GetBatchesByRange", "BatchExists", "GetBatchesByStatus", "QueryAllBatches"}
}
