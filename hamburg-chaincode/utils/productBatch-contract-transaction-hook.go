package utils

import (
	"fmt"
)

func GetClientRole(ctx RoleBasedTransactionContextInterface) error {
	role, found, err := ctx.GetClientIdentity().GetAttributeValue("Role")

	if err != nil {
		return fmt.Errorf("error trying to get client's 'Role' attribute")
	} else if !found {
		return fmt.Errorf("cannot assert client's role; attribute 'Role' not found")
	} else {
		ctx.SetRole(role)
		return nil
	}
}
