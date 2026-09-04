import { useEffect, useMemo, useState } from "react";
import { useTheme } from "../theme/ThemeContext";
import { DataState } from "../components/DataState";
import { SectionCard, StatusPill, PageHeader, PageShell } from "../components/AdminUI";
import { employeesHR } from "../mock-data/hr";
import { useLang } from "../i18n/LangContext";

type Tone = "green" | "amber" | "red" | "lavender" | "gray";

function toneForStatus(status: string): Tone {
  if (status === "stable") return "green";
  if (status === "watch") return "amber";
  return "red";
}

export default function Employees() {
  const { theme: C } = useTheme();
  const { lang } = useLang();
  const isEn = lang === "en";
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [query, setQuery] = useState<string>("");

  useEffect(() => {
    const id = window.setTimeout(() => setVariant("data"), 600);
    return () => window.clearTimeout(id);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return employeesHR;
    return employeesHR.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        e.department.toLowerCase().includes(q) ||
        e.role.toLowerCase().includes(q)
    );
  }, [query]);

  const tableHeaders = isEn
    ? ["Employee", "Email", "Department", "Role", "Joined", "Mood", "Absence", "Status"]
    : ["الموظف", "البريد", "القسم", "المسمى", "الانضمام", "المزاج", "الغياب", "الحالة"];

  return (
    <PageShell>
      <PageHeader
        title={isEn ? "Employee Directory" : "دليل الموظفين"}
        description={isEn ? "Employee records combined with wellbeing score and absence days" : "بيانات الموظفين مُدمجة مع درجة الرفاهية النفسية وأيام الغياب"}
        actions={
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={isEn ? "Search by name / department / role..." : "ابحث بالاسم / القسم / المسمى..."}
            style={{
              background: C.surface,
              border: `0.5px solid ${C.border}`,
              borderRadius: 999,
              padding: "9px 14px",
              color: C.textHi,
              fontSize: 12,
              minWidth: 240,
              outline: "none",
            }}
          />
        }
      />

      <DataState variant={variant} loading={<div style={{ color: C.textLo, fontSize: 12 }}>{isEn ? "Loading employees…" : "جارٍ تحميل الموظفين…"}</div>}>
        <SectionCard
          title={isEn ? `Employees (${filtered.length})` : `الموظفون (${filtered.length})`}
          description={isEn ? "Each row combines the employee profile with a wellbeing and absence indicator" : "كل صف يجمع ملف الموظف مع مؤشر الرفاهية والغياب"}
        >
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 720 }} dir={isEn ? "ltr" : "rtl"}>
              <thead>
                <tr>
                  {tableHeaders.map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: isEn ? "left" : "right",
                        padding: "10px 8px",
                        fontSize: 12,
                        color: C.textMid,
                        borderBottom: `0.5px solid ${C.borderLo}`,
                        whiteSpace: "nowrap",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((e) => (
                  <tr key={e.id}>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13, fontWeight: 700 }}>{e.name}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textLo, fontSize: 12 }}>{e.email}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.department}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.role}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textLo, fontSize: 12 }}>{e.joinDate}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.avgMood.toFixed(1)}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{e.absenceDays}</td>
                    <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, fontSize: 12 }}>
                      <StatusPill tone={toneForStatus(e.status)}>{e.status}</StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </SectionCard>
      </DataState>
    </PageShell>
  );
}

