package backend

import (
	"fmt"
	"net/http"

	"github.com/RajatWankhede14/xray/models"
	"github.com/gin-gonic/gin"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func StartServer(dbPath string) {
	db, err := gorm.Open(sqlite.Open(dbPath), &gorm.Config{})
	if err != nil {
		panic(fmt.Sprintf("failed to connect database: %v", err))
	}

	// Automigrate for safety, though demo app should create it
	db.AutoMigrate(&models.Trace{}, &models.Step{}, &models.Evaluation{}, &models.Check{})

	r := gin.Default()

	// CORS compatibility for Next.js frontend
	r.Use(func(c *gin.Context) {
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	})

	api := r.Group("/api")
	{
		api.GET("/traces", func(c *gin.Context) {
			var traces []models.Trace
			// Preload steps and evaluations for summary
			if result := db.Preload("Steps.Evaluations.Checks").Preload("Steps").Find(&traces); result.Error != nil {
				c.JSON(http.StatusInternalServerError, gin.H{"error": result.Error.Error()})
				return
			}
			c.JSON(http.StatusOK, traces)
		})

		api.GET("/traces/:id", func(c *gin.Context) {
			id := c.Param("id")
			var trace models.Trace
			if result := db.Preload("Steps.Evaluations.Checks").Preload("Steps").First(&trace, "id = ?", id); result.Error != nil {
				c.JSON(http.StatusNotFound, gin.H{"error": "Trace not found"})
				return
			}
			c.JSON(http.StatusOK, trace)
		})
	}

	r.Run(":8080")
}
