type CsvRow = Record<string, string | number | boolean | null | undefined>;

export function exportToCsv(
  filename: string,
  rows: CsvRow[],
  columns?: { key: string; label: string }[]
) {
  if (!rows.length) return;

  const cols =
    columns ??
    Object.keys(rows[0]).map((key) => ({ key, label: key }));

  const header = cols.map((c) => c.label).join(",");
  const body = rows
    .map((row) =>
      cols
        .map((c) => {
          const val = row[c.key];
          const str = val == null ? "" : String(val);
          return str.includes(",") || str.includes('"')
            ? `"${str.replace(/"/g, '""')}"`
            : str;
        })
        .join(",")
    )
    .join("\n");

  const blob = new Blob([`${header}\n${body}`], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
