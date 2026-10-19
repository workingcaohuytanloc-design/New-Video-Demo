import React from "react";
import { Composition } from "remotion";
import { Ad } from "./Ad";
import { videoSchema } from "./schema";

// defaultProps mirror content.json. Edit text in the Studio Props panel (Save writes back here)
// or edit content.json and render with --props=./content.json.

export const Root: React.FC = () => (
  <Composition
    id="Ad"
    component={Ad}
    schema={videoSchema}
    durationInFrames={900}
    fps={30}
    width={1080}
    height={1920}
    defaultProps={{
      editor: {
        fileName: "checkout.ts",
        code: "import { createSession } from \"./session\";\nimport type { Cart } from \"./types\";\n\nexport async function checkout(cart: Cart) {\n  const session = await createSession(cart.userId);\n  if (!session.isValid()) {\n    await session.refresh();\n  }\n\n  const total = cart.items.reduce(\n    (sum, item) => sum + item.price * item.qty,\n    0,\n  );\n\n  // charge once, retry on network errors\n  const receipt = await session.charge(total, {\n    retries: 2,\n    idempotencyKey: cart.id,\n  });\n\n  return { receipt, total };\n}",
      },
      ticket: {
        key: "ORX-128",
        title: "Lỗi thanh toán khi phiên hết hạn",
        statusBefore: "TO DO",
        statusAfter: "DONE",
      },
      log: [
        {
          time: "10:42:01",
          text: "Đọc 14 file liên quan",
        },
        {
          time: "10:42:04",
          text: "Lập kế hoạch 3 bước",
        },
        {
          time: "10:42:09",
          text: "Sửa checkout/session.ts",
        },
        {
          time: "10:42:15",
          text: "Thêm test phiên hết hạn",
        },
        {
          time: "10:42:21",
          text: "Toàn bộ test đã qua",
        },
        {
          time: "10:42:24",
          text: "Mở pull request",
        },
      ],
      undoLabel: "Hoàn tác",
      counterLabel: "TOKEN",
      counterValue: 1284,
      cta: {
        button: "TẢI NGAY",
        link: "orthex.ai/download",
      },
      scenes: [
        {
          headline: ["ĐỪNG ĐỂ CÔNG VIỆC", "BỊ GIÁN ĐOẠN", "VÌ HẾT CREDIT"],
          badge: "HẾT CREDIT",
          items: [],
        },
        {
          headline: ["MẤT TIỀN", "FLOW GIÁN ĐOẠN", "ẢNH HƯỞNG THỜI GIAN"],
          badge: "",
          items: ["Mua thêm credit", "Chờ reset", "Đổi tool"],
        },
        {
          headline: ["ORTHEX"],
          badge: "SMART AI WORKSPACE",
          items: [],
        },
        {
          headline: ["ĐỌC HIỂU CODEBASE", "SỬA ĐÚNG CHỖ", "TỐN ÍT TOKEN"],
          badge: "fine-tuned for coding",
          items: ["Đọc luồng thanh toán", "Sửa kiểm tra phiên", "Chạy lại toàn bộ test"],
        },
        {
          headline: ["GIAO TICKET", "KẾT QUẢ", "CÓ LOG ĐỂ THEO DÕI"],
          badge: "",
          items: [],
        },
        {
          headline: ["TẢI ORTHEX"],
          badge: "MIỄN PHÍ NGAY HÔM NAY",
          items: [],
        },
      ],
    }}
  />
);
