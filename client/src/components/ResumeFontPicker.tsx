import { DEFAULT_RESUME_FONT, RESUME_FONTS, ResumeFont } from '../constants/resumeFonts';

interface ResumeFontPickerProps {
  value: ResumeFont;
  onChange: (font: ResumeFont) => void;
  compact?: boolean;
  disabled?: boolean;
}

export default function ResumeFontPicker({
  value,
  onChange,
  compact = false,
  disabled = false,
}: ResumeFontPickerProps) {
  const selected = value || DEFAULT_RESUME_FONT;

  if (compact) {
    return (
      <label className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">Font</span>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as ResumeFont)}
          disabled={disabled}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 min-w-[140px]"
          style={{ fontFamily: RESUME_FONTS.find((f) => f.id === selected)?.family }}
        >
          {RESUME_FONTS.map((font) => (
            <option key={font.id} value={font.id} style={{ fontFamily: font.family }}>
              {font.label}
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
      {RESUME_FONTS.map((font) => {
        const isSelected = selected === font.id;
        return (
          <button
            key={font.id}
            type="button"
            onClick={() => onChange(font.id)}
            disabled={disabled}
            className={`rounded-lg border px-3 py-2.5 text-left text-sm transition-colors disabled:opacity-50 ${
              isSelected
                ? 'border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
            style={{ fontFamily: font.family }}
          >
            {font.label}
          </button>
        );
      })}
    </div>
  );
}
