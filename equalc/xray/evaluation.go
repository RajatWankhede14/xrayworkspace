package xray

import (
	"github.com/RajatWankhede14/xray/models"
	"github.com/google/uuid"
)

type Evaluation struct {
	Data  *models.Evaluation
	Trace *Trace
}

func (e *Evaluation) AddCheck(key string, passed bool, reasoning string) {
	checkData := &models.Check{
		BaseModel:    models.BaseModel{ID: uuid.New()},
		EvaluationID: e.Data.ID,
		Key:          key,
		Passed:       passed,
		Reasoning:    reasoning,
	}
	e.Data.Checks = append(e.Data.Checks, checkData)
}

func (e *Evaluation) SetQualified(qualified bool) {
	e.Data.Qualified = qualified
}
