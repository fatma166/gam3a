"use client";

import { useState } from "react";
import { request } from "./client-api";
import type { Track } from "./api";

type Match = {
  id: number;
  message: string | null;
  minimum_score: string;
  program?: {
    id: number;
    name: string;
    faculty?: { university?: { name: string } };
  } | null;
};

type SearchResult = {
  summary: string;
  matches: Match[];
};

export default function HomeEligibilitySearch({ tracks }: { tracks: Track[] }) {
  const [certificateTrackId, setCertificateTrackId] = useState(tracks[0]?.id ?? 0);
  const [score, setScore] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setResult(null);

    try {
      setResult(await request<SearchResult>("search-eligibility", {
        method: "POST",
        body: JSON.stringify({
          certificate_track_id: certificateTrackId,
          score: Number(score),
          specialty,
        }),
      }));
    } catch (caught) {
      setError((caught as Error).message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="search-band home-search">
      <form onSubmit={submit} style={{ display: "contents" }}>
        <div>
          <label>نوع الشهادة</label>
          <select value={certificateTrackId} onChange={(event) => setCertificateTrackId(Number(event.target.value))}>
            {tracks.map((track) => (
              <option value={track.id} key={track.id}>{track.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label>المجموع المتوقع</label>
          <input placeholder="مثال: 87%" inputMode="decimal" value={score} onChange={(event) => setScore(event.target.value)} required />
        </div>
        <div>
          <label>التخصص المرغوب</label>
          <input placeholder="طب، هندسة، صيدلة..." value={specialty} onChange={(event) => setSpecialty(event.target.value)} />
        </div>
        <button className="primary-button compact" disabled={busy}>{busy ? "جارٍ البحث..." : "احسب الأهلية"}</button>
      </form>
      {error && <p className="form-alert" role="alert">{error}</p>}
      {result && (
        <div className="calculator-result" style={{ gridColumn: "1 / -1" }}>
          <div className="notice-panel">
            <strong>{result.summary}</strong>
            <p>هذه النتائج قادمة من قواعد بحث الأهلية المنشورة في لوحة التحكم.</p>
          </div>
          <div className="eligible-programs">
            {result.matches.slice(0, 6).map((match) => (
              <a href={match.program ? `/apply?program=${match.program.id}` : "/consultations"} key={match.id}>
                <strong>{match.program?.name ?? "استشارة مطلوبة"}</strong>
                <small>{match.program?.faculty?.university?.name ?? match.message ?? `حد أدنى ${match.minimum_score}%`}</small>
              </a>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
