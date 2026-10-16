"""Serve the Keyguard Designer folder locally, always fresh.

Run by serve.bat (and by the preview server). The same as
`python -m http.server`, with two differences, both so that what the browser
shows is ALWAYS the app.html on disk right now:

  * Every answer says "do not keep a copy" (Cache-Control: no-store). Plain
    http.server says nothing about caching, so the browser is free to reuse a
    copy it fetched earlier for a while - and a tab opened fresh by serve.bat
    could show yesterday's app while the file on disk had moved on.

  * A port that is already taken is refused, loudly. On Windows, plain
    http.server will quietly start a SECOND server on a port another one is
    still holding, and the browser then reaches whichever Windows picks -
    possibly an old window serving another folder entirely (the retired
    keyguard-designer-web sits right next door and uses the same port).

It also opens the app in the browser itself, and only once it is really
serving - so a browser tab never opens onto some other server that happened
to be holding the port.

Usage: python scripts/serve.py [port] [--open]      (default port 8000)
"""
import functools
import http.server
import os
import socket
import sys
import threading
import webbrowser

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


class NoStoreHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()


class ExclusiveServer(http.server.ThreadingHTTPServer):
    # Listens on IPv6 and IPv4 at once, as plain http.server does, so
    # "localhost" answers straight away whichever of the two the browser tries.
    address_family = socket.AF_INET6
    allow_reuse_address = False

    def server_bind(self):
        if hasattr(socket, 'SO_EXCLUSIVEADDRUSE'):      # Windows
            self.socket.setsockopt(socket.SOL_SOCKET, socket.SO_EXCLUSIVEADDRUSE, 1)
        self.socket.setsockopt(socket.IPPROTO_IPV6, socket.IPV6_V6ONLY, 0)
        super().server_bind()


def main():
    args = [a for a in sys.argv[1:] if a != '--open']
    port = int(args[0]) if args else 8000
    handler = functools.partial(NoStoreHandler, directory=ROOT)
    try:
        server = ExclusiveServer(('::', port), handler)
    except OSError:
        print(f'\nPort {port} is already in use - another server window is still open.')
        print('Close every other server window (they may be serving an older copy,')
        print('or a different folder), then run this again.\n')
        try:
            input('Press Enter to close this window.')   # keep the message on screen
        except EOFError:
            pass
        sys.exit(1)
    print(f'Serving {ROOT}')
    url = f'http://localhost:{port}/app.html'
    print(f'Open {url} - close this window to stop.')
    if '--open' in sys.argv:
        threading.Timer(0.3, webbrowser.open, [url]).start()
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass


if __name__ == '__main__':
    main()
