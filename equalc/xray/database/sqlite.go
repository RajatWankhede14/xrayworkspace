package database

import (
	"github.com/RajatWankhede14/xray/models"
	"gorm.io/gorm"
)

type Sqllite struct {
	mustEmbedDatabase
	DB *gorm.DB
}

func NewSqlite(db *gorm.DB) *Sqllite {
	return &Sqllite{DB: db}
}

func (s *Sqllite) SaveTrace(trace *models.Trace) error {
	return s.DB.Save(trace).Error
}

func (s *Sqllite) SaveEvaluation(evaluation *models.Evaluation) error {
	return s.DB.Save(evaluation).Error
}

func (s *Sqllite) SaveStep(step *models.Step) error {
	return s.DB.Save(step).Error
}

func (s *Sqllite) SaveCheck(check *models.Check) error {
	return s.DB.Save(check).Error
}

func (s *Sqllite) NoOp() error {
	return nil
}
