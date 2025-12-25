// F:\gopro\levelup-frontend\src\pages\AuthPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./AuthPage.css"; // 📌 новый отдельный стиль

export default function AuthPage() {
  const navigate = useNavigate();
  const { isAuthenticated, initializing, login, register } = useAuth();

  const [mode, setMode] = useState("login");

  // регистрация
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regFullName, setRegFullName] = useState("");
  const [regRole, setRegRole] = useState("student");
  const [regError, setRegError] = useState(null);

  // логин
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState(null);

  const [loading, setLoading] = useState(false);

  // уже залогинен → сразу на дашборд
  useEffect(() => {
    if (!initializing && isAuthenticated) {
      navigate("/dashboard", { replace: true });
    }
  }, [initializing, isAuthenticated, navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError(null);
    setLoading(true);
    try {
      await register({
        email: regEmail,
        password: regPassword,
        fullName: regFullName,
      });
      setLoginEmail(regEmail);
      setMode("login");
    } catch (err) {
      setRegError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError(null);
    setLoading(true);
    try {
      await login(loginEmail, loginPassword);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLoginError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (initializing) {
    return <div className="splash-screen">Загружаем...</div>;
  }

  return (
    <div className="auth-page">
      {/* мягкие подсветки на фоне */}
      <div className="auth-orbit auth-orbit-left" />
      <div className="auth-orbit auth-orbit-right" />

      <div className="auth-card">
        <div className="auth-card-header">
          <div className="auth-logo">
            <div className="logo-circle">LU</div>
            <div className="logo-text">
              <div className="logo-title">Level Up Your Career</div>
              <div className="logo-subtitle">
                Челленджи, реальные задачи и опыт — ещё во время учебы
              </div>
            </div>
          </div>

          <div className="auth-tagline">
            Платформа челленджей и микрозадач, которая помогает студентам
            собрать портфолио ещё во время университета.
          </div>
        </div>

        <div className="auth-card-body">
          <div className="auth-tabs">
            <button
              type="button"
              className={`auth-tab ${
                mode === "login" ? "auth-tab-active" : ""
              }`}
              onClick={() => setMode("login")}
            >
              Вход
            </button>
            <button
              type="button"
              className={`auth-tab ${
                mode === "register" ? "auth-tab-active" : ""
              }`}
              onClick={() => setMode("register")}
            >
              Регистрация
            </button>
          </div>

          {mode === "login" ? (
            <form className="auth-form" onSubmit={handleLogin}>
              <div className="auth-form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Пароль</label>
                  <input
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              {loginError && (
                <div className="alert alert-error">Ошибка: {loginError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Входим..." : "Войти"}
              </button>
            </form>
          ) : (
            <form className="auth-form" onSubmit={handleRegister}>
              <div className="auth-form-grid">
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Пароль</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Полное имя</label>
                  <input
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Роль</label>
                  <select
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value)}
                  >
                    <option value="student">student</option>
                    <option value="teacher">teacher</option>
                    <option value="company">company</option>
                    <option value="admin">admin</option>
                  </select>
                </div>
              </div>

              {regError && (
                <div className="alert alert-error">Ошибка: {regError}</div>
              )}

              <button
                type="submit"
                className="btn btn-primary auth-submit-btn"
                disabled={loading}
              >
                {loading ? "Создаём..." : "Создать аккаунт"}
              </button>
            </form>
          )}
        </div>

        <div className="auth-card-footer">
          <div className="auth-footer-note">
            Этот прототип подключен к Go + PostgreSQL API на{" "}
            <code>localhost:8080</code>
          </div>
          <div className="auth-footer-meta">
            <span>Студент · Преподаватель · Компания · Admin</span>
          </div>
        </div>
      </div>
    </div>
  );
}