package utils

import (
	"fmt"
)

func GetClientRoleAndRefuseDistributor(ctx RoleBasedTransactionContextInterface) error {
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("Role")

	if err != nil {
		return fmt.Errorf("error trying to get client's 'Role' attribute")
	} else if !found {
		return fmt.Errorf("cannot assert client's role; attribute 'Role' not found")
	} else if role == "Distributor" {
		return fmt.Errorf("distributors are not allowed to invoke this contract's functions")
	} else {
		ctx.SetRole(role)
		return nil
	}
}
