import { useState } from "react";

export default function App() {
  const [textColor, setTextColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");

  return (
    <div
      className="min-h-screen p-8"
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <h1 className="text-2xl font-bold text-center mb-8">📝 メモアプリ</h1>

      {/* カラーパネル */}
      <div className="flex justify-center gap-6 mb-8">
        {/* 文字色 */}
        <div className="border-2 border-blue-500 rounded-lg p-4 w-48">
          <p className="font-semibold text-center mb-2 text-blue-600">
            ✏️ 文字色
          </p>
          <input
            type="color"
            value={textColor}
            onChange={(e) => setTextColor(e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>

        {/* 背景色 */}
        <div className="border-2 border-green-500 rounded-lg p-4 w-48">
          <p className="font-semibold text-center mb-2 text-green-600">
            🖼 背景色
          </p>
          <input
            type="color"
            value={bgColor}
            onChange={(e) => setBgColor(e.target.value)}
            className="w-full h-10 cursor-pointer"
          />
        </div>
      </div>

      {/* メモ欄 */}
      <div className="flex justify-center">
        <textarea
          className="w-96 h-48 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="ここにメモを書く"
        />
      </div>
    </div>
  );
}
