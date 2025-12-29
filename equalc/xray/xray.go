package xray

import (
	"fmt"

	"github.com/RajatWankhede14/xray/database"
	"gorm.io/gorm"
)

type Xray struct {
	DB database.IDatabase
}

func New(dbDriver string, db *gorm.DB) *Xray {
	var store database.IDatabase
	switch dbDriver {
	case "sqlite":
		store = database.NewSqlite(db)
	default:
		fmt.Printf("Warning: Unknown driver %s, defaulting to sqlite or handled error\n", dbDriver)
		store = database.NewSqlite(db)
	}

	return &Xray{
		DB: store,
	}
}
