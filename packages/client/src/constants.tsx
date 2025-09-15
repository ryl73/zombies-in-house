import './client.d'

export const SERVER_HOST =
  typeof window === 'undefined'
    ? __INTERNAL_SERVER_URL__
    : __EXTERNAL_SERVER_URL__

export const API_RESOURCES_URL = 'https://ya-praktikum.tech/api/v2/resources/'

export const MAX_SIZE_AVATAR_FILE = 5242880 // сейчас 5 мегабайт
export const MAX_SIZE_AVATAR_FILE_TEXT = '5MB' // текстовка размера для сообщения об ошибке
