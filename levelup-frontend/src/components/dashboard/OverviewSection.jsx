// F:\gopro\levelup-frontend\src\components\dashboard\OverviewSection.jsx
import React, { useMemo, useState } from "react";

export default function OverviewSection({
  challengesForOverview,
  chLoading,
  chError,
  openChallengeDetails,
}) {
  const [search, setSearch] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const filteredChallenges = useMemo(() => {
    let list = [...challengesForOverview];

    // поиск по заголовку и описанию
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((ch) => {
        const title = (ch.title || "").toLowerCase();
        const desc = (ch.description || "").toLowerCase();
        return title.includes(q) || desc.includes(q);
      });
    }

    // фильтр по типу
    if (typeFilter !== "all") {
      list = list.filter((ch) => ch.challenge_type === typeFilter);
    }

    // фильтр по сложности
    if (difficultyFilter !== "all") {
      list = list.filter((ch) => {
        const d = (ch.difficulty || "").toLowerCase();
        return d === difficultyFilter;
      });
    }

    // сортировка
    if (sortBy === "reward") {
      list.sort((a, b) => {
        const av = a.reward_amount != null ? Number(a.reward_amount) : 0;
        const bv = b.reward_amount != null ? Number(b.reward_amount) : 0;
        return bv - av;
      });
    } else if (sortBy === "credits") {
      list.sort((a, b) => {
        const av = a.reward_credits != null ? Number(a.reward_credits) : 0;
        const bv = b.reward_credits != null ? Number(b.reward_credits) : 0;
        return bv - av;
      });
    }
    // sortBy === "newest" — оставляем порядок как пришёл с сервера (у тебя уже ORDER BY created_at DESC)

    return list;
  }, [challengesForOverview, search, difficultyFilter, typeFilter, sortBy]);

  return (
    <section className="content-section">
      <div className="content-header">
        <div>
          <h1>Опубликованные челленджи</h1>
          <p>
            Задания от университетов и компаний, доступные для выполнения
            сейчас. Выберите челлендж, чтобы начать участие.
          </p>
        </div>
        <div className="content-header-meta">
          {chLoading && <span className="ch-badge">Загружаем...</span>}
          {!chLoading && filteredChallenges.length > 0 && (
            <span className="ch-badge">
              {filteredChallenges.length} челлендж(ей)
            </span>
          )}
        </div>
      </div>

      {/* Панель фильтров / поиска / сортировки */}
      <div className="content-filters">
        <div className="content-filters-row">
          <div className="filter-group">
            <label className="filter-label">Поиск</label>
            <input
              type="text"
              className="filter-input"
              placeholder="Найти по названию или описанию…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="filter-label">Тип</label>
            <select
              className="filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">Все</option>
              <option value="academic">Только academic</option>
              <option value="company">Только company</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Сложность</label>
            <select
              className="filter-select"
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
            >
              <option value="all">Любая</option>
              <option value="easy">easy</option>
              <option value="medium">medium</option>
              <option value="hard">hard</option>
            </select>
          </div>

          <div className="filter-group">
            <label className="filter-label">Сортировать</label>
            <select
              className="filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="newest">По новизне</option>
              <option value="reward">По вознаграждению (€)</option>
              <option value="credits">По кредитам</option>
            </select>
          </div>
        </div>
      </div>

      {chError && (
        <div className="alert alert-error" style={{ marginTop: 8 }}>
          Ошибка: {chError}
        </div>
      )}

      {!chLoading &&
        filteredChallenges.length === 0 &&
        !chError &&
        !search &&
        difficultyFilter === "all" &&
        typeFilter === "all" && (
          <div className="ch-empty">
            Пока нет опубликованных челленджей.
            <br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>
              Если вы преподаватель или представитель компании — перейдите в
              раздел <strong>«Создать челлендж»</strong> и добавьте первое
              задание.
            </span>
          </div>
        )}

      {!chLoading &&
        filteredChallenges.length === 0 &&
        !chError &&
        (search || difficultyFilter !== "all" || typeFilter !== "all") && (
          <div className="ch-empty">
            По выбранным фильтрам ничего не найдено.
            <br />
            <span style={{ fontSize: 11, opacity: 0.85 }}>
              Попробуйте убрать фильтры или изменить запрос.
            </span>
          </div>
        )}

      <div className="ch-list">
        {filteredChallenges.map((ch) => (
          <div key={ch.id} className="ch-card">
            <div className="ch-card-header">
              <div>
                <h3>{ch.title}</h3>
                <p className="ch-desc">{ch.description}</p>
              </div>
              <span className="ch-type">{ch.challenge_type}</span>
            </div>
            <div className="ch-meta">
              {ch.difficulty && (
                <span className="ch-pill">
                  Сложность: {ch.difficulty}
                </span>
              )}
              {ch.reward_credits != null && (
                <span className="ch-pill">
                  Кредиты: {ch.reward_credits}
                </span>
              )}
              {ch.reward_amount != null && (
                <span className="ch-pill">
                  Вознаграждение: {ch.reward_amount} €
                </span>
              )}
            </div>
            <div style={{ marginTop: 8 }}>
              <button
                className="btn btn-primary"
                onClick={() => openChallengeDetails(ch.id)}
              >
                Подробнее
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
