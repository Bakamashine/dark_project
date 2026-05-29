const AdmZip = require('adm-zip')
const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'release')
const APP_NAME = 'dark_project'
const PLATFORM = process.platform
const ARCH = process.arch
const ELECTRON_VERSION = require(path.join(ROOT, 'node_modules', 'electron', 'package.json')).version

const PLATFORM_ARCH = `${PLATFORM}-${ARCH}`
const APP_DIR = path.join(OUT_DIR, `${APP_NAME}-${PLATFORM_ARCH}`)
const RESOURCES_DIR = path.join(APP_DIR, 'resources')

console.log(`Packaging ${APP_NAME} for ${PLATFORM_ARCH} using Electron v${ELECTRON_VERSION}...`)

// Step 1: Build renderer with Vite
console.log('\n--- Step 1: Building renderer with Vite ---')
execSync('npx vite build', { stdio: 'inherit', cwd: ROOT })

// Step 2: Extract Electron to app directory
console.log('\n--- Step 2: Extracting Electron runtime ---')
if (fs.existsSync(APP_DIR)) {
  fs.rmSync(APP_DIR, { recursive: true })
}
fs.mkdirSync(RESOURCES_DIR, { recursive: true })

const zipPath = path.join(
  process.env.USERPROFILE,
  'AppData', 'Local', 'electron', 'Cache',
  'bc80a13ebe4734629db853b3fc870b18ba9e388b795710fdbbd075694e548d03',
  `electron-v${ELECTRON_VERSION}-${PLATFORM_ARCH}.zip`
)

if (!fs.existsSync(zipPath)) {
  console.error(`Electron zip not found at: ${zipPath}`)
  process.exit(1)
}

const zip = new AdmZip(zipPath)
zip.extractAllTo(APP_DIR, true)

// Step 3: Copy app source
console.log('\n--- Step 3: Copying app source ---')
const APP_SRC_DIR = path.join(RESOURCES_DIR, 'app')
fs.mkdirSync(APP_SRC_DIR, { recursive: true })

for (const file of ['index.js', 'package.json', 'dist']) {
  const src = path.join(ROOT, file)
  const dest = path.join(APP_SRC_DIR, file)
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true })
  }
}

// Step 4: Get production dependencies and copy only those
console.log('\n--- Step 4: Copying production node_modules ---')
const prodDepsOutput = execSync('npm ls --production --parseable --all', {
  cwd: ROOT,
  encoding: 'utf-8',
})

const depPaths = prodDepsOutput
  .split('\n')
  .map(line => line.trim())
  .filter(line => line && !line.includes('node_modules\\.bin'))

for (const depPath of depPaths) {
  const relativePath = path.relative(ROOT, depPath)
  if (!relativePath.startsWith('node_modules')) continue

  const destPath = path.join(APP_SRC_DIR, relativePath)
  fs.mkdirSync(path.dirname(destPath), { recursive: true })
  if (!fs.existsSync(destPath)) {
    fs.cpSync(depPath, destPath, { recursive: true })
  }
}

// Step 5: Create asar archive
console.log('\n--- Step 5: Creating app.asar ---')
execSync(`npx asar pack "${APP_SRC_DIR}" "${path.join(RESOURCES_DIR, 'app.asar')}"`, {
  stdio: 'inherit',
  cwd: ROOT,
})

try {
  fs.rmSync(APP_SRC_DIR, { recursive: true })
} catch {
  console.log('  (could not remove temp app directory, skipping)')
}

// Step 6: Remove Electron's default app
const defaultAppAsar = path.join(RESOURCES_DIR, 'default_app.asar')
if (fs.existsSync(defaultAppAsar)) {
  try {
    fs.rmSync(defaultAppAsar)
  } catch {
    console.log('  (could not remove default_app.asar, skipping)')
  }
}

console.log('\n--- Done! ---')
console.log(`App packaged to: ${APP_DIR}`)
