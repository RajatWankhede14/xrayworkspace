package xray

import (
	"github.com/RajatWankhede14/xray/database"
	"github.com/RajatWankhede14/xray/models"
	"github.com/google/uuid"
)

type Trace struct {
	Data *models.Trace
	DB   database.IDatabase
}

func (x *Xray) StartTrace(name string) *Trace {
	data := &models.Trace{
		BaseModel: models.BaseModel{ID: uuid.New()},
		Name:      name,
		Steps:     []*models.Step{},
	}
	return &Trace{
		Data: data,
		DB:   x.DB,
	}
}

func (t *Trace) StartStep(name string) *Step {
	stepData := &models.Step{
		BaseModel: models.BaseModel{ID: uuid.New()},
		TraceID:   t.Data.ID,
		Name:      name,
	}
	t.Data.Steps = append(t.Data.Steps, stepData)
	return &Step{
		Data:  stepData,
		Trace: t,
	}
}

func (t *Trace) End() {
	// Logic to mark trace as complete if needed, currently just placeholder
}

func (t *Trace) SaveTrace() error {
	return t.DB.SaveTrace(t.Data)
}
