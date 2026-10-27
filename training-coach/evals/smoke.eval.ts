import { defineEval } from "@grok/agent-sdk/evals";

export default defineEval({
  tags: ["smoke"],
  description: "Recording a practice result calls record_practice and does not list history.",
  async test(t) {
    await t.send(
      "Record that I practiced spotting phishing emails and still need review. Note: I missed a lookalike domain.",
    );
    t.succeeded();
    t.calledTool("record_practice", {
      input: {
        outcome: "needs-review",
        topic: /phishing/i,
        note: /lookalike/i,
      },
    });
    t.notCalledTool("list_practice");
  },
});
