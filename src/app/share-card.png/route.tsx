import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

import { DEFAULT_SHARE_IMAGE, SITE_URL } from "@/core/config/site";

// Default link-preview card for pages without their own image. A plain route (not the
// `opengraph-image` file convention) so product and story pages can set their own photo.
export const dynamic = "force-static";

export async function GET() {
  const logo = await readFile(join(process.cwd(), "public", "brand-logo.png"), "base64");
  const host = SITE_URL.replace(/^https?:\/\//, "");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#0B0B0B",
          backgroundImage:
            "radial-gradient(circle at 50% 38%, rgba(214,165,72,0.28), rgba(11,11,11,0) 58%)",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- rendered by next/og, not the browser */}
        <img src={`data:image/png;base64,${logo}`} width={560} height={416} alt="" />
        <div
          style={{
            marginTop: 28,
            display: "flex",
            alignItems: "center",
            gap: 18,
            color: "#C6B89A",
            fontSize: 26,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          <div style={{ width: 64, height: 2, backgroundColor: "#D6A548" }} />
          Premium tactical streetwear
          <div style={{ width: 64, height: 2, backgroundColor: "#D6A548" }} />
        </div>
        <div style={{ marginTop: 14, color: "#8C8474", fontSize: 22, letterSpacing: 4 }}>{host}</div>
      </div>
    ),
    { width: DEFAULT_SHARE_IMAGE.width, height: DEFAULT_SHARE_IMAGE.height },
  );
}
