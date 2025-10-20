import type { Request, Response } from 'express'
import type { ThemeType } from '../../models/theme/Theme'
import UserSettings from '../../models/user/UserSettings'

export default class UserSettingsController {
  static async setTheme(
    req: Request<unknown, unknown, { userId: number; theme: ThemeType }>,
    res: Response
  ) {
    try {
      const { userId, theme } = req.body

      await UserSettings.upsert({ userId, theme })

      res.status(200).json({ theme })
    } catch (e) {
      res.status(500).json({ error: 'Failed to set theme', details: e })
    }
  }

  static async getTheme(req: Request, res: Response) {
    try {
      const userId = req.query.userId as string
      if (!userId) return res.status(400).json({ error: 'userId required' })

      let settings = await UserSettings.findByPk(userId)
      if (!settings) {
        // const settingsTheme = 'dark'
        const settingsTheme = 'halloween'
        settings = await UserSettings.create({ userId, theme: settingsTheme })
      }

      return res.status(200).json({ theme: settings.theme })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to get theme', details: e })
    }
  }
}
