import { randomGenerator } from '../../utils/random'

const PINWHEEL_STATE_MAP = {
  RUN: 'run',
  SHOOT: 'shoot',
  CLOSE_FIGHT: 'closeFight',
  BITE: 'bite',
} as const

export type PinWheelState =
  typeof PINWHEEL_STATE_MAP[keyof typeof PINWHEEL_STATE_MAP]

export type PinWheelResult = {
  action: PinWheelState
  moveCount: number
}

const pinWheelFields: Record<string, PinWheelResult> = {
  '1': { action: PINWHEEL_STATE_MAP.RUN, moveCount: 1 },
  '2': { action: PINWHEEL_STATE_MAP.BITE, moveCount: 2 },
  '3': { action: PINWHEEL_STATE_MAP.CLOSE_FIGHT, moveCount: 3 },
  '4': { action: PINWHEEL_STATE_MAP.SHOOT, moveCount: 4 },
}

export async function spinPinWheel() {
  console.log('🎡 Крутим вертушку...')
  await new Promise(resolve => setTimeout(resolve, 1000))

  const keys = Array.from(Object.keys(pinWheelFields).map(key => Number(key)))
  const min = Math.min(...keys)
  const max = Math.max(...keys)

  const nextRandom = randomGenerator(min, max)

  const result = nextRandom.next()
  if (result.done) return pinWheelFields['1']

  return pinWheelFields[result.value.toString()]
}
