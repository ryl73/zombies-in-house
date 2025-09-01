export function* randomGenerator(min: number, max: number) {
  const numbers = Array.from({ length: max - min + 1 }, (_, i) => i + min)

  while (numbers.length > 0) {
    const index = Math.floor(Math.random() * numbers.length)
    yield numbers.splice(index, 1)[0]
  }
}

export const getRandomInt = (min: number, max: number): number => {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min + 1)) + min
}
