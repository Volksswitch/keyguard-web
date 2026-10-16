@echo off
REM Serve this folder so the Keyguard Designer can be opened in Chrome or Edge.
REM A plain file:// URL will not do: the folder picker, the openings-and-additions
REM auto-watch, saving presets in place and stored settings all need a real
REM address. Close this window to stop the server.
REM
REM scripts\serve.py rather than plain "python -m http.server": it tells the
REM browser never to keep a copy, so every load is the app.html on disk now;
REM it refuses to start if another server window already holds the port; and
REM it opens the browser itself, only once it is really serving.
cd /d "%~dp0"
python scripts\serve.py 8000 --open
