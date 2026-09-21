/*
 * Part 1.
 * Create a function that receives 2 strings. The second string must contain only a letter.
 * It should return the number of times that letter (second parameter) is included in the string (first parameter).
 * It should not differentiate between uppercase and lowercase letters
 * Check that both parameters are strings and the second string is only 1 character. 
 * If there's an error, print a message and return -1
 * Example: timesChar("Characteristic", "c") -> 3
 */
 console.log("Exercise 1 - Part 1")

 function timesChar(str, char) {
    if (typeof str !== 'string' || typeof char !== 'string' || char.length !== 1) {
        console.log("Error: Invalid parameters");
        return -1;
    }
    str = str.toLowerCase();
    char = char.toLowerCase();
    let count = 0;
    for (let i = 0; i < str.length; i++) {
        if (str[i] === char) {
            count++;
        }
    }
    return count;
}

console.log(timesChar("Characteristic", "c"))