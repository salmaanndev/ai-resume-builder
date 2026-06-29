import { DEFAULT_RESUME_FONT_SIZE, RESUME_FONT_SIZES, ResumeFontSize } from '../constants/resumeFontSizes';

interface ResumeFontSizePickerProps {
  value: ResumeFontSize;
  onChange: (size: ResumeFontSize) => void;
  compact?: boolean;
  disabled?: boolean;
}

export default function ResumeFontSizePicker({
  value,
  onChange,
  compact = false,
  disabled = false,
}: ResumeFontSizePickerProps) {
  const selected = value || DEFAULT_RESUME_FONT_SIZE;

  if (compact) {
    return (
      <label className="flex items-center gap-2">
        <span className="text-sm text-gray-600 whitespace-nowrap hidden sm:inline">Size</span>
        <select
          value={selected}
          onChange={(e) => onChange(e.target.value as ResumeFontSize)}
          disabled={disabled}
          className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 disabled:opacity-50 min-w-[110px]"
        >
          {RESUME_FONT_SIZES.map((size) => (
            <option key={size.id} value={size.id}>
              {size.label} ({size.basePt}pt)
            </option>
          ))}
        </select>
      </label>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {RESUME_FONT_SIZES.map((size) => {
        const isSelected = selected === size.id;
        return (
          <button
            key={size.id}
            type="button"
            onClick={() => onChange(size.id)}
            disabled={disabled}
            className={`rounded-lg border px-3 py-2.5 text-center text-sm transition-colors disabled:opacity-50 ${
              isSelected
                ? 'border-brand-500 bg-brand-50 text-brand-800 ring-1 ring-brand-500'
                : 'border-gray-200 bg-white text-gray-800 hover:border-gray-300 hover:bg-gray-50'
            }`}
          >
            <span className="block font-medium">{size.label}</span>
            <span className="block text-xs text-gray-500 mt-0.5">{size.basePt}pt</span>
          </button>
        );
      })}
    </div>
  );
}
