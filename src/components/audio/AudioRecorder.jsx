import React, { useEffect, useRef, useState } from "react";

/**
 * AudioRecorder — компактный React‑компонент для записи звука из микрофона браузера.
 *
 * Особенности:
 * - Старт / Пауза / Возобновление / Стоп
 * - Индикатор уровня (VU) в реальном времени
 * - Список дублей с предпрослушкой и скачиванием
 * - Выбор поддерживаемого MIME типа (opus/webm, mp3* или wav* если поддерживается браузером)
 *
 * Примечание: большинство браузеров отдают audio/webm; кодек mp3/wav через MediaRecorder поддерживается не везде.
 */
export default function AudioRecorder({
  preferredMimeTypes = [
    "audio/webm;codecs=opus",
    "audio/webm",
    "audio/mp4",
    "audio/ogg;codecs=opus",
    "audio/ogg",
  ],
  maxDurationMs = 0, // 0 = без лимита
  className = "",
  onSave, // (file: { blob, url, mimeType, createdAt, durationMs }) => void
}) {
  const [supportedMimeType, setSupportedMimeType] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState(0); // 0..1
  const [elapsedMs, setElapsedMs] = useState(0);
  const [takes, setTakes] = useState([]);

  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);
  const chunksRef = useRef([]);

  // Web Audio для индикатора уровня
  const audioCtxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const rafRef = useRef(null);
  const startedAtRef = useRef(0);
  const timerRef = useRef(null);

  useEffect(() => {
    // Выбрать первый поддерживаемый mimeType
    const chosen = preferredMimeTypes.find((t) =>
      typeof MediaRecorder !== "undefined" && MediaRecorder.isTypeSupported?.(t)
    );
    setSupportedMimeType(chosen || "");
  }, [preferredMimeTypes]);

  useEffect(() => {
    return () => {
      // Очистка при размонтировании
      stopAll();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function formatTime(ms) {
    const total = Math.max(0, Math.floor(ms / 1000));
    const h = Math.floor(total / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((total % 3600) / 60)
      .toString()
      .padStart(2, "0");
    const s = Math.floor(total % 60)
      .toString()
      .padStart(2, "0");
    return h !== "00" ? `${h}:${m}:${s}` : `${m}:${s}`;
  }

  async function start() {
    setError("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Ваш браузер не поддерживает getUserMedia");
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      // Настройка MediaRecorder
      const options = supportedMimeType ? { mimeType: supportedMimeType } : {};
      const mr = new MediaRecorder(stream, options);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = (e) => {
        if (e.data && e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, {
          type: supportedMimeType || mr.mimeType || "audio/webm",
        });
        const url = URL.createObjectURL(blob);
        const take = {
          blob,
          url,
          mimeType: blob.type,
          createdAt: new Date(),
          durationMs: elapsedMs,
        };
        setTakes((prev) => [take, ...prev]);
        onSave?.(take);
      };

      // Web Audio для уровня
      setupAudioAnalysis(stream);

      // Таймер
      startedAtRef.current = Date.now();
      setElapsedMs(0);
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startedAtRef.current;
        setElapsedMs(elapsed);
        if (maxDurationMs > 0 && elapsed >= maxDurationMs) {
          stop();
        }
      }, 200);

      mr.start(250); // собрать данные каждые 250мс
      setIsRecording(true);
      setIsPaused(false);
    } catch (e) {
      setError(e.message || String(e));
      stopAll();
    }
  }

  function pause() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state === "recording") {
      mr.pause();
      setIsPaused(true);
      // Остановить таймер, но не сбрасывать startedAt
      if (timerRef.current) clearInterval(timerRef.current);
    }
  }

  function resume() {
    const mr = mediaRecorderRef.current;
    if (!mr) return;
    if (mr.state === "paused") {
      mr.resume();
      setIsPaused(false);
      // Пересчитать startedAt так, чтобы elapsed продолжался расти с текущего значения
      startedAtRef.current = Date.now() - elapsedMs;
      timerRef.current = setInterval(() => {
        const now = Date.now();
        const elapsed = now - startedAtRef.current;
        setElapsedMs(elapsed);
        if (maxDurationMs > 0 && elapsed >= maxDurationMs) {
          stop();
        }
      }, 200);
    }
  }

  function stop() {
    const mr = mediaRecorderRef.current;
    if (mr && (mr.state === "recording" || mr.state === "paused")) {
      mr.stop();
    }
    setIsRecording(false);
    setIsPaused(false);
    cleanupAnalysis();
    if (timerRef.current) clearInterval(timerRef.current);
  }

  function stopAll() {
    try {
      stop();
    } finally {
      const stream = streamRef.current;
      if (stream) {
        stream.getTracks().forEach((t) => t.stop());
      }
      streamRef.current = null;
      mediaRecorderRef.current = null;
    }
  }

  function setupAudioAnalysis(stream) {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 2048;
      const source = audioCtx.createMediaStreamSource(stream);
      source.connect(analyser);

      audioCtxRef.current = audioCtx;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const data = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteTimeDomainData(data);
        // Оценка RMS для уровня 0..1
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128; // -1..1
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        setLevel(Math.min(1, rms * 2));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch (e) {
      // Если анализ не удался — просто игнорируем индикатор уровня
      console.warn("Audio analysis init failed:", e);
    }
  }

  function cleanupAnalysis() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = null;
    try {
      sourceRef.current?.disconnect();
      analyserRef.current?.disconnect();
      audioCtxRef.current?.close();
    } catch {}
    sourceRef.current = null;
    analyserRef.current = null;
    audioCtxRef.current = null;
    setLevel(0);
  }

  function downloadTake(take) {
    const a = document.createElement("a");
    const ext = mimeToExt(take.mimeType);
    a.href = take.url;
    a.download = `recording_${formatDateFile(take.createdAt)}.${ext}`;
    a.click();
  }

  function deleteTake(url) {
    setTakes((prev) => prev.filter((t) => t.url !== url));
    URL.revokeObjectURL(url);
  }

  function mimeToExt(mime) {
    if (!mime) return "webm";
    if (mime.includes("ogg")) return "ogg";
    if (mime.includes("mp4")) return "m4a";
    if (mime.includes("mp3")) return "mp3";
    if (mime.includes("wav")) return "wav";
    return "webm";
  }

  function formatDateFile(d) {
    const dt = typeof d === "string" ? new Date(d) : d;
    const yyyy = dt.getFullYear();
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const dd = String(dt.getDate()).padStart(2, "0");
    const hh = String(dt.getHours()).padStart(2, "0");
    const mi = String(dt.getMinutes()).padStart(2, "0");
    const ss = String(dt.getSeconds()).padStart(2, "0");
    return `${yyyy}${mm}${dd}_${hh}${mi}${ss}`;
  }

  const canRecord = !isRecording;
  const canPause = isRecording && !isPaused;
  const canResume = isRecording && isPaused;
  const canStop = isRecording;

  return (
    <div
      className={`w-full max-w-2xl mx-auto p-4 rounded-2xl shadow-lg bg-white dark:bg-zinc-900 ${className}`}
    >
      <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
        🎙️ Запись звука из микрофона
      </h2>

      <div className="text-sm text-zinc-600 dark:text-zinc-300 mb-3">
        Формат: {supportedMimeType || "по умолчанию браузера"}
      </div>

      {error && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 text-red-700 border border-red-200">
          {error}
        </div>
      )}

      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={start}
          disabled={!canRecord}
          className="px-4 py-2 rounded-2xl bg-emerald-600 disabled:opacity-40 text-white shadow hover:shadow-md transition"
        >
          ▶️ Старт
        </button>
        <button
          onClick={pause}
          disabled={!canPause}
          className="px-4 py-2 rounded-2xl bg-amber-500 disabled:opacity-40 text-white shadow hover:shadow-md transition"
        >
          ⏸ Пауза
        </button>
        <button
          onClick={resume}
          disabled={!canResume}
          className="px-4 py-2 rounded-2xl bg-blue-600 disabled:opacity-40 text-white shadow hover:shadow-md transition"
        >
          ⏯ Возобновить
        </button>
        <button
          onClick={stop}
          disabled={!canStop}
          className="px-4 py-2 rounded-2xl bg-rose-600 disabled:opacity-40 text-white shadow hover:shadow-md transition"
        >
          ⏹ Стоп
        </button>

        <div className="ml-auto text-sm font-medium px-3 py-2 rounded-xl bg-zinc-100 dark:bg-zinc-800">
          Время: {formatTime(elapsedMs)}
          {maxDurationMs > 0 && ` / ${formatTime(maxDurationMs)}`}
        </div>
      </div>

      {/* Индикатор уровня */}
      <div className="h-3 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-emerald-500 transition-all"
          style={{ width: `${Math.round(level * 100)}%` }}
          aria-valuenow={Math.round(level * 100)}
          aria-valuemin={0}
          aria-valuemax={100}
          role="progressbar"
        />
      </div>

      {/* Список дублей */}
      <div className="space-y-3">
        {takes.length === 0 ? (
          <div className="text-sm text-zinc-500">Записей пока нет.</div>
        ) : (
          takes.map((t, idx) => (
            <div
              key={t.url}
              className="flex items-center gap-3 p-3 rounded-2xl border border-zinc-200 dark:border-zinc-800"
            >
              <div className="text-xs text-zinc-500 w-12">#{takes.length - idx}</div>
              <audio src={t.url} controls className="flex-1" />
              <div className="text-xs text-zinc-500 whitespace-nowrap">
                {formatTime(t.durationMs)}
              </div>
              <button
                className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={() => downloadTake(t)}
              >
                ⬇️ Скачать
              </button>
              <button
                className="px-3 py-1 rounded-xl bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700"
                onClick={() => deleteTake(t.url)}
              >
                🗑 Удалить
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 text-xs text-zinc-500 leading-relaxed">
        ⚙️ Советы: Если запись не стартует, проверьте разрешение на доступ к микрофону. В Safari
        лучше использовать последние версии iOS/macOS. Для серверной загрузки отправляйте Blob через
        FormData на ваш API.
      </div>
    </div>
  );
}
