package models

import (
	"github.com/google/uuid"
)

type Evaluation struct {
	BaseModel
	TraceID       uuid.UUID
	StepID        uuid.UUID
	ReferenceID   string
	ReferenceName string
	Qualified     bool
	Checks        []*Check `gorm:"foreignKey:EvaluationID"`
}
