import Theme, { ThemeType } from '../models/theme/Theme'

export const seedThemes = async () => {
  const themes: ThemeType[] = ['light', 'dark', 'halloween']

  for (const name of themes) {
    await Theme.upsert({ name })
  }
}
