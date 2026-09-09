import { LIFE_STAGE_NOTES, calculateMacros } from '../lib/tdee'

const TARGETS = [
  { key: 'cut', label: 'Lose weight', macroLabel: 'lose weight' },
  { key: 'maintain', label: 'Maintain', macroLabel: 'maintenance' },
  { key: 'gain', label: 'Gain weight', macroLabel: 'gain weight' },
]

export default function ResultsPanel({ result, lifeStage, macroTarget, onSelectTarget }) {
  const macros = calculateMacros(result[macroTarget])
  const selectedLabel = TARGETS.find((t) => t.key === macroTarget).macroLabel
  const lifeStageNote = LIFE_STAGE_NOTES[lifeStage]

  return (
    <div className="mt-6 flex flex-col gap-6">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-[#d6e5e0] bg-white p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-[#5b6b66]">
            Basal Metabolic Rate
          </p>
          <p className="mt-1 text-3xl font-bold text-[#1c2321]">
            {Math.round(result.bmr)}{' '}
            <span className="text-sm font-normal text-[#8ea39c]">kcal/day</span>
          </p>
          <p className="mt-1 text-sm text-[#5b6b66]">
            {result.usedManualBmr ? 'Using the BMR you entered.' : 'Estimated via Mifflin–St Jeor.'}
          </p>
        </div>

        <div className="rounded-xl border border-teal-200 bg-teal-50 p-5 shadow-sm">
          <p className="text-[10px] font-semibold uppercase tracking-wide text-teal-600">
            Total Daily Energy Expenditure
          </p>
          <p className="mt-1 text-3xl font-bold text-[#1c2321]">
            {Math.round(result.tdee)}{' '}
            <span className="text-sm font-normal text-[#8ea39c]">kcal/day</span>
          </p>
          <p className="mt-1 text-sm text-[#5b6b66]">
            BMR plus your activity level{result.lifeStageAdjustment !== 0 ? ' plus a life-stage adjustment' : ''}.
          </p>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#1c2321]">Calorie targets</h3>
        <p className="mt-0.5 text-xs text-[#8ea39c]">Select a target to see its macro split below.</p>
        <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TARGETS.map((target) => {
            const isSelected = macroTarget === target.key
            return (
              <button
                key={target.key}
                type="button"
                onClick={() => onSelectTarget(target.key)}
                className={`rounded-xl border p-4 text-left shadow-sm transition-colors ${
                  isSelected
                    ? 'border-teal-200 bg-teal-50'
                    : 'border-[#d6e5e0] bg-white hover:bg-teal-50/40'
                }`}
              >
                <p
                  className={`text-[10px] font-semibold uppercase tracking-wide ${
                    isSelected ? 'text-teal-600' : 'text-[#5b6b66]'
                  }`}
                >
                  {target.label}
                </p>
                <p className="mt-1 text-lg font-bold text-[#1c2321]">
                  {Math.round(result[target.key])} kcal
                </p>
              </button>
            )
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-[#1c2321]">Macro split at {selectedLabel}</h3>
        <table className="mt-3 w-full">
          <thead>
            <tr>
              <th className="border-b border-[#d6e5e0] pb-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5b6b66]">
                Protein — {macros.proteinPct}%
              </th>
              <th className="border-b border-[#d6e5e0] pb-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5b6b66]">
                Carbs — {macros.carbsPct}%
              </th>
              <th className="border-b border-[#d6e5e0] pb-2 text-left text-[11px] font-semibold uppercase tracking-wide text-[#5b6b66]">
                Fat — {macros.fatPct}%
              </th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="pt-2 text-lg font-bold text-[#1c2321]">{macros.proteinG} g</td>
              <td className="pt-2 text-lg font-bold text-[#1c2321]">{macros.carbsG} g</td>
              <td className="pt-2 text-lg font-bold text-[#1c2321]">{macros.fatG} g</td>
            </tr>
          </tbody>
        </table>
      </div>

      {lifeStageNote && <p className="text-sm text-[#5b6b66]">{lifeStageNote}</p>}

      <p className="border-t border-[#d6e5e0] pt-4 text-xs text-[#8ea39c]">
        Estimates only, not medical advice. Formula: Mifflin–St Jeor (1990).
      </p>
    </div>
  )
}
