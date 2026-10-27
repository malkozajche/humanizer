import { defineTool } from "@grok/agent-sdk/tools";
import * as z from "zod/v4";
import { parsePracticeLog, practiceKey, type PracticeLog } from "../lib/practice-log.js";

export default defineTool({
  description:
    "Read practice results saved in this session. Call this when the person asks what they have practiced.",
  inputSchema: z.object({}),
  effect: "read",
  async execute(_input, ctx): Promise<PracticeLog> {
    const log = parsePracticeLog(await ctx.host.kv.get(practiceKey(ctx.session.id)));
    return { entries: log.entries };
  },
});
