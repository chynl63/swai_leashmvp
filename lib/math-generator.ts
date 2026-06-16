/** 수학 문제 랜덤 생성 (spec §4.6) */

export type MathProblem = {
  question: string;
  answer: number;
};

function rnd(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 곱셈 위주의 암산하기 귀찮은 문제 생성.
 * (2~3자리 × 2자리, 가끔 큰 덧셈)
 */
export function generateProblem(): MathProblem {
  const kind = rnd(0, 4);
  if (kind <= 2) {
    // 곱셈
    const a = rnd(100, 499);
    const b = rnd(11, 49);
    return { question: `${a} × ${b}`, answer: a * b };
  }
  if (kind === 3) {
    // 큰 덧셈 3개
    const a = rnd(137, 899);
    const b = rnd(137, 899);
    const c = rnd(137, 899);
    return { question: `${a} + ${b} + ${c}`, answer: a + b + c };
  }
  // 뺄셈
  const a = rnd(500, 1999);
  const b = rnd(100, 499);
  return { question: `${a} − ${b}`, answer: a - b };
}

/** count개의 문제 묶음 생성 */
export function generateProblems(count: number): MathProblem[] {
  return Array.from({ length: count }, () => generateProblem());
}
