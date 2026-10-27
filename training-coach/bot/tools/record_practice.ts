import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import {
  PRACTICE_LIMIT,
  parsePracticeLog,
  practiceKey,
  toJsonLog,
  type PracticeWriteResult,
} from "../lib/practice-log.js";

export default defineTool({
  description:
    "Save this session's practice result for one topic. Call this after the person answers a practice question, or when they ask you to record a result. Use outcome practiced when they have the idea. Use needs-review when they missed it. The same topic, outcome, and note do not add a second row.",
  inputSchema: z.object({
    topic: z.string().trim().min(1).max(120),
    outcome: z.enum(["practiced", "needs-review"]),
    note: z.string().trim().max(500),
  }),
  effect: "write",
  dryRunResult: ({ topic, outcome, note }): PracticeWriteResult => ({
    duplicate: false,
    entries: [
      {
        topic,
        outcome,
        note,
        recordedAt: "1970-01-01T00:00:00.000Z",
      },
    ],
  }),
  async execute({ topic, outcome, note }, ctx): Promise<PracticeWriteResult> {
    const key = practiceKey(ctx.session.id);
    const log = parsePracticeLog(await ctx.host.kv.get(key));
    const duplicate = log.entries.some(
      (entry) => entry.topic === topic && entry.outcome === outcome && entry.note === note,
    );

    if (!duplicate) {
      log.entries.push({
        topic,
        outcome,
        note,
        recordedAt: new Date().toISOString(),
      });
      if (log.entries.length > PRACTICE_LIMIT) {
        log.entries.splice(0, log.entries.length - PRACTICE_LIMIT);
      }
      await ctx.host.kv.put(key, toJsonLog(log));
    }

    return { duplicate, entries: log.entries };
  },
});
