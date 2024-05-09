// command-score.d.ts
declare module 'command-score' {
  /**
   * Calculates a fuzzy match score for a given string against an abbreviation.
   * The function considers character continuity, word jumps, case mismatches, and more
   * to compute a score that indicates the closeness of the match.
   *
   * @param string The full string to match against.
   * @param abbreviation The abbreviation or fragment to match within the string.
   * @returns A number representing the match score, where higher scores indicate better matches.
   */
  export default function commandScore(string: string, abbreviation: string): number;
}