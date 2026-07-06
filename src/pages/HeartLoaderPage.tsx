import { useEffect, useState } from "react";
import { C } from "../theme/tokens";
import { HeartLoader } from "../components/HeartLoader";
import { DataState } from "../components/DataState";

export default function HeartLoaderPage() {
  const [variant, setVariant] = useState<"loading" | "data">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 2200);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>Heart Loader</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>صفحة اختبار للحالة Loading</div>
          </div>
          <div style={{ width: 220, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 12, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>الحالة</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, color: C.textMid, fontSize: 14, marginTop: 6 }}>
              {variant === "loading" ? "Loading" : "Done"}
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16 }}>
          <DataState
            variant={variant === "loading" ? "loading" : "data"}
            loading={<div />}
          >
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>تم</div>
              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
                هذه الصفحة فقط لتجربة Loader وتأكد أنه لا يسبب مشاكل مع التخطيط.
              </div>
            </div>
          </DataState>

          {variant === "loading" && (
            <div style={{ marginTop: 18 }}>
              <HeartLoader label="Measuring…" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

