# Birthday Website — CLAUDE.md

## Live URL
https://yamkush.github.io/ela-yam-birthday/

## Project Summary
A birthday party invitation website for Ella & Yam. Built as a static site hosted on GitHub Pages.

## Pages
| File | Description |
|------|-------------|
| `index.html` | Landing page — main birthday invite with countdown, pixel art avatars (ELLA + YAM), all details. Click an avatar to go to game. |
| `game.html` | Interactive game — ELLA asks Yam "want to make a birthday together?", click YAM to trigger confetti + "Let's Do This Shit!", then "To Be Continued..." overlay redirects back to index. |
| `flier.html` | Downloadable JPEG flier — all party info in a phone-sized poster. Has a "Download JPEG" button. |

## Config
All text content is controlled from one file: `config.js`

```js
title        // green — "יום הולדת"
subtitle     // yellow — "מסיבת חצר"
dateText     // red — "2.5.2026"
bottomText   // purple — "איפה? מושב עופר"
timeText     // blue — "12:00-24:00"
countdownDate // used for the live countdown timer
topEmojis / bottomEmojis
avatarSrc    // ELLA's pixel art SVG
yamAvatarSrc // YAM's pixel art SVG
pageTitle    // browser tab title
```

## Assets
| File | Description |
|------|-------------|
| `avatar.svg` | ELLA pixel art emoji (hand-drawn SVG) |
| `yam-avatar.svg` | YAM pixel art emoji (hand-drawn SVG) |
| `Ela pixel art.png` | Ella's pixel art photo portrait (used in game.html) |
| `Yam pixel art.png` | Yam's pixel art photo portrait (used in game.html) |
| `music.js` | Web Audio API chiptune music — Final Fantasy inspired, C-Am-F-G progression, 110 BPM. Toggle with the 🔇 button top-left. |
| `config.js` | All editable text content |

## Characters
- **ELLA** — the pixel art avatar character. When user says "ELLA", they mean the SVG avatar in `avatar.svg`.
- **YAM** — the pixel art avatar in `yam-avatar.svg`.

## Deploy
```bash
cd birthday/
git add -A && git commit -m "message" && git push
```
GitHub Actions deploys automatically on every push to `main`.

## Local Preview
The preview server runs from the `birthday/` directory root.
- index: `/index.html`
- game: `/game.html`
- flier: `/flier.html`
