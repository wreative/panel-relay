export function extract(
  text: string,
  regex: RegExp
): string {
  const match = text.match(regex);

  return match?.[1]?.trim() || "N/A";
}
