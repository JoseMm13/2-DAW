/**
 * Part 5
 * Create an array with 4 values and do the following (use the correct array methods).
 * Add 2 elements at the beginning
 * Add 2 more at the end.
 * Delete positions 3,4 and 5
 * Insert 2 elements before the last element.
 * On each change, show the resulting array with its elements separated by '=>' (don't use any loop).
 */
console.log("EXERCISE 1 - PART 5");

let array = ["María", "Lily", "Juan", "José", "Pedro"]

array.unshift("Sofía", "Kinga")
console.log(array.join("=>"))

array.push("Elena", "Javier")
console.log(array.join("=>"))

array.splice(2, 3)
console.log(array.join("=>"))

array.splice(array.length - 1, 0, "Lucía", "Núria")
console.log(array.join("=>"))