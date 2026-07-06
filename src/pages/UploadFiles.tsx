import { useEffect, useMemo, useState } from "react";
import { C, STATUS_STYLE } from "../theme/tokens";
import { uploadsMock } from "../mock-data";
import { DataState } from "../components/DataState";

export default function UploadFiles() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");

  useEffect(() => {
    const id = window.setTimeout(() => {
      // Always data for now; toggle to "empty" later for testing.
      setVariant("data");
    }, 900);
    return () => window.clearTimeout(id);
  }, []);

  const headerStyle = useMemo(
    () => ({
      background: C.surfaceHi,
      border: `1px solid ${C.borderLo}`,
      borderRadius: 14,
      padding: "10px 12px",
    }),
    []
  );

  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>رفع الملفات</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>واجهة UI فقط — تحقق محلي باستخدام Mock data</div>
          </div>
          <div style={{ ...headerStyle, minWidth: 200, textAlign: "center" }}>
            <div style={{ color: C.textLo, fontSize: 12, fontWeight: 800 }}>حالة المدقق</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 22, marginTop: 6 }}>
              جارٍ المراجعة
            </div>
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <DataState variant={variant} loading={<div />}>
            <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
              <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>معاينة الملف</div>
              <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>
                يتم عرض الأعمدة كما هي — لا يوجد رفع حقيقي في هذه المرحلة.
              </div>

              <div style={{ marginTop: 12, overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                  <thead>
                    <tr>
                      {uploadsMock.previewColumns.map((c) => (
                        <th
                          key={c}
                          style={{
                            textAlign: "right",
                            padding: "10px 8px",
                            fontSize: 12,
                            color: C.textMid,
                            borderBottom: `1px solid ${C.borderLo}`,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {c}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {uploadsMock.rows.map((r, idx) => (
                      <tr key={idx}>
                        <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                          {r.name}
                        </td>
                        <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                          {r.id}
                        </td>
                        <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                          {r.dept}
                        </td>
                        <td style={{ padding: "10px 8px", borderBottom: `1px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>
                          {r.email}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div style={{ marginTop: 14, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
                <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                  <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>التحقق من البيانات</div>
                  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                    {uploadsMock.validation.map((v, i) => {
                      const isDup = v.kind.includes("مكرر");
                      const s = isDup ? STATUS_STYLE["at-risk"] : STATUS_STYLE["watch"];
                      return (
                        <div
                          key={i}
                          style={{
                            border: `1px solid ${C.borderLo}`,
                            background: s.bg,
                            borderRadius: 14,
                            padding: 10,
                          }}
                        >
                          <div style={{ color: s.text, fontWeight: 900, fontSize: 12 }}>{v.kind}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>
                            {v.message}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                  <div style={{ fontWeight: 900, color: C.textHi, fontSize: 13 }}>سجل الرفع</div>
                  <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                    {uploadsMock.history.map((h) => (
                      <div key={h.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                        <div>
                          <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>{h.fileName}</div>
                          <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{h.time}</div>
                        </div>
                        <div
                          style={{
                            border: `1px solid ${C.borderLo}`,
                            background: C.surface,
                            borderRadius: 999,
                            padding: "7px 10px",
                            fontWeight: 900,
                            color: C.textHi,
                            fontSize: 12,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {h.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </DataState>

          <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>
            ملاحظة: في هذه النسخة لا يوجد backend. يمكن تعديل state داخل الصفحة لتجربة variant = empty أو loading.
          </div>
        </div>
      </div>
    </div>
  );
}

