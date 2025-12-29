package database

import (
	"github.com/RajatWankhede14/xray/models"
	"gorm.io/gorm"
)

type Database struct {
	DB       *gorm.DB
	dbDriver string
}

type IDatabase interface {
	SaveTrace(trace *models.Trace) error
	SaveEvaluation(evaluation *models.Evaluation) error
	SaveStep(step *models.Step) error
	SaveCheck(check *models.Check) error
	NoOp() error
}

type mustEmbedDatabase struct {
}

func (m *mustEmbedDatabase) SaveTrace(trace *models.Trace) error {
	panic("not implemented")
}

func (m *mustEmbedDatabase) SaveEvaluation(evaluation *models.Evaluation) error {
	panic("not implemented")
}

func (m *mustEmbedDatabase) SaveStep(step *models.Step) error {
	panic("not implemented")
}

func (m *mustEmbedDatabase) NoOp() error {
	panic("not implemented")
}
