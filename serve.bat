@echo off
REM Serve this folder so the Keyguard Designer can be opened in Chrome or Edge.
REM A plain file:// URL will not do: the folder picker, the openings-and-additions
REM auto-watch, saving presets in place and stored settings all need a real
REM address. Close this window to stop the server.
cd /d "%~dp0"
start "" http://localhost:8000/app.html
python -m http.server 8000
