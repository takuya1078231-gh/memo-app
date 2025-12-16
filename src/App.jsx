import { useState, useEffect, useRef } from "react";

const COLORS = [
  "#000000", // 黒
  "#ffffff", // 白
  "#2563eb", // 青
  "#16a34a", // 緑
  "#dc2626", // 赤
];

const FONT_SIZES = [
  { label: "1", value: "2" },
  { label: "2", value: "3" },
  { label: "3", value: "4" },
  { label: "4", value: "5" },
  { label: "5", value: "6" },
];

export default function App() {
  const [memos, setMemos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("memos");
    if (saved) {
      const data = JSON.parse(saved);
      setMemos(data);
      if (data[0]) setActiveId(data[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("memos", JSON.stringify(memos));
  }, [memos]);

  const activeMemo = memos.find((m) => m.id === activeId);

  useEffect(() => {
    if (editorRef.current && activeMemo) {
      editorRef.current.innerHTML = activeMemo.content || "";
    }
  }, [activeId]);

  const addMemo = () => {
    const memo = {
      id: Date.now(),
      content: "",
      date: new Date().toLocaleString(),
    };
    setMemos((ms) => [...ms, memo]);
    setActiveId(memo.id);
  };

  const deleteMemo = (id) => {
    setMemos((ms) => ms.filter((m) => m.id !== id));
    if (id === activeId && memos.length > 1) {
      const next = memos.find((m) => m.id !== id);
      if (next) setActiveId(next.id);
    }
  };

  const persistFromEditor = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setMemos((ms) =>
      ms.map((m) => (m.id === activeId ? { ...m, content: html } : m))
    );
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    persistFromEditor();
  };

  const resetFormat = () => {
    document.execCommand("removeFormat");
    document.execCommand("foreColor", false, "#000000");
    document.execCommand("hiliteColor", false, "transparent");
    document.execCommand("fontSize", false, "3");
    persistFromEditor();
  };

  const tabTitle = (html, index) => {
    if (!html) return `メモ ${index + 1}`;
    const text = html.replace(/<[^>]+>/g, "").trim();
    return text.slice(0, 10) || `メモ ${index + 1}`;
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h2>📝 メモアプリ</h2>

      {/* タブ */}
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {memos.map((m, i) => (
          <div
            key={m.id}
            onClick={() => setActiveId(m.id)}
            style={{
              padding: "4px 8px",
              borderBottom: m.id === activeId ? "2px solid blue" : "none",
              cursor: "pointer",
              background: "#eee",
            }}
          >
            {tabTitle(m.content, i)}
            <button
              onClick={(e) => {
                e.stopPropagation();
                deleteMemo(m.id);
              }}
              style={{ marginLeft: 6 }}
            >
              ×
            </button>
          </div>
        ))}
        <button onClick={addMemo}>＋</button>
      </div>

      {/* ツールバー */}
      {activeMemo && (
        <div style={{ marginBottom: 10 }}>
          <button onClick={() => exec("bold")}>太字</button>

          {COLORS.map((c) => (
            <button
              key={c}
              onClick={() => exec("foreColor", c)}
              style={{
                background: c,
                width: 20,
                height: 20,
                marginLeft: 4,
              }}
            />
          ))}

          {COLORS.map((c) => (
            <button
              key={c + "bg"}
              onClick={() => exec("hiliteColor", c)}
              style={{
                background: c,
                width: 20,
                height: 20,
                marginLeft: 4,
              }}
            />
          ))}

          {FONT_SIZES.map((f) => (
            <button
              key={f.value}
              onClick={() => exec("fontSize", f.value)}
              style={{ marginLeft: 4 }}
            >
              {f.label}
            </button>
          ))}

          <button onClick={resetFormat} style={{ marginLeft: 8 }}>
            リセット
          </button>
        </div>
      )}

      {/* エディタ */}
      {activeMemo && (
        <div
          ref={editorRef}
          contentEditable
          onInput={persistFromEditor}
          style={{
            minHeight: 300,
            border: "1px solid #ccc",
            padding: 10,
            background: "#fff",
          }}
        />
      )}

      {memos.length === 0 && <p>＋ボタンでメモを追加してください</p>}
    </div>
  );
}
