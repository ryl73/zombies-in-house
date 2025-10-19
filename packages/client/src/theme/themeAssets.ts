import hud from '../assets/hud.webp'
import hudHalloween from '../assets/halloween/hud-halloween.webp'
import notFoundImage from '../assets/notfound.webp'
import notFoundImageLight from '../assets/notfound-light.webp'
import notFoundImageHalloween from '../assets/halloween/notfound-halloween.webp'
import spinwheel from '../assets/spinwheel.webp'
import spinwheelHalloween from '../assets/halloween/spinwheel-halloween.webp'
import landing from '../assets/landing-first-screen.webp'
import landingHalloween from '../assets/halloween/landing-first-screen-halloween.webp'

export const themeAssets = {
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
