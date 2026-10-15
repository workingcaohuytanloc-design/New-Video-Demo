import { zColor } from "@remotion/zod-types";
import { z } from "zod";

export const sceneSchema = z.object({
  kicker: z.string().describe("Nhan nho phia tren tieu de"),
  title: z.string().describe("Tieu de canh"),
  subtitle: z.string().describe("Mo ta ngan duoi tieu de"),
  items: z
    .array(z.string())
    .describe(
      "Danh sach muc cua canh (tu khoa, checklist, mat khoi 3D, dong code)",
    ),
});

export const showreelSchema = z.object({
  brand: z.string().describe("Ten thuong hieu"),
  hudLeft: z.string().describe("Nhan HUD goc tren trai"),
  hudRight: z.string().describe("Nhan HUD goc duoi trai"),
  cta: z.string().describe("Noi dung nut keu goi hanh dong"),
  url: z.string().describe("Website hien o canh cuoi"),
  colors: z
    .object({
      ink: zColor().describe("Mau nen toi"),
      paper: zColor().describe("Mau nen sang / chu"),
      accent: zColor().describe("Mau nhan chinh"),
      accent2: zColor().describe("Mau nhan phu"),
    })
    .describe("Bang mau thuong hieu"),
  scenes: z
    .array(sceneSchema)
    .describe(
      "Danh sach 6 canh: Intro, Tuyen ngon, SmartStore, Thuong hieu 3D, Code, Ket",
    ),
});

export type Scene = z.infer<typeof sceneSchema>;
export type ShowreelProps = z.infer<typeof showreelSchema>;
