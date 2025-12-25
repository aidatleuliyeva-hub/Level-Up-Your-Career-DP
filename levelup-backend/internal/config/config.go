// F:\gopro\levelup-backend\internal\config\config.go
package config

import (
	"os"
	"strconv"
)

type DBConfig struct {
	Host     string
	Port     string
	User     string
	Password string
	Name     string
	SSLMode  string
}

// 🔴 новый конфиг для Redis
type RedisConfig struct {
	Addr string
	DB   int
}

type Config struct {
	AppPort   string
	DB        DBConfig
	Redis     RedisConfig // 🔴 добавлено
	JWTSecret string
}

// getEnv возвращает переменную окружения или дефолт
func getEnv(key, def string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return def
}

// 🔴 helper для int
func getEnvInt(key string, def int) int {
	if val, ok := os.LookupEnv(key); ok {
		if n, err := strconv.Atoi(val); err == nil {
			return n
		}
	}
	return def
}

func Load() Config {
	return Config{
		AppPort: getEnv("PORT", "8080"),
		DB: DBConfig{
			Host:     getEnv("DB_HOST", "localhost"),
			Port:     getEnv("DB_PORT", "5432"),
			User:     getEnv("DB_USER", "postgres"),
			Password: getEnv("DB_PASSWORD", "QazBEe8M721!"),
			Name:     getEnv("DB_NAME", "levelup"),
			SSLMode:  getEnv("DB_SSLMODE", "disable"),
		},
		Redis: RedisConfig{ // 🔴 новый блок
			Addr: getEnv("REDIS_ADDR", "localhost:6379"),
			DB:   getEnvInt("REDIS_DB", 0),
		},
		JWTSecret: getEnv("JWT_SECRET", "aida4inaspectralprojectlevelup"),
	}
}
