import { useState } from 'react'
import {
  ACTIVITY_LEVELS,
  DEFAULT_UNITS,
  LIFE_STAGES,
  calculateResult,
  isValidInput,
} from '../lib/tdee'
import ResultsPanel from './ResultsPanel'
import SegmentToggle from './SegmentToggle'

const SEX_OPTIONS = [
  { value: 'female', label: 'Female' },
  { value: 'male', label: 'Male' },
]

const UNITS_OPTIONS = [
  { value: 'metric', label: 'Metric' },
  { value: 'imperial', label: 'Imperial' },
]

export default function Calculator() {
  const [gender, setGender] = useState('female')
  const [units, setUnits] = useState(DEFAULT_UNITS)
  const [lifeStage, setLifeStage] = useState('standard')
  const [age, setAge] = useState('')
  const [heightCm, setHeightCm] = useState('')
  const [heightFt, setHeightFt] = useState('')
  const [heightIn, setHeightIn] = useState('')
  const [weightKg, setWeightKg] = useState('')
  const [weightLb, setWeightLb] = useState('')
  const [manualBmr, setManualBmr] = useState('')
  const [activity, setActivity] = useState('sedentary')
  const [macroTarget, setMacroTarget] = useState('maintain')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')

  const handleGenderChange = (value) => {
    setGender(value)
    if (value === 'male' && LIFE_STAGES[lifeStage].femaleOnly) {
      setLifeStage('standard')
    }
  }

  const handleCalculate = () => {
    const input = { manualBmr, age, units, heightCm, heightFt, heightIn, weightKg, weightLb }
    if (!isValidInput(input)) {
      setError('Please fill in age, height, and weight, or enter a known BMR.')
      setResult(null)
      return
    }

    setError('')
    setMacroTarget('maintain')
    setResult(
      calculateResult({
        gender,
        units,
        age,
        heightCm,
        heightFt,
        heightIn,
        weightKg,
        weightLb,
        manualBmr,
        lifeStage,
        activity,
      }),
    )
  }

  const visibleLifeStages = Object.entries(LIFE_STAGES).filter(
    ([, stage]) => gender === 'female' || !stage.femaleOnly,
  )

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-xl border border-[#d6e5e0] bg-white p-5 shadow-sm sm:p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SegmentToggle label="Sex" options={SEX_OPTIONS} value={gender} onChange={handleGenderChange} />
          <SegmentToggle label="Units" options={UNITS_OPTIONS} value={units} onChange={setUnits} />
          <div>
            <label htmlFor="age" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
              Age (years)
            </label>
            <input
              id="age"
              type="number"
              value={age}
              onChange={(e) => setAge(e.target.value)}
              placeholder="e.g. 32"
              className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>

        <div>
          <label htmlFor="lifeStage" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
            Life stage
          </label>
          <select
            id="lifeStage"
            value={lifeStage}
            onChange={(e) => setLifeStage(e.target.value)}
            className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {visibleLifeStages.map(([key, stage]) => (
              <option key={key} value={key}>
                {stage.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {units === 'metric' ? (
            <div>
              <label htmlFor="heightCm" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
                Height (cm)
              </label>
              <input
                id="heightCm"
                type="number"
                value={heightCm}
                onChange={(e) => setHeightCm(e.target.value)}
                placeholder="e.g. 168"
                className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ) : (
            <div>
              <label className="mb-1.5 block text-sm font-medium text-[#1c2321]">Height (ft / in)</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={heightFt}
                  onChange={(e) => setHeightFt(e.target.value)}
                  placeholder="ft"
                  className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
                <input
                  type="number"
                  value={heightIn}
                  onChange={(e) => setHeightIn(e.target.value)}
                  placeholder="in"
                  className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          {units === 'metric' ? (
            <div>
              <label htmlFor="weightKg" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
                Weight (kg)
              </label>
              <input
                id="weightKg"
                type="number"
                value={weightKg}
                onChange={(e) => setWeightKg(e.target.value)}
                placeholder="e.g. 62"
                className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          ) : (
            <div>
              <label htmlFor="weightLb" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
                Weight (lb)
              </label>
              <input
                id="weightLb"
                type="number"
                value={weightLb}
                onChange={(e) => setWeightLb(e.target.value)}
                placeholder="e.g. 137"
                className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="manualBmr" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
            Known BMR (optional, kcal/day)
          </label>
          <input
            id="manualBmr"
            type="number"
            value={manualBmr}
            onChange={(e) => setManualBmr(e.target.value)}
            placeholder="Leave blank to calculate from the fields above"
            className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          />
          <p className="mt-1 text-xs text-[#8ea39c]">
            If you already know your BMR (e.g. from a lab test), enter it here to skip the Mifflin–St Jeor
            estimate.
          </p>
        </div>

        <div>
          <label htmlFor="activity" className="mb-1.5 block text-sm font-medium text-[#1c2321]">
            Activity level
          </label>
          <select
            id="activity"
            value={activity}
            onChange={(e) => setActivity(e.target.value)}
            className="min-h-[38px] w-full rounded-lg border border-[#d6e5e0] px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            {Object.entries(ACTIVITY_LEVELS).map(([key, level]) => (
              <option key={key} value={key}>
                {level.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            {error}
          </div>
        )}

        <div>
          <button
            type="button"
            onClick={handleCalculate}
            className="rounded-lg bg-teal-600 px-6 py-2.5 text-sm font-bold text-white transition-colors hover:bg-teal-700 active:bg-teal-800"
          >
            Calculate
          </button>
        </div>
      </div>

      {result && (
        <ResultsPanel
          result={result}
          lifeStage={lifeStage}
          macroTarget={macroTarget}
          onSelectTarget={setMacroTarget}
        />
      )}
    </div>
  )
}
