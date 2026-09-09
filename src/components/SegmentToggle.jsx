export default function SegmentToggle({ label, options, value, onChange }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[#1c2321]">{label}</label>
      <div className="inline-flex w-full overflow-hidden rounded-lg border border-[#d6e5e0]">
        {options.map((option, index) => {
          const isActive = option.value === value
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`flex-1 px-3 py-2 text-sm font-semibold transition-colors ${
                index > 0 ? 'border-l border-[#d6e5e0]' : ''
              } ${
                isActive
                  ? 'bg-teal-600 text-white'
                  : 'bg-white text-[#3d4a46] hover:bg-teal-50'
              }`}
            >
              {option.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
