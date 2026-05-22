<div align="center">

![Banner](https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=160&section=header&text=TOONHUB&fontSize=48&fontColor=fff&animation=twinkling&fontAlignY=40)

Interactive hero demo showcasing collectible figurines.

## Overview

TOONHUB is a single-page demo (`index.html`) that renders a full-screen animated hero with a layered figurine carousel. Click the center character to trigger a short "discover" animation; a small download UI will appear allowing you to save the current character's PNG to your device.

## Features

- Full-screen animated hero with custom cursor and grain overlay.
- 3D-like layered carousel with keyboard, wheel, touch, and button navigation.
- Click the centered character to run the discover effect and reveal a small preview + `Download Toon` button.
- Download uses `fetch` -> `Blob` to save the PNG; falls back to opening the image in a new tab if CORS prevents direct download.


## How to use

1. Open the page and use the Prev/Next buttons, arrow keys, mouse wheel, or swipe to navigate.
2. Click the center character to run the flash/zoom animation.
3. The download UI (preview + `Download Toon` button) appears; click it to save the PNG.
4. If the download is blocked due to CORS, the image will open in a new tab where you can right-click → Save image as...

## Files

- `index.html` — main page (interactive hero + carousel + download logic).
- Local image files referenced in the `IMAGES` array . Ensure these files exist in the same folder if you expect them to load locally.


*Made with 🏀 and high-performance code.*


