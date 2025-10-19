import { themeAssets } from './themeAssets'
import { ThemeMode } from './ThemeContext'

class ThemeManager {
  // change to 'dark'
  private mode: ThemeMode = 'halloween'

  getMode() {
    return this.mode
  }

  setMode(mode: ThemeMode) {
    this.mode = mode
  }

  getAssets() {
    return themeAssets[this.mode]
  }
}

export const themeManager = new ThemeManager()
