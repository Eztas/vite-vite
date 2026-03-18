import type { ColorName } from '../consts';
import { COLOR_PALETTE, CODE_LENGTH } from '../consts';

// ヒット＆ブローの判定ロジック（重複対応版）
export function judge(secret: ColorName[], guess: ColorName[]) {
  let eat = 0;
  let bite = 0;

  const secretCopy: (ColorName | null)[] = [...secret];
  const guessCopy: (ColorName | null)[] = [...guess];

  // 1. ヒットの判定（位置も色も合っている）
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] === secretCopy[i]) {
      eat++;
      secretCopy[i] = null; // 使用済みマーク
      guessCopy[i] = null;
    }
  }

  // 2. ブローの判定（色は合っているが位置が違う、重複を考慮）
  for (let i = 0; i < CODE_LENGTH; i++) {
    if (guessCopy[i] !== null) {
      // ここを「secretCopy.indexOf」ではなく、
      // 元の「secret」全体に対して存在チェックをかける
      if (secret.includes(guessCopy[i]!)) {
        bite++;
      }
    }
  }

  return { eat, bite };
}

// 正解の作成（重複あり）
export function generateSecretCode(): ColorName[] {
  const code: ColorName[] = [];
  for (let i = 0; i < CODE_LENGTH; i++) {
    const randomColor = COLOR_PALETTE[Math.floor(Math.random() * COLOR_PALETTE.length)].name;
    code.push(randomColor);
  }
  return code;
}
