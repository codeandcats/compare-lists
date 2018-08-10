import * as fs from 'fs'
import * as root from 'app-root-path'

fs.copyFileSync(root.resolve('./package.json'), root.resolve('./dist/package.json'))

fs.copyFileSync(root.resolve('./README.md'), root.resolve('./dist/README.md'))

const packageJson = JSON.parse(fs.readFileSync('./dist/package.json', 'utf8'))

delete packageJson.private
delete packageJson.scripts
delete packageJson.devDependencies

fs.writeFileSync(root.resolve('./dist/package.json'), JSON.stringify(packageJson, null, '  '), 'utf8')
