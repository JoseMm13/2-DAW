/**
 * Part 2
 * Create a function that takes a string as input and checks if it's a palindrome (if it's the same when reversed).
 * Do this without using loops (hint: you can use Array.from to convert a string into an array).
 * Check that the type of the parameter is "string", and the lenght is at least 1 or show an error
 * Example: isPalindrome("abeceba") -> true
 */

console.log("EXERCISE 1 - PART 2");

function isPalindrome(text) {
  if (typeof text !== "string" || text.length < 1) {
    console.log("Error: the parameter must be a non-empty string.");
    return -1;
  }

  const chars = Array.from(text);
  const reversed = chars.slice().reverse().join("");

  return text === reversed;
}

// -- Examples one true and one false
console.log(isPalindrome("racecar")); // true
console.log(isPalindrome("hello"));    // false
