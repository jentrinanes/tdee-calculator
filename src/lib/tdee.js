// Config-level values (would be app settings/props, not user-facing state)
export const CUT_PCT = 0.2
export const GAIN_PCT = 0.15
export const DEFAULT_UNITS = 'metric'

export const MACRO_PRESETS = {
  balanced: { protein: 0.3, carbs: 0.4, fat: 0.3 },
  highprotein: { protein: 0.4, carbs: 0.3, fat: 0.3 },
  lowcarb: { protein: 0.35, carbs: 0.25, fat: 0.4 },
}
export const DEFAULT_MACRO_PRESET = 'balanced'

export const LIFE_STAGES = {
  standard: { label: 'Standard adult', femaleOnly: false, kcalAdjustment: 0 },
  teen: { label: 'Teen (13–17)', femaleOnly: false, kcalAdjustment: 0 },
  olderAdult: { label: 'Older adult (65+)', femaleOnly: false, kcalAdjustment: 0 },
  pregnant: { label: 'Pregnant (female only)', femaleOnly: true, kcalAdjustment: 340 },
  breastfeeding: { label: 'Breastfeeding (female only)', femaleOnly: true, kcalAdjustment: 400 },
  perimenopause: { label: 'Perimenopause (female only)', femaleOnly: true, kcalAdjustment: 0 },
  menopause: { label: 'Menopause / postmenopause (female only)', femaleOnly: true, kcalAdjustment: -50 },
}

export const LIFE_STAGE_NOTES = {
  teen: 'Teens are still growing — energy needs can vary widely; consult a pediatrician for personalized guidance.',
  olderAdult: 'Energy needs typically decline with age due to loss of muscle mass; prioritize protein intake.',
  pregnant: 'Calorie needs increase to support fetal growth. This estimate adds a standard second/third-trimester adjustment — consult your provider for personalized guidance.',
  breastfeeding: 'Calorie needs increase to support milk production. This estimate adds a standard adjustment — consult your provider for personalized guidance.',
  perimenopause: 'Hormonal shifts during perimenopause can affect metabolism and appetite; monitor how your body responds.',
  menopause: 'Metabolic rate often decreases after menopause. This estimate reflects a modest downward adjustment.',
}

export const ACTIVITY_LEVELS = {
  sedentary: { label: 'Sedentary (little or no exercise)', multiplier: 1.2 },
  light: { label: 'Lightly active (1–3 days/week)', multiplier: 1.375 },
  moderate: { label: 'Moderately active (3–5 days/week)', multiplier: 1.55 },
  active: { label: 'Very active (6–7 days/week)', multiplier: 1.725 },
  extreme: { label: 'Extremely active (hard exercise & physical job)', multiplier: 1.9 },
}

export function ftInToCm(ft, inches) {
  return ft * 30.48 + inches * 2.54
}

export function lbToKg(lb) {
  return lb * 0.453592
}

export function calculateBmr({ gender, age, heightCm, weightKg }) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return gender === 'male' ? base + 5 : base - 161
}

export function calculateResult({
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
}) {
  const hasManualBmr = manualBmr && Number(manualBmr) > 0

  let bmr
  if (hasManualBmr) {
    bmr = Number(manualBmr)
  } else {
    const resolvedHeightCm = units === 'metric' ? Number(heightCm) : ftInToCm(Number(heightFt) || 0, Number(heightIn) || 0)
    const resolvedWeightKg = units === 'metric' ? Number(weightKg) : lbToKg(Number(weightLb) || 0)
    bmr = calculateBmr({ gender, age: Number(age), heightCm: resolvedHeightCm, weightKg: resolvedWeightKg })
  }

  const activityMultiplier = ACTIVITY_LEVELS[activity].multiplier
  const lifeStageAdjustment = LIFE_STAGES[lifeStage].kcalAdjustment
  const tdee = bmr * activityMultiplier + lifeStageAdjustment

  const cut = tdee * (1 - CUT_PCT)
  const maintain = tdee
  const gain = tdee * (1 + GAIN_PCT)

  return {
    bmr,
    usedManualBmr: hasManualBmr,
    tdee,
    lifeStageAdjustment,
    cut,
    maintain,
    gain,
  }
}

export function calculateMacros(kcal, preset = DEFAULT_MACRO_PRESET) {
  const ratios = MACRO_PRESETS[preset]
  return {
    proteinG: Math.round((kcal * ratios.protein) / 4),
    carbsG: Math.round((kcal * ratios.carbs) / 4),
    fatG: Math.round((kcal * ratios.fat) / 9),
    proteinPct: Math.round(ratios.protein * 100),
    carbsPct: Math.round(ratios.carbs * 100),
    fatPct: Math.round(ratios.fat * 100),
  }
}

export function isValidInput({ manualBmr, age, units, heightCm, heightFt, heightIn, weightKg, weightLb }) {
  if (manualBmr && Number(manualBmr) > 0) return true

  const ageOk = Number(age) > 0
  const heightOk =
    units === 'metric' ? Number(heightCm) > 0 : Number(heightFt) > 0 || Number(heightIn) > 0
  const weightOk = units === 'metric' ? Number(weightKg) > 0 : Number(weightLb) > 0

  return ageOk && heightOk && weightOk
}
