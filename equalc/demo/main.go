package main

import (
	"fmt"
	"log"

	"github.com/RajatWankhede14/xray"
	"github.com/RajatWankhede14/xray/models"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

type Product struct {
	ASIN     string
	Title    string
	Category string
	Price    float64
	Rating   float64
	Reviews  int
}

func ifThenElse(cond bool, trueVal, falseVal string) string {
	if cond {
		return trueVal
	}
	return falseVal
}

func main() {
	// 1. Initialize DB
	db, err := gorm.Open(sqlite.Open("xray.db"), &gorm.Config{})
	if err != nil {
		log.Fatalf("failed to connect database: %v", err)
	}

	// 1.5 Migrate DB (Include Check model)
	db.AutoMigrate(&models.Trace{}, &models.Step{}, &models.Evaluation{}, &models.Check{})

	// 2. Initialize Xray
	x := xray.New("sqlite", db)

	// ============================================
	// STEP 1: Start recording this execution
	// ============================================
	trace := x.StartTrace("competitor_selection")

	referenceProduct := Product{
		Title:    "Premium Stainless Steel Water Bottle 32oz",
		Category: "Kitchen",
		Price:    25.0,
	}

	// ============================================
	// STEP 2: Generate keywords
	// ============================================
	step1 := trace.StartStep("keyword_generation")
	step1.RecordInput(map[string]interface{}{
		"product_title": referenceProduct.Title,
		"category":      referenceProduct.Category,
	})

	keywords := []string{"stainless steel", "32oz", "insulated water bottle"}

	step1.RecordOutput(map[string]interface{}{
		"keywords": keywords,
	})
	step1.RecordReasoning("Extracted key features: stainless steel, 32oz, insulated")
	step1.End()

	// ============================================
	// STEP 3: Search for products
	// ============================================
	step2 := trace.StartStep("candidate_search")
	step2.RecordInput(map[string]interface{}{
		"keywords": keywords,
		"limit":    50,
	})

	// Dummy candidates
	candidates := []Product{
		{ASIN: "B001", Title: "Bottle A", Price: 20.0, Rating: 4.5, Reviews: 150},
		{ASIN: "B002", Title: "Bottle B", Price: 60.0, Rating: 4.0, Reviews: 50},  // Expensive
		{ASIN: "B003", Title: "Bottle C", Price: 22.0, Rating: 3.5, Reviews: 200}, // Low rating
		{ASIN: "B004", Title: "Bottle D", Price: 25.0, Rating: 4.8, Reviews: 300}, // Perfect
	}

	step2.RecordOutput(map[string]interface{}{
		"total_results": len(candidates),
		"candidates":    candidates,
	})
	step2.RecordReasoning("Fetched top results by relevance")
	step2.End()

	// ============================================
	// STEP 4: Filter products
	// ============================================
	step3 := trace.StartStep("apply_filters")
	step3.RecordInput(map[string]interface{}{
		"candidates_count":  len(candidates),
		"reference_product": referenceProduct,
	})

	minPrice := referenceProduct.Price * 0.5
	maxPrice := referenceProduct.Price * 2.0
	minRating := 3.8
	minReviews := 100

	step3.RecordMetadata(map[string]interface{}{
		"filters_applied": map[string]interface{}{
			"price_range": map[string]float64{"min": minPrice, "max": maxPrice},
			"min_rating":  minRating,
			"min_reviews": minReviews,
		},
	})

	var qualified []Product
	for _, candidate := range candidates {
		evaluation := step3.NewEvaluation(candidate.ASIN, candidate.Title)

		passedPrice := candidate.Price >= minPrice && candidate.Price <= maxPrice
		evaluation.AddCheck("price_range", passedPrice,
			fmt.Sprintf("$%.2f is %s $%.2f-$%.2f",
				candidate.Price,
				ifThenElse(passedPrice, "within", "outside"),
				minPrice, maxPrice))

		passedRating := candidate.Rating >= minRating
		evaluation.AddCheck("min_rating", passedRating,
			fmt.Sprintf("%.1f %s %.1f threshold",
				candidate.Rating,
				ifThenElse(passedRating, ">=", "<"),
				minRating))

		passedReviews := candidate.Reviews >= minReviews
		evaluation.AddCheck("min_reviews", passedReviews,
			fmt.Sprintf("%d %s %d minimum",
				candidate.Reviews,
				ifThenElse(passedReviews, ">=", "<"),
				minReviews))

		isQualified := passedPrice && passedRating && passedReviews
		evaluation.SetQualified(isQualified)

		if isQualified {
			qualified = append(qualified, candidate)
		}
	}

	step3.RecordOutput(map[string]interface{}{
		"total_evaluated": len(candidates),
		"passed":          len(qualified),
		"failed":          len(candidates) - len(qualified),
	})
	step3.RecordReasoning(fmt.Sprintf("Applied 3 filters, %d passed, %d failed",
		len(qualified), len(candidates)-len(qualified)))
	step3.End()

	// ============================================
	// STEP 5: Rank and select
	// ============================================
	step4 := trace.StartStep("rank_and_select")
	step4.RecordInput(map[string]interface{}{
		"candidates_count": len(qualified),
	})

	// Simple ranking: pick last one for demo
	var bestProduct Product
	if len(qualified) > 0 {
		bestProduct = qualified[len(qualified)-1]
	}

	step4.RecordOutput(map[string]interface{}{
		"selected_competitor": bestProduct,
	})
	step4.RecordReasoning(fmt.Sprintf("Selected %s - highest review count",
		bestProduct.Title))
	step4.End()

	// ============================================
	// STEP 6: Must manually save trace
	// ============================================
	trace.End() // Placeholder
	if err := trace.SaveTrace(); err != nil {
		log.Fatalf("Failed to save trace: %v", err)
	}

	fmt.Printf("Trace %s saved successfully\n", trace.Data.ID)
}
