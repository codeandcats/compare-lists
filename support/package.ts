import * as fs from 'fs';
import { rootPath } from 'get-root-path';
import * as path from 'path';

fs.copyFileSync(path.join(rootPath, 'package.json'), path.join(rootPath, 'dist/package.json'));
fs.copyFileSync(path.join(rootPath, 'README.md'), path.join(rootPath, 'dist/README.md'));

const packageJson = JSON.parse(fs.readFileSync(path.join(rootPath, 'dist/package.json'), 'utf8'));

delete packageJson.private;
delete packageJson.scripts;
delete packageJson.devDependencies;

fs.writeFileSync(path.join(rootPath, 'dist/package.json'), JSON.stringify(packageJson, null, '  '), 'utf8');
