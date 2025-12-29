package models

import (
	"github.com/google/uuid"
)

type Step struct {
	BaseModel
	TraceID     uuid.UUID
	Name        string
	Inputs      map[string]interface{} `gorm:"serializer:json"`
	Outputs     map[string]interface{} `gorm:"serializer:json"`
	Reasoning   string
	Evaluations []*Evaluation `gorm:"foreignKey:StepID"`
}
