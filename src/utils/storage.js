export function createJSONStore(key, defaultValue, { migrate } = {}) {
  const runMigrate = typeof migrate === "function" ? migrate : (x) => x;

  function load() {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) return defaultValue;
      const parsed = JSON.parse(raw);
      return runMigrate(parsed);
    } catch {
      return defaultValue;
    }
  }

  function save(value) {
    localStorage.setItem(key, JSON.stringify(value));
  }

  function reset() {
    localStorage.removeItem(key);
  }

  return { load, save, reset };
}
