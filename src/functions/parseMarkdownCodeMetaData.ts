import { randomBytes } from 'node:crypto';

// Delimiter for splitting arguments (splits by whitespace)
const ARGUMENT_DELIMITER = /\s+/;

// Pattern for valid keys (allows letters, numbers, and `$`, case insensitive)
const KEY_PATTERN = /^[$a-z0-9]+$/i;

// Delimiter between a key and its value (`=`)
const PAIR_DELIMITER = /=/;

// Patterns for detecting string tokens (temporary placeholders like @@hash@@)
const STRING_TOKEN_PATTERN = /^@@[\w-]+@@$/; // Matches a full token (used for retrieval)
const STRING_TOKEN_PATTERN_PARTIAL = /@@[\w-]+@@/g; // Matches any occurrence of a token in a string

// Patterns for determining value types
const VALUE_BOOLEAN_PATTERN = /^(true|false)$/; // Boolean values: `true` / `false`
const VALUE_NULL_PATTERN = /^null$/; // Null value: `null`
const VALUE_NUMBER_PATTERN = /^(\d+(?:\.\d+)?)$/; // Numbers (integer or floating point)
const VALUE_STRING_PATTERN_PARTIAL = /(["']).*?\1/g; // Strings enclosed in either single or double quotes

/**
 * Generates a unique token to temporarily replace string values.
 * This prevents issues when splitting the string by spaces.
 */
function generateStringToken() {
  const randomString = randomBytes(16).toString('hex'); // Generate a 16-byte random hex string
  return `@@${randomString}@@`; // Returns a token like @@abc123@@
}

/**
 * Parses metadata from a Markdown code block.
 *
 * Example input:
 * foo="hello world" bar=42 active=true mode=null
 *
 * Example output:
 * { foo: "hello world", bar: 42, active: true, mode: null }
 */
export function parseMarkdownCodeMetaData(
  inputData: string,
): Record<string, string | boolean | number | null> {
  const originStringMap = new Map<string, string>(); // Stores original string values before replacing them with tokens

  // 1️⃣ Replace string values with unique tokens
  const inputDataWithStringTokens = inputData
    .trim() // Remove leading and trailing spaces
    .replace(VALUE_STRING_PATTERN_PARTIAL, (stringValue) => {
      const stringToken = generateStringToken(); // Generate a unique token
      originStringMap.set(stringToken, stringValue); // Store the original value with quotes
      return stringToken; // Replace the string value with the token
    });

  // 2️⃣ Split the string into key-value pairs
  const inputDataEntries = inputDataWithStringTokens
    .split(ARGUMENT_DELIMITER) // Split by spaces
    .map((keyValueArgument) => {
      const fragments = keyValueArgument.split(PAIR_DELIMITER); // Split by `=`

      const key = fragments[0]!; // Extract the key (first part)
      const value = fragments[1]! ?? 'true'; // If no value is provided, default to `true`

      // Validate that the key follows the required format
      if (!KEY_PATTERN.test(key)) {
        throw new Error(
          `Parsing error: Invalid key "${key}". The key must be in camelCase.`,
        );
      }

      // Ensure the `=` delimiter is used correctly (there should be at most two parts)
      if (fragments.length > 2) {
        throw new Error(`Parsing error: Invalid entry "${keyValueArgument}".`);
      }

      return [key, value] as const; // Return a tuple [key, value]
    });

  // 3️⃣ Resolve nested string tokens (if any string contains a token, replace it with the actual value)
  originStringMap.forEach((stringValue, stringTokenKey) => {
    originStringMap.set(
      stringTokenKey!,
      stringValue!.replace(
        STRING_TOKEN_PATTERN_PARTIAL,
        (stringSubTokenKey) => {
          return originStringMap.get(stringSubTokenKey) ?? stringSubTokenKey;
        },
      ),
    );
  });

  // 4️⃣ Convert key-value pairs into an object with appropriate types
  return Object.fromEntries(
    inputDataEntries.map(([key, value]) => {
      // If the value is a string token, replace it with the original string (removing quotes)
      if (STRING_TOKEN_PATTERN.test(value)) {
        return [key, originStringMap.get(value)?.slice(1, -1) ?? ''];
      }

      // Convert numbers
      if (VALUE_NUMBER_PATTERN.test(value)) {
        return [key, Number(value)];
      }

      // Convert boolean values
      if (VALUE_BOOLEAN_PATTERN.test(value)) {
        return [key, value === 'true'];
      }

      // Convert `null`
      if (VALUE_NULL_PATTERN.test(value)) {
        return [key, null];
      }

      // If the value type is unknown, throw an error
      throw new Error(`Parsing error: Unknown value type "${value}".`);
    }),
  );
}
