import { useState, useEffect, useRef } from "react";
import { Plus, X, Bold, Palette, Highlighter, Text, RotateCcw } from "lucide-react";

const COLORS = [
  '#000000', // 黒
  '#ffffff', // 白
  '#2563eb', // 青
  '#16a34a', // 緑
  '#dc2626', // 赤
  '#ca8a04', // 黄
];

const FONT_SIZES = [
  { label: '1', value: '2' },
  { label: '2', value: '3' },
  { label: '3', value: '4' },
  { label: '4', value: '5' },
  { label: '5', value: '6' },
];

export default function MemoApp() {
  const [memos, setMemos] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('memos');
    if (saved) {
      const data = JSON.parse(saved);
      setMemos(data);
      if (data[0]) setActiveId(data[0].id);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('memos', JSON.stringify(memos));
  }, [memos]);

  const activeMemo = memos.find(m => m.id === activeId);

  // ★ 重要：タブ切替時のみエディタへ反映（入力中はDOM主導）
  useEffect(() => {
    if (editorRef.current && activeMemo) {
      editorRef.current.innerHTML = activeMemo.content || '';
    }
  }, [activeId]);

  const addMemo = () => {
    const memo = { id: Date.now(), content: '', date: new Date().toLocaleString() };
    setMemos([memo, ...memos]);
    setActiveId(memo.id);
  };

  const persistFromEditor = () => {
    if (!editorRef.current) return;
    const html = editorRef.current.innerHTML;
    setMemos(ms => ms.map(m => (m.id === activeId ? { ...m, content: html } : m)));
  };

  const deleteMemo = (id) => {
    const rest = memos.filter(m => m.id !== id);
    setMemos(rest);
    setActiveId(rest[0]?.id || null);
  };

  const exec = (cmd, value = null) => {
    document.execCommand(cmd, false, value);
    persistFromEditor();
  };

  const resetFormat = () => {
    document.execCommand('removeFormat');
    document.execCommand('foreColor', false, '#000000');
    document.execCommand('hiliteColor', false, 'transparent');
    document.execCommand('fontSize', false, '3');
    persistFromEditor();
  };

  const tabTitle = (html, index) => {
    if (!html) return `メモ ${index + 1}`;
    const text = html.replace(/<[^>]+>/g, '').trim();
    return text.slice(0, 10) || `メモ ${index + 1}`;
  };

  return (
    <div className="min-h-screen bg-zinc-100 text-zinc-900 p-6">
      <div className="max-w-5xl mx-auto grid gap-4">
        <h1 className="text-3xl font-bold">📝 メモ</h1>

        <div className="flex gap-2 overflow-x-auto items-center">
          {memos.map((m, index) => (
            <div
              key={m.id}
              onClick={() => setActiveId(m.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-t-md cursor-pointer border-b-2 ${m.id === activeId ? 'border-blue-500 bg-white font-bold' : 'border-transparent bg-zinc-200'}`}
            >
              <span className="text-sm">{tabTitle(m.content, index)}</span>
              <button onClick={(e) => { e.stopPropagation(); deleteMemo(m.id); }} className="ml-1 hover:text-red-500">
                <X size={14} />
              </button>
            </div>
          ))}
          <button
            onClick={addMemo}
            className="ml-auto inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-2 py-1 text-sm hover:bg-zinc-100"
          >
            <Plus size={16} />
          </button>
        </div>

        {activeMemo && (
          <div className="flex gap-3 bg-white border p-2 rounded items-center flex-wrap">
            <button
              onClick={() => exec('bold')}
              className="p-2 rounded hover:bg-zinc-100"
            >
              <Bold size={16}/>
            </button>

            <div className="flex gap-1 items-center">
              {COLORS.map(c => (
                <button key={c} onClick={() => exec('foreColor', c)} className="w-5 h-5 rounded border" style={{ backgroundColor: c }} />
              ))}
              <Palette size={16} />
            </div>

            <div className="flex gap-1 items-center">
              {COLORS.map(c => (
                <button key={c} onClick={() => exec('hiliteColor', c)} className="w-5 h-5 rounded border" style={{ backgroundColor: c }} />
              ))}
              <Highlighter size={16} />
            </div>

            <div className="flex gap-1 items-center">
              {FONT_SIZES.map(f => (
                <button
                  key={f.value}
                  onClick={() => exec('fontSize', f.value)}
                  className="px-2 py-1 text-sm border rounded hover:bg-zinc-100"
                >
                  {f.label}
                </button>
              ))}
              <Text size={16} />
            </div>

            <button
              onClick={resetFormat}
              title="すべてリセット"
              className="p-2 rounded hover:bg-zinc-100"
            >
              <RotateCcw size={16} />
            </button>
          </div>
        )}

        {activeMemo && (
          <div className="bg-white rounded-lg border shadow-sm">
            <div className="p-4 grid gap-3">
              <div
                ref={editorRef}
                contentEditable
                suppressContentEditableWarning
                className="min-h-[300px] outline-none leading-relaxed text-base"
                onInput={persistFromEditor}
              />
              <div className="text-sm text-zinc-500 text-right">
                {activeMemo.date}
              </div>
            </div>
          </div>
        )}


        {memos.length === 0 && (
          <p className="text-zinc-500">＋ボタンでメモを追加してください</p>
        )}
      </div>
    </div>
  );
}
