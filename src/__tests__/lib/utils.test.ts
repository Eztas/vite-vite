import { describe, it, expect } from "vitest";
import { judge } from "../../lib/utils";
import type { ColorName } from "../../consts";

describe("色と位置に関する判定（重複あり）", () => {
  it("完全一致の場合", () => {
    const answer: ColorName[] = ["red", "blue", "green", "yellow"];
    const guess: ColorName[] = ["red", "blue", "green", "yellow"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 4, bite: 0 });
  });

  it("色だけ合っていて位置が違うの場合", () => {
    const answer: ColorName[] = ["red", "blue", "green", "yellow"];
    const guess: ColorName[] = ["blue", "red", "yellow", "green"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 0, bite: 4 });
  });

  it("重複がある場合の判定", () => {
    const answer: ColorName[] = ["red", "red", "blue", "blue"];
    const guess: ColorName[] = ["red", "green", "green", "red"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 1, bite: 1 });
  });

  it("答えにのみ重複がある場合の判定", () => {
    const answer: ColorName[] = ["white", "green", "yellow", "white"];
    const guess: ColorName[] = ["white", "green", "red", "blue"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 2, bite: 0 });
  });

  it("答えが全て同じ色の場合の判定", () => {
    const answer: ColorName[] = ["white", "white", "white", "white"];
    const guess: ColorName[] = ["white", "green", "red", "blue"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 1, bite: 0 });
  });

  it("回答にのみ重複がある場合の判定", () => {
    const answer: ColorName[] = ["white", "green", "yellow", "white"];
    const guess: ColorName[] = ["red", "green", "green", "blue"];

    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 1, bite: 1 });
  });

  it("回答が全て同じ色の場合の判定", () => {
    const answer: ColorName[] = ["white", "green", "red", "blue"];
    const guess: ColorName[] = ["white", "white", "white", "white"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 1, bite: 3 });
  });

  it("全く当たっていない場合", () => {
    const answer: ColorName[] = ["red", "red", "red", "red"];
    const guess: ColorName[] = ["blue", "blue", "blue", "blue"];
    const result = judge(answer, guess);

    expect(result).toEqual({ eat: 0, bite: 0 });
  });
});
