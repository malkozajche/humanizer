import type { JsonObject, JsonValue } from "@grok/agent-sdk";

export const PRACTICE_LIMIT = 30;

export type PracticeOutcome = "practiced" | "needs-review";

export type PracticeEntry = {
  topic: string;
  outcome: PracticeOutcome;
  note: string;
  recordedAt: string;
};

export type PracticeLog = {
  entries: PracticeEntry[];
};

export type PracticeWriteResult = {
  duplicate: boolean;
  entries: PracticeEntry[];
};

export function practiceKey(sessionId: string): string {
  return `practice:${sessionId}`;
}

function isOutcome(value: JsonValue | undefined): value is PracticeOutcome {
  return value === "practiced" || value === "needs-review";
}

function isRecord(value: JsonValue | undefined): value is JsonObject {
  return value !== undefined && value !== null && typeof value === "object" && !Array.isArray(value);
}

export function parsePracticeLog(value: JsonValue | undefined): PracticeLog {
  if (!isRecord(value) || !Array.isArray(value.entries)) {
    return { entries: [] };
  }

  const entries: PracticeEntry[] = [];
  for (const item of value.entries) {
    if (!isRecord(item)) continue;
    const { topic, outcome, note, recordedAt } = item;
    if (typeof topic !== "string" || !isOutcome(outcome) || typeof note !== "string" || typeof recordedAt !== "string") {
      continue;
    }
    entries.push({ topic, outcome, note, recordedAt });
  }
  return { entries };
}

export function toJsonLog(log: PracticeLog): JsonValue {
  return {
    entries: log.entries.map((entry) => ({
      topic: entry.topic,
      outcome: entry.outcome,
      note: entry.note,
      recordedAt: entry.recordedAt,
    })),
  };
}
