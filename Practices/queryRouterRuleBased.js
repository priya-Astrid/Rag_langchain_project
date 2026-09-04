// Rule Based router

const router = (question) => {
  // simple process to find route
  //   const word = question.trim().split(/\s+/);
  //   if (word.length !== 6) {
  //     return "simple";
  //   }
  //   return "complex";
  // useful for production
  const normalizedQuestion = question.trim().split(/\s+/);
  const complexKeyword = [
    "advantage",
    "disadvantage",
    "why",
    "how",
    "proc",
    "cons",
    "vs",
    "explain",
    "different",
    "compare",
    "versus",
  ];
  const isComplex = complexKeyword.some((Keyword) =>
    normalizedQuestion.includes(Keyword),
  );

  return isComplex ? "complex" : "simple";
};

export const RuleBasedRouterApproach = async () => {
  const question = "disadvantage of  Node and  mongodb";

  const result = router(question);
  const route = result.trim().toLowerCase();

  console.log("response router: ", route);

  return route;
};

RuleBasedRouterApproach();
/**
 * 
 *  [
      "system",
      `
You are a query router for a RAG system.

Classify the user's question into exactly one category.

SIMPLE:
The question can usually be answered using
one direct search query.

COMPLEX:
The question requires multiple search perspectives,
comparison, deeper reasoning, or broader retrieval.

Return ONLY one word:

simple

or

complex
        `,
    ],
 */
