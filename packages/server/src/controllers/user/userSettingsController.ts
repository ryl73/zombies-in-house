import type { NextFunction, Request, Response } from 'express'
import type { ThemeType } from '../../models/theme/Theme'
import UserSettings from '../../models/user/UserSettings'
import UserController from './userController'

export default class UserSettingsController {
  static async setTheme(
    req: Request<unknown, unknown, { userId: number; theme: ThemeType }>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const user = await UserController.get(req, next)
      const { theme } = req.body

      await UserSettings.upsert({ userId: user.id, theme })

      res.status(200).json({ theme })
    } catch (e) {
      res.status(500).json({ error: 'Failed to set theme', details: e })
    }
  }

  static async getTheme(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await UserController.get(req, next)

      let settings = await UserSettings.findByPk(user.id)
      if (!settings) {
        // const settingsTheme = 'dark'
        const settingsTheme = 'halloween'
        settings = await UserSettings.create({
          userId: user.id,
          theme: settingsTheme,
        })
      }

      return res.status(200).json({ theme: settings.theme })
    } catch (e) {
      return res.status(500).json({ error: 'Failed to get theme', details: e })
    }
  }
}
