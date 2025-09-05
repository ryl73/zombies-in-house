import fg from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'

const imagesDir = path.join(process.cwd(), 'dist/client/images')
const files = await fg('**/*.*', { cwd: imagesDir, absolute: false })

const urls = files.map(f => '/images/' + f.replace(/\\/g, '/'))

await fs.writeFile(
  path.join(process.cwd(), 'dist/client/images.json'),
  JSON.stringify(urls, null, 2)
)
