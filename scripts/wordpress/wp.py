"""Shared WordPress REST client for the volksswitch.org scripts in this folder.

Adapted from Conversant AAC's scripts/wordpress/wp.py (October 27 2026), and it uses
Conversant's credentials file rather than a copy: .wordpress-credentials at the root of
the AI-driven AAC project (git-ignored there), holding the "Claude" editor account's
application password. One file means one place to revoke it, from that user's profile.

Two traps this file exists to absorb, so no script has to rediscover them:
  - The REST base is .../index.php/wp-json/ - the bare /wp-json/ is a 404 on this site.
  - The host's firewall (Mod_Security) answers 406 "Not Acceptable" to Python's and
    curl's default User-Agent. That reads like a permissions failure and is not one.
"""
import base64, json, os, urllib.error, urllib.request

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
CONVERSANT = os.path.join(os.environ['OneDrive'], '4 T-Z', 'Volksswitch', 'AI-driven AAC')
UA = 'KeyguardDocsPublisher/1.0'

_creds = json.load(open(os.path.join(CONVERSANT, '.wordpress-credentials'), encoding='utf-8'))
API = _creds['site'].rstrip('/')
_AUTH = 'Basic ' + base64.b64encode(
    f"{_creds['username']}:{_creds['applicationPassword']}".encode()).decode()


def call(method, path, body=None, headers=None):
    h = {'Authorization': _AUTH, 'User-Agent': UA}
    if isinstance(body, (dict, list)):
        body = json.dumps(body).encode('utf-8')
        h['Content-Type'] = 'application/json'
    h.update(headers or {})
    req = urllib.request.Request(API + path, data=body, headers=h, method=method)
    try:
        with urllib.request.urlopen(req, timeout=300) as r:
            return json.load(r)
    except urllib.error.HTTPError as e:
        raise SystemExit(f'WordPress refused {method} {path}: {e.code} {e.read()[:300]!r}')


def upload(path, filename, mime, title, folder):
    """Upload a file into a media folder. Returns {'id', 'url'}."""
    # ⚠ A FORM UPLOAD, NOT A RAW BODY. The host's firewall answers 406 to a raw upload
    # with a Content-Disposition header (Conversant, measured Sep 14 2026) and lets
    # multipart/form-data through.
    boundary = 'KeyguardBoundary7f3a9c'
    with open(path, 'rb') as f:
        body = (f'--{boundary}\r\nContent-Disposition: form-data; name="file"; '
                f'filename="{filename}"\r\nContent-Type: {mime}\r\n\r\n'
                ).encode() + f.read() + f'\r\n--{boundary}--\r\n'.encode()
    media = call('POST', '/wp/v2/media', body, {'Content-Type': f'multipart/form-data; boundary={boundary}'})
    call('POST', f'/wp/v2/media/{media["id"]}', {'title': title, 'media_folder': [folder]})
    return {'id': media['id'], 'url': media['source_url']}


def media_folder(name, parent):
    """The id of the media folder `name` under `parent` (0 for the top), made if missing."""
    for f in call('GET', f'/wp/v2/media_folder?per_page=100&search={urllib.request.quote(name)}'):
        if f['name'] == name and f.get('parent', 0) == parent:
            return f['id']
    return call('POST', '/wp/v2/media_folder', {'name': name, 'parent': parent})['id']
