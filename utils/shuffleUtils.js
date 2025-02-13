function fisherYatesShuffle(array) {
  const n = array.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

// Sattolo Shuffle (Circular Permutation)
function sattoloShuffle(array) {
  const n = array.length;
  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i); // Ensure j < i
    [array[i], array[j]] = [array[j], array[i]]; // Swap elements
  }
  return array;
}

module.exports = { fisherYatesShuffle, sattoloShuffle };