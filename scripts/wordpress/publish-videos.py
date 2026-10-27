"""Publish the how-to videos and their guides to volksswitch.org.

    python scripts/wordpress/publish-videos.py                    # show what would change
    python scripts/wordpress/publish-videos.py --apply            # publish every video that changed
    python scripts/wordpress/publish-videos.py --apply 1.1-what-for 1.2-open-and-start
                                                                  # only these

Adapted from Conversant AAC's publish-videos.py (Ken, October 27 2026: "follow the
template of the AI-driven AAC project"). Each video published is uploaded (its .mp4 and
its one-page .pdf guide) into the media folder "Customizable, 3D Printable Keyguard >
Web App > Videos"; each gets a watch page, a child of the videos page; and the videos
page is rebuilt from scripts/video/course.json, listing every video published so far.
With no ids, every made video whose signature differs from the one published goes up.

⚠ THE ADDRESSES ARE FIXED. The User Manual links each watch page by the address made
here (scripts/video/add-manual-links.py builds the same ones): the videos page at
/index.php/keyguard-designer-videos/ and each watch page at video-<n>-<n>/ beneath it.
A watch page's address comes from the video's number, which is why a published video is
never renumbered. A page that lands anywhere else stops the run.

THE PAGES ARE MADE PUBLIC, unlike Conversant's first run, which made the list page a
draft for Ken to publish: Ken asked for the pages to be made and every link checked
(October 27 2026), and a watch page can only get its proper address under a published
page. Nothing on the site links to them until Ken adds them to a menu or a page (new
pages are not added to the site's menus by themselves; checked that day).

The site cannot stream video, so each watch page plays the uploaded file. The
renderer's files are about 2 MB a minute.

OLD COPIES ARE NOT DELETED: deleting media is permanent. Replaced files are listed at
the end so Ken can delete them in WordPress.

ORDER: uploads first, then the pages, then the local list. After a successful run each
video published is recorded as published for "sync videos" (sync-videos.mjs --published),
so the next sync reports only what changed since.
"""
import hashlib, html, json, os, subprocess, sys

from wp import ROOT, call, media_folder, upload

LIST = os.path.join(os.path.dirname(__file__), 'videos.json')
VIDEOS = os.path.join(ROOT, 'Videos')
COURSE = os.path.join(ROOT, 'scripts', 'video', 'course.json')
SYNC = os.path.join(ROOT, 'scripts', 'video', 'sync-videos.mjs')
MAP_PDF = 'Learning the Keyguard Designer.pdf'
WEB_APP_FOLDER = 100            # "Customizable, 3D Printable Keyguard > Web App"
LIST_URL = 'https://volksswitch.org/index.php/keyguard-designer-videos/'

DEFAULT = {
    '_about': ('The how-to videos published on the page named here. Written by '
               'scripts/wordpress/publish-videos.py; do not edit the recorded ids and '
               'addresses by hand.'),
    'page': 'keyguard-designer-videos',
    'pageTitle': 'Keyguard Designer How-To Videos',
    'mediaFolder': None,
    'videos': {},
    'courseMap': None,
}
NL = chr(10)


def length(seconds):
    m, s = divmod(int(seconds), 60)
    return f'{m}:{s:02d}'


def safe_name(text):
    out = ''.join(c if c.isalnum() else '-' for c in text)
    while '--' in out:
        out = out.replace('--', '-')
    return out.strip('-')


def watch_slug(item):
    return 'video-' + item['num'].replace('.', '-')


def build_page(cfg, course):
    e = html.escape
    out = ['<!-- wp:paragraph -->\n<p>Short videos, about a minute each, that show you how to use '
           'the Keyguard Designer. Each has a one-page guide with the same steps. Each video opens in its '
           'own tab, and when it finishes you can go straight on to the next one.</p>\n<!-- /wp:paragraph -->']
    if cfg.get('courseMap'):
        out.append('<!-- wp:paragraph -->\n<p>New to the Keyguard Designer? Start with "Getting started", '
                   'then "Measuring", and watch those in order. After that, pick the ones you need. '
                   f'<a href="{e(cfg["courseMap"]["url"])}" target="_blank" rel="noopener">'
                   'The full list (PDF)</a>.</p>\n<!-- /wp:paragraph -->')
    for g in course['groups']:
        rows = []
        for item in g['items']:
            v = cfg['videos'].get(item.get('id'))
            if not v:
                continue
            rows.append(
                f'<tr><td>{e(item["num"])}</td>'
                f'<td><a href="{e((v.get("page") or v["video"])["url"])}" target="_blank" rel="noopener">{e(item["title"])}</a> '
                f'({length(v["seconds"])})</td>'
                f'<td>{e(item["learn"])}</td>'
                f'<td><a href="{e(v["guide"]["url"])}" target="_blank" rel="noopener">Guide (PDF)</a></td></tr>')
        if not rows:
            continue
        heading = g['name'] + (' (watch these in order)' if g.get('path') else '')
        out.append(f'<!-- wp:heading -->\n<h2 class="wp-block-heading">{e(heading)}</h2>\n<!-- /wp:heading -->')
        out.append('<!-- wp:table -->\n<figure class="wp-block-table"><table><thead><tr><th></th><th>Video</th>'
                   f'<th>What you will learn</th><th>Guide</th></tr></thead><tbody>{"".join(rows)}</tbody></table>'
                   '</figure>\n<!-- /wp:table -->')
    return '\n\n'.join(out)


def course_map_signature(cfg, course):
    listed = [(i['num'], i['title'], i['learn']) for g in course['groups'] for i in g['items']
              if i.get('id') in cfg['videos']]
    return hashlib.sha256(json.dumps(listed).encode()).hexdigest()


# One watch page per video. The video plays in the page; when it ends, a "Next" button
# covers the player and goes straight to the next video's page, which tries to start
# playing at once (a browser may still ask for a tap; that is the browser's rule). A
# video FILE cannot carry a link, so the button lives in the page.
def build_watch(item, v, nxt, url_of, list_url):
    e = html.escape
    if nxt:
        text, target = f'Next: {nxt["num"]} {nxt["title"]} →', url_of[nxt['id']] + '?play=1'
    else:
        text, target = 'Back to all the videos', list_url
    style = ('background:#ff6d00;color:#fff;font-size:1.3em;font-weight:bold;'
             'padding:14px 24px;border-radius:10px;text-decoration:none;')
    return ('<!-- wp:html -->' + NL +
            '<div id="kg-wrap" style="position:relative;max-width:960px;">'
            f'<video id="kg-video" src="{e(v["video"]["url"])}" controls playsinline preload="metadata" '
            'style="width:100%;display:block;background:#000;"></video>'
            # Hidden by display:none, NOT the hidden attribute: an inline display value
            # overrides that attribute (Conversant, October 24 2026).
            '<div id="kg-end" style="position:absolute;inset:0;background:rgba(20,30,45,0.88);'
            'display:none;flex-direction:column;align-items:center;justify-content:center;gap:16px;">'
            f'<a id="kg-next" href="{e(target)}" style="{style}">{e(text)}</a>'
            '<button id="kg-again" type="button" style="font-size:1.1em;padding:10px 20px;border-radius:8px;">'
            'Watch this one again</button></div></div>' + NL +
            f'<p>{e(item["learn"])} ({length(v["seconds"])})</p>' + NL +
            f'<p><a href="{e(v["guide"]["url"])}" target="_blank" rel="noopener">The guide for this video (PDF)</a></p>' + NL +
            f'<p><a href="{e(target)}">{e(text)}</a> &nbsp;|&nbsp; <a href="{e(list_url)}">All the videos</a></p>' + NL +
            ('<script>(function(){var v=document.getElementById("kg-video"),end=document.getElementById("kg-end");'
             'v.addEventListener("ended",function(){end.style.display="flex";'
             'document.getElementById("kg-next").focus();});'
             'document.getElementById("kg-again").addEventListener("click",function(){'
             'end.style.display="none";v.currentTime=0;v.play();});'
             'if(/[?&]play=1/.test(location.search)){var p=v.play();if(p&&p.catch)p.catch(function(){});}'
             '})();</script>') + NL +
            '<!-- /wp:html -->')


def update_watch_pages(cfg, course, list_page, apply):
    items = [i for g in course['groups'] for i in g['items'] if i.get('id') in cfg['videos']]
    base = list_page['link'].rstrip('/') + '/'
    url_of = {i['id']: base + watch_slug(i) + '/' for i in items}
    for n, item in enumerate(items):
        v = cfg['videos'][item['id']]
        nxt = items[n + 1] if n + 1 < len(items) else None
        content = build_watch(item, v, nxt, url_of, list_page['link'])
        title = f'{item["num"]} {item["title"]}'
        page = v.get('page')
        if page:
            current = call('GET', f'/wp/v2/pages/{page["id"]}?context=edit')
            if current['content']['raw'].strip() == content.strip() and current['title']['raw'] == title:
                continue
            print(f'  WATCH PAGE {"UPDATED" if apply else "would be updated"}: {title}')
            if apply:
                call('POST', f'/wp/v2/pages/{page["id"]}', {'title': title, 'content': content})
        else:
            print(f'  WATCH PAGE {"MADE" if apply else "would be made"}: {title}')
            if apply:
                made = call('POST', '/wp/v2/pages', {'title': title, 'slug': watch_slug(item),
                                                     'parent': list_page['id'], 'status': 'publish',
                                                     'content': content})
                v['page'] = {'id': made['id'], 'url': made['link']}
                if made['link'] != url_of[item['id']]:
                    save(cfg)
                    raise SystemExit(f'The page for {title} landed at {made["link"]}, not {url_of[item["id"]]}; '
                                     'the manual and the Next links would be wrong. Nothing more has been changed.')


def save(cfg):
    with open(LIST, 'w', encoding='utf-8', newline='\n') as f:
        json.dump(cfg, f, indent=2, ensure_ascii=False)
        f.write('\n')


def main():
    apply = '--apply' in sys.argv
    cfg = json.load(open(LIST, encoding='utf-8')) if os.path.exists(LIST) else json.loads(json.dumps(DEFAULT))
    course = json.load(open(COURSE, encoding='utf-8'))
    items = {i['id']: i for g in course['groups'] for i in g['items'] if i.get('id')}
    ids = [a for a in sys.argv[1:] if not a.startswith('--')]
    if not ids:
        # Every made video whose signature differs from the one published.
        for vid in items:
            made = os.path.join(VIDEOS, f'{vid}.json')
            if os.path.exists(made):
                sig = json.load(open(made, encoding='utf-8'))['signature']
                if (cfg['videos'].get(vid) or {}).get('signature') != sig:
                    ids.append(vid)
    replaced = []

    for vid in ids:
        if vid not in items:
            raise SystemExit(f'{vid} is not in course.json; nothing has been published.')
        for ext in ('mp4', 'pdf', 'json'):
            if not os.path.exists(os.path.join(VIDEOS, f'{vid}.{ext}')):
                raise SystemExit(f'Videos/{vid}.{ext} is missing; make the video first. Nothing has been published.')
        print(f'  {"UPDATE" if vid in cfg["videos"] else "NEW"}  {vid}')

    if apply and ids:
        if not cfg.get('mediaFolder'):
            cfg['mediaFolder'] = media_folder('Videos', WEB_APP_FOLDER)
            print(f'  MEDIA FOLDER Customizable, 3D Printable Keyguard > Web App > Videos (id {cfg["mediaFolder"]})')
        for vid in ids:
            item = items[vid]
            made = json.load(open(os.path.join(VIDEOS, f'{vid}.json'), encoding='utf-8'))
            base = safe_name(f'Keyguard Designer {item["num"]} {item["title"]}')
            video = upload(os.path.join(VIDEOS, f'{vid}.mp4'), base + '.mp4', 'video/mp4',
                           f'Keyguard Designer video {item["num"]}: {item["title"]}', cfg['mediaFolder'])
            guide = upload(os.path.join(VIDEOS, f'{vid}.pdf'), base + '-Guide.pdf', 'application/pdf',
                           f'Keyguard Designer video {item["num"]} guide: {item["title"]}', cfg['mediaFolder'])
            old = cfg['videos'].get(vid)
            if old:
                replaced += [old['video'], old['guide']]
            # Keep the watch page: it belongs to the video, not to this upload.
            cfg['videos'][vid] = {'signature': made['signature'], 'seconds': made['seconds'],
                                  'video': video, 'guide': guide, 'page': (old or {}).get('page')}
            save(cfg)                     # an upload is recorded the moment it exists
            print(f'  UPLOADED {video["url"]}')

    # The course map changes only when the list of published videos does.
    sig = course_map_signature(cfg, course)
    if (cfg.get('courseMap') or {}).get('signature') != sig and cfg['videos']:
        print(f'  The course map ({MAP_PDF}) will be uploaded.')
        if apply:
            if not os.path.exists(os.path.join(VIDEOS, MAP_PDF)):
                raise SystemExit(f'Videos/{MAP_PDF} is missing; run "sync videos".')
            up = upload(os.path.join(VIDEOS, MAP_PDF), 'Learning-the-Keyguard-Designer.pdf', 'application/pdf',
                        'Keyguard Designer: Learning the Keyguard Designer (the list of how-to videos)',
                        cfg['mediaFolder'])
            if cfg.get('courseMap'):
                replaced.append(cfg['courseMap'])
            cfg['courseMap'] = {'signature': sig, **up}
            save(cfg)

    pages = call('GET', f'/wp/v2/pages?slug={cfg["page"]}&status=publish,draft,private&context=edit')
    if not pages:
        print(f'  The page "{cfg["pageTitle"]}" does not exist yet; it will be made, public.')
        if not apply:
            return
        page = call('POST', '/wp/v2/pages', {'title': cfg['pageTitle'], 'slug': cfg['page'],
                                             'status': 'publish', 'content': build_page(cfg, course)})
        if page['link'] != LIST_URL:
            raise SystemExit(f'The videos page landed at {page["link"]}, not {LIST_URL}; the manual links '
                             'the latter. No watch pages have been made.')
        print(f'  PAGE MADE: {page["link"]}')
        pages = [call('GET', f'/wp/v2/pages/{page["id"]}?context=edit')]
    update_watch_pages(cfg, course, pages[0], apply)
    content = build_page(cfg, course)
    if pages[0]['content']['raw'].strip() == content.strip():
        print('  Videos page already up to date.')
    elif apply:
        call('POST', f'/wp/v2/pages/{pages[0]["id"]}', {'content': content})
        print(f'  PAGE UPDATED ({pages[0]["status"]}): {pages[0]["link"]}')
    else:
        print('  The videos page would be rewritten. Run with --apply.')

    if apply:
        save(cfg)
        for vid in ids:
            subprocess.run(['node', SYNC, '--published', vid], check=True, cwd=ROOT)
    for m in replaced:
        print(f'  OLD COPY LEFT IN MEDIA LIBRARY: id {m["id"]} {m["url"]}')


main()
