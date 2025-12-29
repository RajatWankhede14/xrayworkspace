package xray

import (
	"github.com/RajatWankhede14/xray/models"
	"github.com/google/uuid"
)

type Step struct {
	Data  *models.Step
	Trace *Trace
}

func (s *Step) RecordInput(input map[string]interface{}) {
	s.Data.Inputs = input
}

func (s *Step) RecordOutput(output map[string]interface{}) {
	s.Data.Outputs = output
}

func (s *Step) RecordReasoning(reasoning string) {
	s.Data.Reasoning = reasoning
}

func (s *Step) RecordMetadata(metadata map[string]interface{}) {
	s.Data.Metadata = metadata
}

func (s *Step) NewEvaluation(refID, refName string) *Evaluation {
	evalData := &models.Evaluation{
		BaseModel:     models.BaseModel{ID: uuid.New()},
		TraceID:       s.Data.TraceID,
		StepID:        s.Data.ID,
		ReferenceID:   refID,
		ReferenceName: refName,
		Checks:        []*models.Check{},
	}

	s.Data.Evaluations = append(s.Data.Evaluations, evalData)
	return &Evaluation{
		Data:  evalData,
		Trace: s.Trace,
	}
}

func (s *Step) End() {
	// Logic to mark step as complete
}
