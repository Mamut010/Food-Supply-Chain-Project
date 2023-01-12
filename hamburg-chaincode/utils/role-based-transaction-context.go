package utils

import (
	"github.com/hyperledger/fabric-contract-api-go/contractapi"
)

// RoleBasedTransactionContext adds methods of storing and retrieving role for use with transaction hooks
type RoleBasedTransactionContext struct {
	contractapi.TransactionContext
	Role string
}

// RoleBasedTransactionContextInterface interface to define interaction with role based transaction context
type RoleBasedTransactionContextInterface interface {
	contractapi.TransactionContextInterface

	// GetRole return a string representing role
	GetRole() string

	// SetRole provide a value for role
	SetRole(string)
}

// GetRole return a string representing role
func (ctc *RoleBasedTransactionContext) GetRole() string {
	return ctc.Role
}

// SetRole provide a value for role
func (ctc *RoleBasedTransactionContext) SetRole(role string) {
	ctc.Role = role
}
