import fg from 'fast-glob'
import { promises as fs } from 'fs'
import path from 'path'

const workingDir = process.cwd()

const imagesDir = path.join(workingDir, 'dist/client/images')
const files = await fg(
  ['**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.webp', '**/*.svg'],
  { cwd: imagesDir }
)

const urls = files.map(f => '/images/' + f.replace(/\\/g, '/'))

try {
  await fs.writeFile(
    path.join(workingDir, 'dist/client/images.json'),
    JSON.stringify(urls, null, 2)
  )
} catch (error) {
  console.error('Error on writing data in images file')
}
