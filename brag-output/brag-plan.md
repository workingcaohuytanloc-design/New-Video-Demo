# Brag Plan: Ordex (30s vertical ad)

## What is this?
Ordex is an AI coding tool, fine-tuned for programming. It reads the codebase, plans, fixes the right spot, and uses fewer tokens. You hand it a ticket, get the result with a log, and can undo. The source material is the user's master prompt, six scene prompts, and the Vietnamese voiceover (`public/audio/voiceover.mp3`). There is no codebase to inspect.

## The angle
Two acts, one hard cut. Act 1 is what the voiceover describes: you're mid-ticket, Copilot runs out of credit, and each way out (buy more, wait for reset, switch tools) gets struck through in red. The hard cut lands on "Dùng ngay Ordex". Act 2 shows exactly what the voice claims, beat for beat: reads the codebase → plans → fixes the right spot → flat token cost → ticket in, log out, undo. The pictures stay text-free; the voice carries the copy.

## Hook (first 2–3 seconds)
"Đừng để công việc bị gián đoạn chỉ vì hết credit." over a dark editor typing itself in at a steady rhythm. The payoff of the hook is the freeze on "…báo hết credit" (≈5.0s): the red badge expands once, the bars stop mid-line, and progress stalls at 60%.

## Key moments
- One card per pain point. Each slides in as the voice names it, then gets a red strike: "xót tiền" / "gián đoạn" / "dán lại ngữ cảnh".
- The ribbon snaps apart exactly when the voice stops (11.6s). The break carries the silence until the cut.
- At the cut, the ribbon reconnects and the Ordex mark lands on "Ordex".
- The tree lights up on "đọc hiểu codebase", the plan panel opens on "lên kế hoạch", the three nodes highlight on "sửa đúng chỗ", and green diff bars flow.
- "tốn ít token hơn": the cost line stays flat while a ghost spike rises and fades.
- "Giao ticket" docks the ticket, "có log" ticks the list, and "hoàn tác" taps undo, which steps back exactly one row.

## Outro / punchline
End card under "Tải Ordex. Miễn phí ngay hôm nay.": the app icon (Ordex mark), a QR placeholder frame, and a pulsing pill button. The middle band is empty for headline and CTA text in post.

## User flow worth showing
Blocked ticket → Ordex reads the tree, plans, applies the diff → ticket done, logged, one-step undo.

## Tone
- Preset: `cinematic` (Act 1) → `app-store` (Act 2)
- Creative direction (user): clean tech aesthetic, flat vector UI, isometric code windows, smooth ease-in-out, no camera shake; Act 1 dark and tense, Act 2 bright and calm.
- Interpretation: Act 1 builds slowly with a push-in and desaturation, red only for blocked, a muffled bed and sparse dry hits. Act 2 uses clean slides, one-by-one reveals, a light consistent SFX layer and open music.

## Format: vertical — 1080x1920, 30fps
## Duration: 30s (user brief and voiceover length; overrides Brag's 15–25s window)

## Visual identity (from the brief)
- Background Act 1 `#0B0F14`, Act 2 `#F5F7FA`
- Accent `#2F6BFF` (only accent) · Blocked `#FF3B4A` (badge, strikes, break caps only) · Diff `#22C55E` (diff bars only)
- No fonts and no text in picture (brief rule)
- 12% safe margins → content inside x 130–950, y 230–1690

## Voiceover script (provided) and sync
| Speech (s) | Line | Picture |
|---|---|---|
| 0.00–2.24 | Đừng để công việc bị gián đoạn chỉ vì hết credit. | editor typing, push-in |
| 2.96–5.64 | Đang sửa dở cái ticket thì Copilot báo hết credit. | badge 4.87s, freeze 5.00s, desaturate |
| 6.22–9.67 | Mua thêm thì xót tiền, chờ reset thì flow làm việc bị gián đoạn, | card 1 in 6.0 / strike 7.0 · card 2 in 7.6 / strike 9.2 |
| 10.07–11.60 | đổi tool thì phải dán lại ngữ cảnh. | card 3 in 10.1 / strike 11.0 · ribbon snaps 11.6 |
| 12.84–13.77 | Dùng ngay Ordex. | **hard cut 12.83** · reconnect · mark 13.40 |
| 14.52–15.78 | Ordex đọc hiểu codebase, | tree nodes light up in sequence |
| 16.05–17.39 | tự lên kế hoạch rồi sửa đúng chỗ. | plan panel 16.13 · 3 nodes highlight 16.9 · diff flows |
| 18.16–22.41 | Hệ thống coding được fine-tune… tốn ít token hơn. | steps check 17.76 / 18.85 / 19.95 · cost meter · ghost spike 20.9 |
| 23.15–27.14 | Giao ticket, nhận kết quả, có log để theo dõi, dễ dàng hoàn tác | dock 23.22 · list ticks 24.3–25.4 · undo tap 26.5 |
| 28.62–29.52 | Tải Ordex. Miễn phí ngay hôm nay. | end card from 27.53 |

## Audio direction
- Role: cinematic support → warm bed under narration
- Music: `happy-beats-business-moves-vol-12-by-ende-dot-app.mp3` from the Brag library, starting at 0.29s so the track's strong cue at 12.55s lands on the hard cut
- Treatment: low-pass (≈380 Hz) through Act 1, filter thrown open at the cut. Ducked to 0.16 under speech and lifted to 0.32 in the two long pauses (11.6–12.8s into the cut, 27.1–28.6s into the end card). Fade out over the last 1.5s.
- Cue locks (`// beat-locked` in code): cut 12.83s, mark 13.40s, plan panel 16.13s, step checks 17.76 / 18.85 / 19.95s, ticket dock 23.22s, end card 27.53s
- Audio-reactive: subtle. Music RMS drives the blue glow behind the mark, the tree and the end-card button.
- SFX (Brag library, Kenney CC0): keyboard ticks, error buzz on the badge, soft thud on the freeze, card slides, dry hits on strikes, wood crack on the snap, soft impact on the cut, bell on the mark, clicks on checks and ticks, drop on dock, mouse click and switch on undo, bell on the end card
- Master: −14 LUFS integrated (social standard)

## Notes on the brief
- **The hard cut is at 12.83s**, on "Dùng ngay Ordex". That matches the master prompt's 13s act split. The per-scene prompt timings (0–4 / 4–10 / 10–13 / 13–22 / 22–27 / 27–30) were shifted to follow the voiceover. All timing lives in `src/timeline.ts` and the `*_AT` constants at the top of each scene.
- **Diff uses green only**, so red stays reserved for the blocked state (the master prompt asks for both).
- **The QR placeholder is an empty framed square**, with no code pattern (the negative prompt rules out QR codes).
- **The last voice line is very short.** "Tải Ordex. Miễn phí ngay hôm nay." occupies only ≈0.9s of audio (28.62–29.52s), which is fast for eight syllables. Check that the TTS file didn't clip the ending.
