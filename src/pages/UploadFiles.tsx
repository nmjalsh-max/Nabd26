import { useEffect, useState } from "react";
import { C, STATUS_STYLE } from "../theme/tokens";
import { DataState } from "../components/DataState";
import { getSupabaseClient } from "../lib/supabaseClient";
import { PageHeader, PageShell, SectionCard, StatCard } from "../components/AdminUI";

type PreviewRow = {
  name: string;
  id: string;
  dept: string;
  email: string;
};

type ValidationItem = {
  kind: string;
  message: string;
};

type HistoryItem = {
  id: number;
  fileName: string;
  time: string;
  status: string;
};

const STORAGE_BUCKET = "employee-uploads";

function splitCsvLine(line: string) {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current.trim());
  return cells.map((cell) => cell.replace(/^"|"$/g, ""));
}

function parseCsvText(text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (!lines.length) return [] as string[][];
  return lines.map((line) => splitCsvLine(line));
}

function normalizeHeader(value: string) {
  return value.toLowerCase().replace(/[^a-z]/g, "");
}

function buildPreviewRows(rows: string[][]): PreviewRow[] {
  if (rows.length < 2) return [];

  const headers = rows[0].map(normalizeHeader);
  const indexByHeader = {
    name: headers.findIndex((header) => ["name", "fullname", "employeename", "employee"].includes(header)),
    id: headers.findIndex((header) => ["id", "employeenumber", "employeeid", "empid"].includes(header)),
    dept: headers.findIndex((header) => ["department", "dept", "team", "division"].includes(header)),
    email: headers.findIndex((header) => ["email", "mail"].includes(header)),
  };

  return rows.slice(1).map((row) => ({
    name: row[indexByHeader.name] ?? "",
    id: row[indexByHeader.id] ?? "",
    dept: row[indexByHeader.dept] ?? "",
    email: row[indexByHeader.email] ?? "",
  }));
}

function buildValidation(rows: PreviewRow[]): ValidationItem[] {
  const validations: ValidationItem[] = [];
  const emailMap = new Map<string, number>();

  rows.forEach((row, index) => {
    if (!row.name || !row.id || !row.dept || !row.email) {
      validations.push({
        kind: "تحتاج مراجعة",
        message: `السطر ${index + 2} يفتقد أحد الحقول الأساسية مثل الاسم أو الرقم أو القسم أو البريد.`,
      });
    }

    if (row.email) {
      const count = emailMap.get(row.email) ?? 0;
      emailMap.set(row.email, count + 1);
    }
  });

  const duplicates = [...emailMap.entries()].filter(([, count]) => count > 1);
  if (duplicates.length) {
    validations.push({
      kind: "مكرر",
      message: `تم اكتشاف ${duplicates.length} بريدًا مكررًا في الملف، يُنصح بالتحقق قبل الحفظ.`,
    });
  }

  if (!validations.length) {
    validations.push({
      kind: "جاهز",
      message: "لا توجد مشكلات تم اكتشافها في المعاينة الحالية.",
    });
  }

  return validations;
}

function looksLikeUuid(value: string) {
  return /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/.test(value);
}

export default function UploadFiles() {
  const [variant, setVariant] = useState<"loading" | "data" | "empty">("loading");
  const [rows, setRows] = useState<PreviewRow[]>([]);
  const [validation, setValidation] = useState<ValidationItem[]>([]);
  const [history, setHistory] = useState<HistoryItem[]>([
    { id: 1, fileName: "employees_2026.csv", time: "منذ 3 دقائق", status: "مكتمل" },
    { id: 2, fileName: "staff_sync.xlsx", time: "منذ 25 دقيقة", status: "مراجع" },
  ]);
  const [statusMessage, setStatusMessage] = useState("جارٍ المراجعة");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => {
      setVariant("data");
    }, 700);
    return () => window.clearTimeout(id);
  }, []);

  async function handleFileChange(file: File) {
    setVariant("loading");
    setUploading(true);
    setStatusMessage("جارٍ قراءة الملف");

    const lowerName = file.name.toLowerCase();

    try {
      if (!lowerName.endsWith(".csv")) {
        setRows([]);
        setValidation([
          {
            kind: "تنبيه",
            message: "تم استلام ملف غير CSV. المعاينة الحالية تدعم CSV فقط، ويمكن رفع الملف إلى Supabase Storage عند توفر إعدادات الـ bucket.",
          },
        ]);
        setStatusMessage("تمت معاينة الملف محليًا");
        setVariant("data");
        setUploading(false);
        return;
      }

      const text = await file.text();
      const parsedRows = parseCsvText(text);
      const previewRows = buildPreviewRows(parsedRows);
      const nextValidation = buildValidation(previewRows);

      setRows(previewRows);
      setValidation(nextValidation);
      setStatusMessage("جاهز للرفع أو المراجعة");
      setVariant(previewRows.length ? "data" : "empty");

      const client = getSupabaseClient();
      if (client) {
        const path = `${Date.now()}_${file.name}`;
        const { error } = await client.storage.from(STORAGE_BUCKET).upload(path, file, {
          upsert: false,
          contentType: file.type || "text/csv",
        });

        if (error) {
          setStatusMessage(error.message);
        } else {
          setStatusMessage("تم رفع الملف إلى Supabase Storage");

          const { data: authData } = await client.auth.getUser();
          const uploaderId = authData.user?.id ?? null;
          const userPayload = previewRows
            .filter((row) => looksLikeUuid(row.id))
            .map((row) => ({
              id: row.id,
              full_name: row.name,
              email: row.email,
              role: "employee" as const,
              department: row.dept,
              employee_number: row.id,
            }));

          if (uploaderId && userPayload.length) {
            await client.from("users").upsert(userPayload, { onConflict: "id" });
          }

          if (uploaderId) {
            await client.from("employee_uploads").insert([
              {
                uploader_id: uploaderId,
                storage_path: path,
                original_file_name: file.name,
                mime_type: file.type || "text/csv",
                row_count: previewRows.length,
                status: "completed",
                summary: { previewRows: previewRows.length, validationCount: validation.length },
              },
            ]);
          }

          setHistory((current) => [
            {
              id: Date.now(),
              fileName: file.name,
              time: new Date().toLocaleTimeString("ar-SA"),
              status: "مرفوع",
            },
            ...current,
          ]);
        }
      }
    } catch {
      setRows([]);
      setValidation([
        {
          kind: "خطأ",
          message: "تعذر قراءة الملف. تأكد من صيغة CSV الصحيحة ثم حاول مرة أخرى.",
        },
      ]);
      setStatusMessage("فشل في قراءة الملف");
      setVariant("empty");
    } finally {
      setUploading(false);
    }
  }

  return (
    <PageShell>
      <PageHeader
        title="رفع الملفات"
        description="دعم CSV محلي مع رفع اختياري إلى Supabase Storage عند توفر إعدادات الـ bucket"
        actions={<StatCard label="حالة المدقق" value={statusMessage} accent={C.lavender} />}
      />

      <DataState variant={variant} loading={<div />}>
        <SectionCard title="معاينة الملف" description="اختر ملف CSV لعرض معاينة مباشرة ومراجعة تلقائية">
          <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 14 }}>
            <label
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 16px",
                borderRadius: 14,
                background: `linear-gradient(90deg, ${C.lavender}, ${C.pink})`,
                color: C.bg,
                fontWeight: 700,
                fontSize: 12,
                cursor: "pointer",
                opacity: uploading ? 0.7 : 1,
              }}
            >
              {uploading ? "جارٍ المعالجة…" : "اختيار الملف"}
              <input
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    void handleFileChange(file);
                  }
                }}
                style={{ display: "none" }}
              />
            </label>
          </div>

          <div style={{ overflowX: "auto" }}>
            {rows.length ? (
              <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 520 }}>
                <thead>
                  <tr>
                    {Object.keys(rows[0]).map((key) => (
                      <th
                        key={key}
                        style={{
                          textAlign: "right",
                          padding: "10px 8px",
                          fontSize: 12,
                          color: C.textMid,
                          borderBottom: `0.5px solid ${C.borderLo}`,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {key}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, idx) => (
                    <tr key={idx}>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.name}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.id}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.dept}</td>
                      <td style={{ padding: "10px 8px", borderBottom: `0.5px solid ${C.borderLo}`, color: C.textHi, fontSize: 13 }}>{r.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7 }}>
                لم يتم اختيار ملف بعد. اختر CSV لتجربة المعاينة والتدقيق.
              </div>
            )}
          </div>

          <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "1fr", gap: 10 }}>
            <div style={{ background: C.surfaceHi, border: `0.5px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}>
              <div style={{ fontWeight: 700, color: C.textHi, fontSize: 13 }}>التحقق من البيانات</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {validation.map((v, i) => {
                  const isDup = v.kind.includes("مكرر");
                  const s = isDup ? STATUS_STYLE["at-risk"] : STATUS_STYLE["watch"];
                  return (
                    <div key={i} style={{ border: `0.5px solid ${C.borderLo}`, background: s.bg, borderRadius: 14, padding: 10 }}>
                      <div style={{ color: s.text, fontWeight: 700, fontSize: 12 }}>{v.kind}</div>
                      <div style={{ color: C.textLo, fontSize: 12, marginTop: 4, lineHeight: 1.6 }}>{v.message}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div style={{ background: C.surfaceHi, border: `0.5px solid ${C.borderLo}`, borderRadius: 16, padding: 14 }}>
              <div style={{ fontWeight: 700, color: C.textHi, fontSize: 13 }}>سجل الرفع</div>
              <div style={{ marginTop: 10, display: "grid", gap: 10 }}>
                {history.map((h) => (
                  <div key={h.id} style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
                    <div>
                      <div style={{ color: C.textMid, fontWeight: 700, fontSize: 12 }}>{h.fileName}</div>
                      <div style={{ color: C.textLo, fontSize: 12, marginTop: 4 }}>{h.time}</div>
                    </div>
                    <div
                      style={{
                        border: `0.5px solid ${C.borderLo}`,
                        background: C.surface,
                        borderRadius: 999,
                        padding: "7px 12px",
                        fontWeight: 700,
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
        </SectionCard>

        <div style={{ color: C.textLo, fontSize: 12, lineHeight: 1.7, marginTop: 4 }}>
          ملاحظة: المعاينة الحالية تدعم CSV مباشرة، بينما رفع Excel يحتاج إلى مُحلّل إضافي أو إعداد bucket في Supabase.
        </div>
      </DataState>
    </PageShell>
  );
}
