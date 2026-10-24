function tursoUrl() {
  const url = String(process.env.TURSO_DATABASE_URL || "").trim();
  const authToken = String(process.env.TURSO_AUTH_TOKEN || "").trim();
  if (!url || !authToken) {
    throw new Error("NO_TURSO");
  }
  return {
    endpoint: `${url.replace(/^libsql:\/\//, "https://")}/v2/pipeline`,
    authToken,
  };
}

function toArg(value) {
  if (value === null || value === undefined) {
    return { type: "null" };
  }
  return { type: "text", value: String(value) };
}

function cellValue(cell) {
  if (cell == null) return null;
  if (typeof cell !== "object") return cell;
  if (cell.type === "null") return null;
  if ("value" in cell) return cell.value;
  return cell;
}

export function getDb() {
  return {
    async execute(query) {
      const { endpoint, authToken } = tursoUrl();
      const sql = typeof query === "string" ? query : query.sql;
      const args = typeof query === "string" ? [] : query.args || [];

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          requests: [
            {
              type: "execute",
              stmt: { sql, args: args.map(toArg) },
            },
            { type: "close" },
          ],
        }),
      });

      const data = await response.json().catch(() => ({}));
      const first = data.results?.[0];
      if (!response.ok || first?.type === "error") {
        const message =
          first?.error?.message || data.error || `Turso HTTP ${response.status}`;
        throw new Error(message);
      }

      const result = first?.response?.result || {};
      const cols = (result.cols || []).map((col) => col.name || col);
      const rows = (result.rows || []).map((row) => {
        const object = {};
        cols.forEach((name, index) => {
          object[name] = cellValue(row[index]);
        });
        return object;
      });

      return {
        rows,
        rowsAffected: Number(result.affected_row_count || 0),
      };
    },
  };
}
