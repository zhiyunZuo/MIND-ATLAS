@echo off
chcp 65001 >nul
cd /d "%~dp0"
set PY=
if exist "C:\Users\12691\.workbuddy\binaries\python\versions\3.13.12\python.exe" (
  set PY="C:\Users\12691\.workbuddy\binaries\python\versions\3.13.12\python.exe"
)
if not defined PY set PY=python
echo 正在启动 MIND ATLAS 本地服务器 (http://127.0.0.1:8123) ...
start "" "http://127.0.0.1:8123/"
%PY% -m http.server 8123 --bind 127.0.0.1
