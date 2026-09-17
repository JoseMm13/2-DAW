/**
 * Part 9
 * Create a function that takes an array of lights represented by the characters '🔴' and '🟢'.
 * The function should check if the lights are alternating (e.g., ['🔴', '🟢', '🔴', '🟢', '🔴']).
 * Return the minimum number of lights that need to be changed to make the lights alternate.
 * adjustLights(['🔴', '🔴', '🟢', '🔴', '🟢'])  -> 1 (change the first light to green)
 */

console.log("EXERCISE 1 - PART 9");

function adjustLights(lights) {
  let changesToRed = 0
  let changesToGreen = 0
  for (let i = 0; i < lights.length; i++) {
    if (i % 2 === 0) {
      if (lights[i] !== "🔴") changesToRed++
      if (lights[i] !== "🟢") changesToGreen++
    } else {
      if (lights[i] !== "🟢") changesToRed++
      if (lights[i] !== "🔴") changesToGreen++
    }
  }

  return Math.min(changesToRed, changesToGreen)
}

console.log(adjustLights(['🔴', '🔴', '🟢', '🔴', '🟢']))