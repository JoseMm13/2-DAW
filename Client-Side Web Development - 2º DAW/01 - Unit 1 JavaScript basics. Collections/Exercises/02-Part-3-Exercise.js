/**
 * Part 3
 * Create an array of strings.
 * Filter the array to include only the strings which their length is at least 5 characters
 * Transform all the strings in the filtered array to UPPERCASE
 * Print the resulting array, using ";" as the separator
 * Don't use traditional loops! (while, for, ...)
 */
console.log("EXERCISE 1 - PART 3");

const words = ["cat", "falcon", "eagle", "nuni","wolf"]

const result = words
  .filter(word => word.length >= 5)
  .map(word => word.toUpperCase())
  .join(";");

console.log(result);