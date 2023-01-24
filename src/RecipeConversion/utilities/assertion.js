export function assert(assertion, message) {
  if (!assertion) {
    const errorMessage = message ?? 'Assertion Failed';
    throw new Error(errorMessage);
  }
}
