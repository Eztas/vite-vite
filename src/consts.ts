export const COLOR_PALETTE = [
  { name: "red", bg: "bg-red-500", border: "border-red-700" },
  { name: "blue", bg: "bg-blue-500", border: "border-blue-700" },
  { name: "green", bg: "bg-green-500", border: "border-green-700" },
  { name: "yellow", bg: "bg-yellow-400", border: "border-yellow-600" },
  { name: "purple", bg: "bg-purple-500", border: "border-purple-700" },
  { name: "white", bg: "bg-white", border: "border-gray-300" },
] as const;

export type ColorName = (typeof COLOR_PALETTE)[number]["name"];

export const CODE_LENGTH = 4; // 4桁
export const MAX_ATTEMPTS = 10; // 10回まで
