export default {
  meta: {
    type: "suggestion",
    docs: { description: "Require language specification in fenced code blocks" },
    messages: {
      missingLanguage: "Code block must specify a language. Use 'text' or 'bash' if unknown.",
    },
  },

  // noinspection JSUnusedGlobalSymbols
  create(context) {
    const sourceCode = context.sourceCode || context.getSourceCode();
    const lines = sourceCode.getText().split("\n");
    // Both CommonMark fence styles: ``` and ~~~
    const fenceRegex = /^(`{3,}|~{3,})(.*)$/;

    return {
      Program() {
        let openFence = null;
        lines.forEach((line, index) => {
          const match = fenceRegex.exec(line.trimStart());
          if (!match) return;

          const fenceChar = match[1][0];
          const fenceLength = match[1].length;
          const afterFence = match[2] || "";

          if (openFence === null) {
            if (afterFence.trim() === "") {
              context.report({
                loc: { line: index + 1, column: 0 },
                messageId: "missingLanguage",
              });
            }
            openFence = { char: fenceChar, length: fenceLength };
          } else if (
            fenceChar === openFence.char &&
            fenceLength >= openFence.length &&
            afterFence.trim() === ""
          ) {
            openFence = null;
          }
        });
      },
    };
  },
};
