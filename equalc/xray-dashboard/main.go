package main

import (
	"flag"
	"fmt"
	"log"
	"os"

	"github.com/RajatWankhede14/xray-dashboard/backend"
)

func main() {
	if len(os.Args) < 2 {
		fmt.Println("Usage: xray-dashboard [command] [flags]")
		fmt.Println("Commands:")
		fmt.Println("  start    Start the dashboard server")
		os.Exit(1)
	}

	command := os.Args[1]
	switch command {
	case "start":
		startCmd := flag.NewFlagSet("start", flag.ExitOnError)
		dbPath := startCmd.String("db-path", "xray.db", "Path to the xray sqlite database")

		// Parse flags for the start command (arguments after the command)
		startCmd.Parse(os.Args[2:])

		log.Printf("Starting dashboard with DB at %s", *dbPath)
		backend.StartServer(*dbPath)
	default:
		fmt.Printf("Unknown command: %s\n", command)
		os.Exit(1)
	}
}
