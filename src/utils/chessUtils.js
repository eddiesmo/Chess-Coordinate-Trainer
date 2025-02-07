export const filesDefault = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranksDefault = ['1', '2', '3', '4', '5', '6', '7', '8'];

export function getRandomSquare() {
  const randomFile = filesDefault[Math.floor(Math.random() * filesDefault.length)];
  const randomRank = ranksDefault[Math.floor(Math.random() * ranksDefault.length)];
  return `${randomFile}${randomRank}`;
}

export function getNewRandomSquare(currentSquare) {
  let newSquare;
  do {
    newSquare = getRandomSquare();
  } while (newSquare === currentSquare);
  return newSquare;
}
