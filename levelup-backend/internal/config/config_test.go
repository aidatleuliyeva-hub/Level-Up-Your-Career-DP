package config

import (
	"os"
	"testing"
)

func TestGetEnv_DefaultAndOverride(t *testing.T) {
	_ = os.Unsetenv("UNIT_TEST_KEY")
	if got := getEnv("UNIT_TEST_KEY", "default"); got != "default" {
		t.Fatalf("expected default, got %q", got)
	}

	_ = os.Setenv("UNIT_TEST_KEY", "value")
	defer os.Unsetenv("UNIT_TEST_KEY")

	if got := getEnv("UNIT_TEST_KEY", "default"); got != "value" {
		t.Fatalf("expected override, got %q", got)
	}
}

func TestGetEnvInt_DefaultInvalidAndOverride(t *testing.T) {
	_ = os.Unsetenv("UNIT_TEST_INT")
	if got := getEnvInt("UNIT_TEST_INT", 7); got != 7 {
		t.Fatalf("expected default 7, got %d", got)
	}

	_ = os.Setenv("UNIT_TEST_INT", "not-a-number")
	if got := getEnvInt("UNIT_TEST_INT", 7); got != 7 {
		t.Fatalf("expected default 7 on invalid int, got %d", got)
	}

	_ = os.Setenv("UNIT_TEST_INT", "42")
	defer os.Unsetenv("UNIT_TEST_INT")

	if got := getEnvInt("UNIT_TEST_INT", 7); got != 42 {
		t.Fatalf("expected 42, got %d", got)
	}
}

func TestLoad_UsesDefaultsAndEnv(t *testing.T) {
	// Ensure clean env for a few keys we assert on
	_ = os.Unsetenv("PORT")
	_ = os.Unsetenv("REDIS_ADDR")
	_ = os.Unsetenv("REDIS_DB")

	cfg := Load()
	if cfg.AppPort == "" {
		t.Fatalf("expected AppPort to be set")
	}
	if cfg.AppPort != "8080" {
		t.Fatalf("expected default port 8080, got %q", cfg.AppPort)
	}
	if cfg.Redis.Addr != "localhost:6379" {
		t.Fatalf("expected default redis addr, got %q", cfg.Redis.Addr)
	}
	if cfg.Redis.DB != 0 {
		t.Fatalf("expected default redis db 0, got %d", cfg.Redis.DB)
	}

	_ = os.Setenv("PORT", "9999")
	_ = os.Setenv("REDIS_ADDR", "127.0.0.1:6380")
	_ = os.Setenv("REDIS_DB", "2")
	defer func() {
		_ = os.Unsetenv("PORT")
		_ = os.Unsetenv("REDIS_ADDR")
		_ = os.Unsetenv("REDIS_DB")
	}()

	cfg2 := Load()
	if cfg2.AppPort != "9999" {
		t.Fatalf("expected overridden port 9999, got %q", cfg2.AppPort)
	}
	if cfg2.Redis.Addr != "127.0.0.1:6380" {
		t.Fatalf("expected overridden redis addr, got %q", cfg2.Redis.Addr)
	}
	if cfg2.Redis.DB != 2 {
		t.Fatalf("expected overridden redis db 2, got %d", cfg2.Redis.DB)
	}
}
