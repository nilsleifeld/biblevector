package env

import (
	"bufio"
	"log/slog"
	"os"
	"strings"
)

func Load() {
	if _, err := os.Stat(".env"); os.IsNotExist(err) {
		slog.Info("No .env file found, skipping loading environment variables.")
		return
	}
	file, err := os.Open(".env")
	if err != nil {
		slog.Error("Error opening .env file:", "error", err)
		return
	}
	defer file.Close()

	scanner := bufio.NewScanner(file)

	for scanner.Scan() {
		line := scanner.Text()

		if len(line) == 0 || line[0] == '#' {
			continue
		}

		parts := strings.SplitN(line, "=", 2)
		if len(parts) != 2 {
			slog.Warn("Invalid line in .env file", "line", line)
			continue
		}

		key := strings.TrimSpace(parts[0])
		value := strings.TrimSpace(parts[1])
		err := os.Setenv(key, value)
		if err != nil {
			slog.Error("Error setting environment variable", "key", key, "error", err)
		}
	}

	if err := scanner.Err(); err != nil {
		slog.Error("Error reading .env file", "error", err)
	}
}
