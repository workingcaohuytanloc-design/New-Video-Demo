// Single source of timing. Seconds → frames at 30fps.
// The edit follows the voiceover; music runs from MUSIC_OFFSET so the track's
// strong cue at 12.55s lands on the hard cut. Keep MUSIC_OFFSET / CUT in sync
// with scripts/prepare-audio.sh.

export const FPS = 30;
export const WIDTH = 1080;
export const HEIGHT = 1920;
export const DURATION_S = 30;
export const DURATION = DURATION_S * FPS;

export const MUSIC_OFFSET_S = 0.29;
export const CUT = 385; // beat-locked: 12.83s, "Dùng ngay Ordex" starts 12.84s

export const f = (seconds: number) => Math.round(seconds * FPS);

// [from, duration] in frames. Neighbouring scenes overlap for soft handoffs,
// except blocked → reconnect, which is the hard cut.
export const SCENES = {
  stall: [0, f(6.2)],
  blocked: [f(5.9), CUT - f(5.9)],
  reconnect: [CUT, 54],
  plan: [f(14.3), 258],
  ticket: [f(22.3), 157],
  endCard: [826, DURATION - 826], // beat-locked: 27.53s (track strong cue 27.30s)
} as const;

// Voiceover speech, from silence detection on public/audio/voiceover.mp3 (seconds).
export const VO_SPEECH: [number, number][] = [
  [0.0, 2.24], // Đừng để công việc bị gián đoạn chỉ vì hết credit.
  [2.96, 5.64], // Đang sửa dở cái ticket thì Copilot báo hết credit.
  [6.22, 9.67], // Mua thêm thì xót tiền, chờ reset thì flow làm việc bị gián đoạn,
  [10.07, 11.6], // đổi tool thì phải dán lại ngữ cảnh.
  [12.84, 13.77], // Dùng ngay Ordex.
  [14.52, 15.78], // Ordex đọc hiểu codebase,
  [16.05, 17.39], // tự lên kế hoạch rồi sửa đúng chỗ.
  [18.16, 22.41], // Hệ thống coding được fine-tune riêng ... tốn ít token hơn.
  [23.15, 27.14], // Giao ticket, nhận kết quả, có log để theo dõi, dễ dàng hoàn tác
  [28.62, 29.52], // Tải Ordex. Miễn phí ngay hôm nay.
];

// Safe area: 12% margins.
export const SAFE = {
  left: Math.round(WIDTH * 0.12),
  right: WIDTH - Math.round(WIDTH * 0.12),
  top: Math.round(HEIGHT * 0.12),
  bottom: HEIGHT - Math.round(HEIGHT * 0.12),
};
