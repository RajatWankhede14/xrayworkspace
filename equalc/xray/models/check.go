package models

import (
	"github.com/google/uuid"
)

type Check struct {
	BaseModel
	EvaluationID uuid.UUID
	Key          string
	Passed       bool
	Reasoning    string
}
