export type TestCase = {
    args: unknown[];
    expected: unknown;
};

export type Problem = {
    slug: string;
    title: string;
    description: string;
    functionName: string;
    starterCode: string;
    testCases: TestCase[];
};

export const problems: Problem[] = [
    {
        slug: "two-sum",
        title: "Two Sum",
        description:
            "Given an array of integers `nums` and an integer `target`, return the indices of the two numbers such that they add up to target. You may assume each input has exactly one solution, and you may not use the same element twice.",
        functionName: "two_sum",
        starterCode: `def two_sum(nums, target):
    # Your code here
    pass
`,
    testCases: [
      { args: [[2, 7, 11, 15], 9], expected: [0, 1] },
      { args: [[3, 2, 4], 6], expected: [1, 2] },
      { args: [[3, 3], 6], expected: [0, 1] },
    ],
  },
];
