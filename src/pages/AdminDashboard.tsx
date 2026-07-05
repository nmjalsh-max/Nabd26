import { C } from "../theme/tokens";
import { adminOverview } from "../mock-data";

export default function AdminDashboard() {
  return (
    <div style={{ minHeight: "100vh", background: C.bg, color: C.textHi, padding: 20 }}>
      <div style={{ maxWidth: 1040, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 900, fontSize: 22 }}>لوحة الأدمن</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6 }}>Non-stigmatizing UI — “يحتاج تواصل” بدل “خطر”</div>
          </div>
          <div style={{ width: 160, borderRadius: 16, border: `1px solid ${C.border}`, background: C.surface, padding: 10, color: C.textMid, fontSize: 12, textAlign: "center" }}>
            إجمالي: {adminOverview.totalEmployees}
          </div>
        </div>

        <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 14 }}>
          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>نظرة عامة</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "repeat(2, minmax(0,1fr))", gap: 12 }}>
              <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                <div style={{ color: C.textLo, fontSize: 12 }}>حالات تحتاج تواصل</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 28, marginTop: 6 }}>{adminOverview.criticalCount}</div>
              </div>
              <div style={{ background: C.surfaceHi, border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12 }}>
                <div style={{ color: C.textLo, fontSize: 12 }}>مشاركون اليوم (Mock)</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontWeight: 900, fontSize: 28, marginTop: 6 }}>126 / 240</div>
              </div>
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>حالات تحتاج متابعة</div>
            <div style={{ color: C.textLo, fontSize: 12, marginTop: 6, lineHeight: 1.7 }}>
              إظهار أسماء الموظفين مخفي افتراضيًا. سيتم إظهار التفاصيل فقط عند فتح عنصر محدد.
            </div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {[1, 2, 3].map((i) => (
                <div key={i} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                    <div>
                      <div style={{ color: C.textMid, fontWeight: 900, fontSize: 12 }}>يحتاج تواصل</div>
                      <div style={{ color: C.textLo, fontSize: 12, marginTop: 5 }}>اسم الموظف مخفي</div>
                    </div>
                    <button type="button" style={{ border: `1px solid ${C.border}`, background: "transparent", borderRadius: 999, padding: "7px 10px", color: C.lavSoft, fontWeight: 900, fontSize: 12 }}>
                      فتح التفاصيل
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 18, padding: 16 }}>
            <div style={{ fontWeight: 900, color: C.textHi, fontSize: 14 }}>روابط سريعة</div>
            <div style={{ marginTop: 12, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
              {["رفع الملفات", "التقارير", "التحليل والرصد"].map((x) => (
                <div key={x} style={{ border: `1px solid ${C.borderLo}`, borderRadius: 16, padding: 12, background: C.surfaceHi, color: C.textMid, fontWeight: 900, fontSize: 13 }}>
                  {x} (قريبًا)
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

