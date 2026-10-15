import { Composition } from "remotion";
import { showreelSchema } from "./schema";
import { Showreel } from "./Showreel";

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="OrthexShowreel"
      component={Showreel}
      schema={showreelSchema}
      width={1920}
      height={1080}
      fps={30}
      durationInFrames={450}
      defaultProps={{
        brand: "ORTHEX",
        hudLeft: "SHOWREEL '26",
        hudRight: "MOTION DESIGN — MADE IN CODE",
        cta: "Let's make it move",
        url: "orthexgroup.com",
        colors: {
          ink: "#0E1116",
          paper: "#F4EFE6",
          accent: "#FF4F2E",
          accent2: "#2D5BFF",
        },
        scenes: [
          {
            kicker: "Motion Showreel 2026",
            title: "ORTHEX",
            subtitle: "Practical motion for a practical brand",
            items: [],
          },
          {
            kicker: "Brand manifesto",
            title: "Nordic design since 1956",
            subtitle: "Practical is beautiful",
            items: ["PRACTICAL", "IS", "BEAUTIFUL."],
          },
          {
            kicker: "01 — Storage",
            title: "SmartStore",
            subtitle: "Designed to stack. Animated to land.",
            items: ["Stack", "Store", "Repeat"],
          },
          {
            kicker: "02 — Brands",
            title: "Four brands. One Nordic idea.",
            subtitle: "Home, kitchen and garden — made to last.",
            items: ["Orthex", "SmartStore", "GastroMax", "Kökskungen"],
          },
          {
            kicker: "03 — Since",
            title: "1956",
            subtitle: "Founded in Finland. Every frame written in React.",
            items: [
              "<Orthex since={1956}>",
              "  <SmartStore stack clear />",
              '  <GastroMax heat="high" />',
              "  <Kökskungen />",
              "</Orthex>",
            ],
          },
          {
            kicker: "Thanks for watching",
            title: "Practical is beautiful.",
            subtitle: "",
            items: [],
          },
        ],
      }}
    />
  );
};
