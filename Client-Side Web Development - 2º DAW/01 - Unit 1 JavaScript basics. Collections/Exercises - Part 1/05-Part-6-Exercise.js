/**
 * Part 6
 * Create a function that takes an array of numbers containing duplicate values. It should return the
 * first number that is repeated in the array, or -1 if there are no duplicates.
 * Do not use loops, and  if you don't know how to do it without loops, you can only use one loop
 * (.forEach counts as a loop).
 * Example: findFirstRepeated([1,4,7,3,8,4,5,5,1]) -> 4
 */

console.log("EXERCISE 1 - PART 6");

function findFirstRepeated(numbers) {
  if (!Array.isArray(numbers)) {
    console.log("Error: the parameter must be an array")
    return -1
  }

  const seen = new Set()

  for (const number of numbers) {
    if (seen.has(number)) {
      return number
    }
    seen.add(number)
  }

  return -1
}

console.log(findFirstRepeated([1, 4, 7, 3, 8, 4, 5, 5, 1]))
console.log(findFirstRepeated([1, 2, 3, 4])) 