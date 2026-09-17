/**
 * Part 4
 * Develop a function that compresses a string by replacing consecutive repeating characters with
 * the character and the count of repetitions. For example, "AAAABBBCC" would become "4A3B2C".
 * Example: stringCompression("GGGHHRRRRRRRUIIIOOOO") -> 3G2H7R1U3I4O
 */

console.log("EXERCISE 1 - PART 4")

function stringCompression(text) {
    if (typeof text !== "string" || text.length < 1) {
        console.log("Error: the parameter must be a non-empty string.")
        return -1
    }
let result =""
let count = 1

for (let i = 0; i < text.length; i++) {
    if (i < text.length - 1 && text[i] === text[i + 1]) {
        count++
    } else {
        result += count + text[i];
        count = 1
    }
}
return result
}

console.log(stringCompression("GGGHHRRRRRRRUIIIOOOO"))
