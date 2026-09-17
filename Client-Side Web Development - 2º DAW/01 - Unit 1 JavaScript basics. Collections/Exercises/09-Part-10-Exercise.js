/**
 * Part 10
 * Create a Map object. The key will be a student name, and the value an array with all his/her exam marks.
 * Iterate through the Map and show each student's name, the marks separated by '-' and the average mark (with 2 decimals).
 * Example: Peter (7.60 - 2.50 - 6.25 - 9.00). Average: 6.34
 */
console.log("EXERCISE 1 - PART 10");

const students = new Map([
    ["José",[10, 9.5, 9.25, 9]],
    ["Núria",[8.5, 9.20, 7.75, 8.95]],
    ["Juan",[9.90, 9.25, 7.0, 8.5]],
    ["Kinga",[9.0, 8.75, 9.5, 10]]
])

students.forEach((marks, name) => {
    const average = marks.reduce((sum, mark) => sum + mark, 0) / marks.length;
    console.log(`${name} (${marks.join(' - ')}). Average: ${average.toFixed(2)}`);
})