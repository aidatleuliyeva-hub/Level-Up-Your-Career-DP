// F:\gopro\levelup-backend\internal\tasks\jobs.go
package tasks

type JobType string

const (
	JobTypeNotifyStudent JobType = "notify_student"
	JobTypeNotifyTeacher JobType = "notify_teacher"
	// потом добавишь ещё типы: начисление денег, аналитика и т.д.
)
