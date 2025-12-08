import { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faSave, faSpinner } from "@fortawesome/free-solid-svg-icons";

/**
 * @param {string} value - текущее значение, приходит через пропс
 * @param {function} onSave - функция сохранения, должна вернуть Promise
 * @param {string} defaultValue - дефолтное значение, если поле пустое
 * @param {object} icons - объект { editIcon, saveIcon } для кастомных иконок
 */
export default function EditableText({
  value,
  onSave,
  defaultValue = "Not defined",
  editIcon = faEdit,
  saveIcon = faSave,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value || "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // обновляем локальный текст, если value меняется извне
  useEffect(() => {
    setText(value || "");
  }, [value]);

  const handleSave = async () => {
    const finalText = text.trim() === "" ? defaultValue : text;
    setSaving(true);
    setError("");

    try {
      if (onSave) {
        await onSave(finalText); // асинхронное сохранение
      }
      setText(finalText);
      setIsEditing(false);
    } catch (err) {
      console.error(err);
      setError("Save error");
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSave();
    }
  };

  return (
    <div className="flex flex-col space-y-1">
      <div className="flex items-center space-x-2">
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border rounded px-2 py-1 text-sm bg-white dark:bg-gray-700 dark:text-gray-100"
            autoFocus
            disabled={saving}
          />
        ) : (
          <span className="text-gray-800 dark:text-gray-100">{text || defaultValue}</span>
        )}

        <button
          className={`p-1 rounded text-gray-500 hover:text-gray-700 dark:hover:text-gray-200 transition z-10 flex items-center justify-center
            ${!isEditing ? "hover:bg-gray-100 dark:hover:bg-gray-700" : ""}`}
          onClick={() => {
            if (isEditing) {
              handleSave();
            } else {
              setIsEditing(true);
            }
          }}
          disabled={saving}
        >
          {saving ? (
            <FontAwesomeIcon icon={faSpinner} spin className="w-4 h-4 text-blue-500" />
          ) : (
            <FontAwesomeIcon icon={isEditing ? saveIcon : editIcon} className="w-4 h-4" />
          )}
        </button>
      </div>
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}