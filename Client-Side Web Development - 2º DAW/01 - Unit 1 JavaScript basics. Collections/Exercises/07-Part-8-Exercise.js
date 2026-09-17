/**
 * Part 8
 * Create a function that takes an arry of strings as the first parameter and a string as the second.
 * It should return a new array containing the words frim the fist array whose letters are all present in the second string.
 * Try not to use loops.
 * Example: filterWords(["house", "car", "watch", "table"], "catboulerham") -> ['car', 'table']
 */

console.log("EXERCISE 1 - PART 8");

function filterWords(words, letters) {
    return words.filter(word => word.split('').every(letter => letters.includes(letter)))

}

console.log(filterWords(["house", "car", "watch", "table"], "catboulerham"))