package models

type Trace struct {
	BaseModel
	Name  string
	Steps []*Step `gorm:"foreignKey:TraceID"`
}
