import { useState, useEffect, useRef } from "react";
import {
  Plus,
  X,
  Bold,
  Palette,
  Highlighter,
  Text,
  RotateCcw,
} from "lucide-react";

const COLORS = [
  "#ffffff",
  "#000000",
  "#2563eb",
  "#16a34a",
  "#dc2626",
  "#ca8a04",
];


const FONT_SIZES = [
  { label: "1", value: "2" },
  { label: "2", value: "2" },
  { label: "3", value: "3" }, // ← デフォルト
  { label: "4", value: "4" },
  { label: "5", value: "5" },
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
    setMemos([...memos, memo]);
    setActiveId(memo.id);
  };

  const persist = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setMemos((ms) =>
      ms.map((m) => (m.id === activeId ? { ...m, content: html } : m))
    );
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    persist();
  };

  return (
    <div className="min-h-screen bg-zinc-100 p-8 text-zinc-900">
      <div className="max-w-6xl mx-auto space-y-6">
        <h1 className="text-4xl font-bold">📝 メモ</h1>

        {/* タブ */}
        <div className="flex items-center gap-6 overflow-x-auto">
          {memos.map((m, index) => (
            <div
  key={m.id}
  onClick={() => setActiveId(m.id)}
  className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer border-2 ${
    m.id === activeId
      ? "bg-white border-blue-500 font-bold"
      : "bg-zinc-200 border-transparent"
  }`}
>
  <span className="whitespace-nowrap">
    メモ {index + 1}
  </span>

  <button
    onClick={(e) => {
      e.stopPropagation();
      setMemos(memos.filter((x) => x.id !== m.id));
    }}
    className="hover:text-red-500"
  >
    <X size={20} />
  </button>
</div>

          ))}

          <button
            onClick={addMemo}
            className="ml-8 flex items-center gap-2 px-5 py-3 bg-white border rounded-lg hover:bg-zinc-100"
          >
            <Plus size={22} />
            追加
          </button>
        </div>

        {/* ツールバー */}
        {activeMemo && (
          <div className="flex flex-wrap gap-10 bg-white p-4 border rounded-xl">
            <button
              onClick={() => exec("bold")}
              className="p-4 rounded-xl hover:bg-zinc-100"
            >
              <Bold size={26} />
            </button>

            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => exec("foreColor", c)}
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: c }}
                />
              ))}
              <Palette size={26} />
            </div>

            <div className="flex items-center gap-3">
              {COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => exec("hiliteColor", c)}
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: c }}
                />
              ))}
              <Highlighter size={26} />
            </div>

            <div className="flex items-center gap-3">
              {FONT_SIZES.map((f) => (
                <button
                  key={f.value}
                  onClick={() => exec("fontSize", f.value)}
                  className="px-4 py-2 text-lg border rounded-lg"
                >
                  {f.label}
                </button>
              ))}
              <Text size={26} />
            </div>

            <button
              onClick={() => exec("removeFormat")}
              className="p-4 rounded-xl hover:bg-zinc-100"
            >
              <RotateCcw size={26} />
            </button>
          </div>
        )}

        {/* エディタ */}
        {activeMemo && (
          <div className="bg-white border rounded-xl p-6">
            <div
              ref={editorRef}
              contentEditable
              onInput={persist}
              className="min-h-[300px] outline-none text-lg leading-relaxed"
            />
            <div className="text-right text-sm text-zinc-500 mt-4">
              {activeMemo.date}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
