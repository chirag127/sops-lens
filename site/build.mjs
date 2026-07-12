// Generate site/dist/index.html from README.md via marked. Zero framework.
import { copyFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { marked } from 'marked'

const here = dirname(fileURLToPath(import.meta.url))
const root = join(here, '..')
const dist = join(here, 'dist')

const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'))
const readme = await readFile(join(root, 'README.md'), 'utf8')

// Strip the H1 + star badge + lead blockquote — the hero replaces them.
const body = readme.replace(/^#[^\n]*\n+(\[!\[[^\n]*\n+)?>[^\n]*\n+/, '')
const readmeHtml = marked.parse(body, { gfm: true })

const shell = await readFile(join(here, 'shell.html'), 'utf8')
const html = shell.replaceAll('{{VERSION}}', pkg.version).replace('{{README}}', readmeHtml)

await mkdir(dist, { recursive: true })
await writeFile(join(dist, 'index.html'), html)
await copyFile(join(here, 'style.css'), join(dist, 'style.css'))
await copyFile(join(here, 'app.js'), join(dist, 'app.js'))
console.log(`site → dist/index.html (v${pkg.version})`)
