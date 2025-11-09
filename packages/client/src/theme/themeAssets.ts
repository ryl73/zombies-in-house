import hud from '../assets/hud.webp'
import hudHalloween from '/images/game/cards/halloween/hud-halloween.webp'
import notFoundImage from '../assets/notfound.webp'
import notFoundImageLight from '../assets/notfound-light.webp'
import notFoundImageHalloween from '/images/game/cards/halloween/notfound-halloween.webp'
import spinwheel from '../assets/spinwheel.webp'
import spinwheelHalloween from '/images/game/cards/halloween/spinwheel-halloween.webp'
import landing from '../assets/landing-first-screen.webp'
import landingHalloween from '/images/game/cards/halloween/landing-first-screen-halloween.webp'
import { ThemeMode } from './ThemeContext'

export type ThemeAssetsItem = {
  [key: string]: string
}

type ThemeAssetsMap = Record<ThemeMode, ThemeAssetsItem>

export const themeAssets: ThemeAssetsMap = {
  light: {
    hud,
    notFound: notFoundImageLight,
    spinwheel,
    landing,
  },
  dark: {
    hud,
    notFound: notFoundImage,
    spinwheel,
    landing,
  },
  halloween: {
    hud: hudHalloween,
    notFound: notFoundImageHalloween,
    spinwheel: spinwheelHalloween,
    landing: landingHalloween,
  },
}
