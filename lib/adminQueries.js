import { knownDemoTitles } from "./publicContent";

// Explicit acceptance labels from the authorized audit, not an age-based heuristic.
export const testContentQuery = {
  $or: [
    { name: /^(?:ACCEPTANCE TEST|ADMIN TEST)(?:\s|$)/i },
    { titleEn: /^(?:ACCEPTANCE TEST|ADMIN TEST)(?:\s|$)/i },
    { titleEn: { $in: knownDemoTitles } },
  ],
};
export const realContentQuery = { $nor: testContentQuery.$or };
export const complaintStatuses = [
  "Under Review",
  "In Progress",
  "Resolved",
  "Rejected",
];
export function isTestContent(item) {
  return (
    /^(?:ACCEPTANCE TEST|ADMIN TEST)(?:\s|$)/i.test(
      item.name || item.titleEn || "",
    ) || knownDemoTitles.includes(item.titleEn)
  );
}
export function listQuery(params, view) {
  const and = [
    params.get("records") === "tests"
      ? testContentQuery
      : params.get("records") === "all"
        ? {}
        : realContentQuery,
  ];
  const q = String(params.get("q") || "")
    .trim()
    .slice(0, 120);
  if (q) {
    const literal = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const fields =
      view === "contacts"
        ? ["name", "phone", "email", "message"]
        : ["complaintId", "name", "phone", "complaintType", "location"];
    and.push({
      $or: fields.map((field) => ({
        [field]: { $regex: literal, $options: "i" },
      })),
    });
  }
  if (view === "complaints") {
    const status = params.get("status");
    if (status && !complaintStatuses.includes(status))
      throw new Error("Invalid status filter.");
    if (status) and.push({ status });
    if (params.get("category"))
      and.push({ complaintType: String(params.get("category")).slice(0, 80) });
    const date = params.get("date");
    if (date) {
      if (
        !/^\d{4}-\d{2}-\d{2}$/.test(date) ||
        Number.isNaN(Date.parse(date)) ||
        new Date(date).toISOString().slice(0, 10) !== date
      )
        throw new Error("Invalid date filter.");
      const start = new Date(date + "T00:00:00+05:30");
      and.push({
        createdAt: { $gte: start, $lt: new Date(start.getTime() + 86400000) },
      });
    }
  }
  return { $and: and };
}
