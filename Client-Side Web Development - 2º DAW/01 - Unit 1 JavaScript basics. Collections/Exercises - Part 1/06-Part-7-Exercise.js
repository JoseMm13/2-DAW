/**
 * Part 7
 * Create an array with several strings. Using the reduce method, return a string 
 * that is a concatenation of the first letter of every string in the array.
 */

console.log("EXERCISE 1 - PART 7");

const strings = ["Atom", "Energy", "Force", "Gravity", "Light", "Matter", "Neutron", "Thermodynamics", "Quark", "Photon"];

const firstLetters = strings.reduce((accumulator, currentValue) => {
    return accumulator + currentValue[0];
}, "")

console.log(firstLetters)
