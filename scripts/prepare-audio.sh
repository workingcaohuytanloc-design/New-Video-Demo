#!/usr/bin/env bash
# Builds the audio assets the composition uses, from the /brag skill's bundled library.
#   BRAG_SKILL_DIR=/path/to/brag/skills/brag npm run audio
# Outputs: public/audio/music-stem.m4a, public/sfx/**, src/music-rms.json
set -euo pipefail

SKILL_DIR="${BRAG_SKILL_DIR:-/home/user/latent-spaces/brag/skills/brag}"
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TRACK="$SKILL_DIR/assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3"

# Keep in sync with src/timeline.ts
MUSIC_OFFSET=0.29 # track strong cue 12.55s lands on the hard cut
CUT_AT=12.8333 # frame 385
DURATION=30

mkdir -p "$ROOT/public/audio" "$ROOT/public/sfx"

SFX=(
  keyboard/keypress-003.wav keyboard/keypress-007.wav keyboard/keypress-012.wav
  keyboard/keypress-018.wav keyboard/keypress-024.wav keyboard/keypress-029.wav
  interface/error_005.ogg interface/drop_001.ogg
  interface/click_002.ogg interface/click_003.ogg interface/switch_002.ogg
  impact/impactSoft_medium_001.ogg impact/impactSoft_medium_002.ogg
  impact/impactSoft_heavy_003.ogg impact/impactWood_medium_003.ogg
  impact/impactBell_heavy_000.ogg impact/impactBell_heavy_003.ogg
  casino/card-slide-1.ogg ui/click2.ogg ui/rollover2.ogg ui/mouseclick1.ogg
)
for f in "${SFX[@]}"; do
  mkdir -p "$ROOT/public/sfx/$(dirname "$f")"
  cp "$SKILL_DIR/assets/sfx/$f" "$ROOT/public/sfx/$f"
done

# Act 1: muffled bed (low-pass). Act 2: filter thrown open at the cut (20ms ramp, no click).
# Fade out over the last 1.5s.
ffmpeg -hide_banner -loglevel error -y -i "$TRACK" -filter_complex "
  [0:a]adelay=delays=$(echo "$MUSIC_OFFSET*1000" | bc | cut -d. -f1):all=1,atrim=0:$DURATION,asplit=2[x][y];
  [x]lowpass=f=380,lowpass=f=380,volume=1.6,volume='clip(($CUT_AT+0.02-t)/0.02,0,1)':eval=frame[a];
  [y]volume='clip((t-$CUT_AT)/0.02,0,1)':eval=frame[b];
  [a][b]amix=inputs=2:normalize=0,afade=t=out:st=$(echo "$DURATION-1.5" | bc):d=1.5[out]" \
  -map "[out]" -ar 48000 -c:a aac -b:a 256k "$ROOT/public/audio/music-stem.m4a"

# Per-frame RMS (30fps), normalised 0..1, for subtle audio-reactive glow.
ffmpeg -hide_banner -loglevel error -i "$ROOT/public/audio/music-stem.m4a" -ac 1 -ar 48000 -f s16le - |
  python3 -c "
import sys, array, math, json
data = array.array('h', sys.stdin.buffer.read())
step = 48000 // 30
rms = [math.sqrt(sum(s*s for s in data[i:i+step]) / max(1, len(data[i:i+step]))) for i in range(0, len(data), step)]
peak = max(rms) or 1
json.dump([round(r / peak, 3) for r in rms], open('$ROOT/src/music-rms.json', 'w'))
"
echo "audio ready"
