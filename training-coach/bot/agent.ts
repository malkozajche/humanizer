import { defineAgent } from "@grok/agent-sdk";

export default defineAgent({
  description:
    "Practice coach. Studies a lesson with the person and saves practice notes for this session.",
  model: {
    id: "grok-4.7",
    params: [
      { id: "reasoning_effort", value: "high" },
      { id: "fast", value: "true" },
    ],
  },
  // Read the memory journal. No shell, browser, or file edits.
  tools: ["read", "grep", "glob", "ls"],
});
