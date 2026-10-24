"""Create portable precompiled installation and complete source archives."""
from pathlib import Path
import hashlib, json, shutil, zipfile
root = Path(__file__).resolve().parents[1]
output = root.parent / 'lulu-warm-study-install-v1.0.0'
package = output / 'dsh-lulu-warm-study-theme'
package.mkdir(parents=True, exist_ok=True)
manifest = json.loads((root / 'package.json').read_text())
manifest.pop('devDependencies', None)
manifest.pop('scripts', None)
(package / 'package.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2)+'\n')
files = [root/'cordis.patch.yml', root/'README.md', root/'docs/INSTALL.md', root/'docs/preview.webp']
files += list((root/'lib').glob('*')) + list((root/'assets').glob('*.webp'))
for source in files:
 target=package/source.relative_to(root)
 target.parent.mkdir(parents=True,exist_ok=True)
 shutil.copy2(source,target)
(output/'先看这里-安装说明.txt').write_text((root/'docs/INSTALL.md').read_text(), encoding='utf-8')
archive=root.parent/'lulu-warm-study-install-v1.0.0.zip'
with zipfile.ZipFile(archive,'w',zipfile.ZIP_DEFLATED) as z:
 for file in sorted(output.rglob('*')):
  if file.is_file(): z.write(file,Path(output.name)/file.relative_to(output))
with zipfile.ZipFile(archive) as z: assert z.testzip() is None
source_archive=root.parent/'lulu-warm-study-source-v1.0.0.zip'
source_files=[root/name for name in ['package.json','package-lock.json','cordis.patch.yml','README.md','design-qa.md','.gitignore']]
for folder in ['assets','docs','lib','src','scripts','preview']:
 source_files += [p for p in (root/folder).rglob('*') if p.is_file()]
with zipfile.ZipFile(source_archive,'w',zipfile.ZIP_DEFLATED) as z:
 for file in sorted(source_files): z.write(file,Path(root.name)/file.relative_to(root))
with zipfile.ZipFile(source_archive) as z:
 assert z.testzip() is None
 assert not any('.dsh-study-home' in name or 'node_modules' in name for name in z.namelist())
assert (package/'lib/client.js').read_bytes()==(root/'lib/client.js').read_bytes()
print('Installation:',archive,'bytes:',archive.stat().st_size)
print('Source:',source_archive,'bytes:',source_archive.stat().st_size)
print('Bundle SHA-256:',hashlib.sha256((root/'lib/client.js').read_bytes()).hexdigest())
