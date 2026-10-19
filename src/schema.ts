import { z } from "zod";

// Every piece of text on screen lives here (Props panel in Remotion Studio, or content.json).
// Structure stays fixed; only the wording is meant to be edited.

const scene = z.object({
  headline: z
    .array(z.string().describe("Một dòng tiêu đề (nên 3–5 chữ)"))
    .describe("Tiêu đề của cảnh, mỗi phần tử là một dòng, hiện lần lượt theo lời đọc"),
  badge: z.string().describe("Nhãn phụ của cảnh (huy hiệu, chip); để trống nếu cảnh không dùng"),
  items: z.array(z.string().describe("Nội dung một mục")).describe("Danh sách mục của cảnh (thẻ, bước kế hoạch...)"),
});

export const videoSchema = z.object({
  editor: z.object({
    fileName: z.string().describe("Tên file trên tab của trình soạn thảo"),
    code: z.string().describe("Đoạn code chạy trong trình soạn thảo (mỗi dòng một dòng code)"),
  }).describe("Trình soạn thảo ở cảnh 1"),
  ticket: z.object({
    key: z.string().describe("Mã ticket (ví dụ ORX-128)"),
    title: z.string().describe("Tiêu đề ticket"),
    statusBefore: z.string().describe("Trạng thái trước khi giao"),
    statusAfter: z.string().describe("Trạng thái khi đã xong"),
  }).describe("Ticket Jira ở cảnh 5"),
  log: z
    .array(
      z.object({
        time: z.string().describe("Mốc thời gian"),
        text: z.string().describe("Nội dung dòng log"),
      }),
    )
    .describe("Các dòng log ở cảnh 5 (dòng cuối là dòng bị hoàn tác)"),
  undoLabel: z.string().describe("Nhãn nút hoàn tác"),
  counterLabel: z.string().describe("Nhãn bộ đếm token ở cảnh 4"),
  counterValue: z.number().describe("Số token bộ đếm dừng lại"),
  cta: z.object({
    button: z.string().describe("Chữ trên nút kêu gọi"),
    link: z.string().describe("Link tải về hiển thị dưới nút"),
  }).describe("Nút và link ở cảnh cuối"),
  scenes: z
    .array(scene)
    .describe(
      "Chữ theo từng cảnh. 1: tiêu đề + huy hiệu. 2: tiêu đề + 3 thẻ. 3: wordmark (dòng 1) + câu định vị (nhãn phụ). 4: tiêu đề + chip + 3 bước. 5: tiêu đề. 6: tiêu đề + dòng phụ (nhãn phụ)",
    ),
});

export type VideoProps = z.infer<typeof videoSchema>;
export type SceneText = z.infer<typeof scene>;
