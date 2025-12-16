import { useState } from "react";

export default function App() {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  return (
    <div
      className="min-h-screen flex flex-col items-center gap-6 p-8"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <h1 className="text-2xl font-bold">📝 メモアプリ</h1>

      {/* 文字色 */}
      <div className="border rounded-lg p-4 w-64">
        <p className="font-semibold mb-2">文字色</p>
        <input
          type="color"
          value={textColor}
          onChange={(e) => setTextColor(e.target.value)}
          className="w-full h-10"
        />
      </div>

      {/* 背景色 */}
      <div className="border rounded-lg p-4 w-64">
        <p className="font-semibold mb-2">背景色</p>
        <input
          type="color"
          value={bgColor}
          onChange={(e) => setBgColor(e.target.value)}
          className="w-full h-10"
        />
      </div>

      <textarea
        className="w-80 h-40 border rounded p-2"
        placeholder="ここにメモを書く"
      />
    </div>
  );
}
