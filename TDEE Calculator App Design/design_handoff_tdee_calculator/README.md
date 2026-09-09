# Handoff: TDEE Calculator

## Overview
A single-page calorie/energy calculator. Users enter sex, units, age, height, weight, life stage, and activity level; the app computes BMR (Mifflin–St Jeor), TDEE, three calorie targets (cut/maintain/gain), and a macro split for whichever target is selected.

## About the Design Files
The bundled file (`TDEE Calculator.dc.html`) is a **design reference** built in this tool's own component format (custom template syntax, a `support.js` runtime) — it is not framework source to copy as-is. Recreate the design and behavior described below in the target codebase's existing stack (React, Vue, plain JS, etc.), or choose an appropriate stack if none exists yet.

## Fidelity
**High-fidelity.** Colors, spacing, type sizes, and copy below are final; implement pixel-close using Tailwind CSS (already the styling choice) or the codebase's equivalent utility system.

## Screens / Views
Single screen, no routing.

### Layout
- Page: `min-h-screen`, background `#f1f7f5`, text `#1c2321`, `font-sans`. Content column `max-width: 768px` (`max-w-3xl`), centered, horizontal padding `16px` mobile / `24px` desktop, vertical padding `32px` mobile / `48px` desktop.
- Header: eyebrow label "Energy needs" (11px uppercase, teal-600, tracked), `<h1>` "TDEE Calculator" (30–36px bold), subhead paragraph (14px, `#5b6b66`, max-width ~576px).
- Form card: white background, `1px solid #d6e5e0` border, `12px` radius, `20–24px` padding, `shadow-sm`, vertical gap `20px` between fields.
- Results section (appears after Calculate, same column width): grid of cards, gap `24px` between groups.

### Form fields (top to bottom)
1. **Sex** — 2-segment toggle button group (Female / Male). Active segment: teal-600 bg, white text. Inactive: white bg, `#3d4a46` text, hover teal-50.
2. **Units** — 2-segment toggle (Metric / Imperial), same style as Sex.
3. **Age (years)** — number input, placeholder "e.g. 32".
4. **Life stage** — select dropdown. Options, filtered to exclude female-only stages when Sex = Male:
   - Standard adult (default)
   - Teen (13–17)
   - Older adult (65+)
   - Pregnant (female only)
   - Breastfeeding (female only)
   - Perimenopause (female only)
   - Menopause / postmenopause (female only)
5. **Height** — cm input if Metric; ft + in two inputs side by side if Imperial.
6. **Weight** — kg input if Metric; lb input if Imperial.
7. **Known BMR (optional, kcal/day)** — number input, placeholder "Leave blank to calculate from the fields above". Helper text below in 12px `#8ea39c`: "If you already know your BMR (e.g. from a lab test), enter it here to skip the Mifflin–St Jeor estimate."
8. **Activity level** — select dropdown, 5 options: Sedentary (little or no exercise), Lightly active (1–3 days/week), Moderately active (3–5 days/week), Very active (6–7 days/week), Extremely active (hard exercise & physical job).
9. **Error banner** (conditional) — amber-50 background, amber-200 border, amber-800 text, shown when required fields are missing.
10. **Calculate button** — teal-600 bg, white text, bold 14px, `24px` horizontal / `10px` vertical padding, `8px` radius, hover teal-700 / active teal-800.

All text inputs/selects: `1px solid #d6e5e0` border, `8px` radius, `12px`/`8px` padding, `14px` font, min-height 38px, focus ring 2px teal-500 + teal-500 border.

### Results (shown after Calculate)
- **BMR card**: white bg, border `#d6e5e0`, label "Basal Metabolic Rate" (10px uppercase `#5b6b66`), value 30px bold + "kcal/day" (14px `#8ea39c`), caption line: either "Estimated via Mifflin–St Jeor." or "Using the BMR you entered." (if manual BMR was used).
- **TDEE card**: teal-50 bg, teal-200 border, label "Total Daily Energy Expenditure" (teal-600), same value styling, caption "BMR plus your activity level" (+ " plus a life-stage adjustment" when the selected life stage carries a kcal offset).
- **Calorie targets**: heading "Calorie targets" + helper "Select a target to see its macro split below." (12px `#8ea39c`). Three clickable cards in a row (stack on mobile): Lose weight = TDEE × (1 − cutPct), Maintain = TDEE, Gain weight = TDEE × (1 + gainPct). Selected card: teal-50 bg / teal-200 border / teal-600 label; unselected: white bg / `#d6e5e0` border / `#5b6b66` label, hover teal-50/40. Only one selectable at a time (default: Maintain).
- **Macro split table**: heading "Macro split at {selected target label}" (e.g. "at maintenance" / "at lose weight" / "at gain weight"). Three-column table: Protein — {pct}%, Carbs — {pct}%, Fat — {pct}% headers (11px uppercase `#5b6b66`, bottom border), grams as 18px bold values below. Macro grams are computed from the **selected target's** calories, not always TDEE.
- **Life-stage note** (conditional) — 14px `#5b6b66` paragraph, shown for stages with guidance text (teen, older adult, pregnant, breastfeeding, perimenopause, menopause).
- Footer: 12px `#8ea39c`, "Estimates only, not medical advice. Formula: Mifflin–St Jeor (1990)."

## Interactions & Behavior
- **Trigger**: calculation runs only on explicit "Calculate" click — no live recompute as fields change.
- **Validation**: if no manual BMR is provided, age, height, and weight must all be > 0, else show the error banner and clear any prior result.
- **Sex toggle**: switching to Male while Life stage is one of pregnant/breastfeeding/perimenopause/menopause resets Life stage to "Standard adult".
- **Units toggle**: switches which height/weight inputs render (cm vs ft+in, kg vs lb); does not convert values already typed.
- **Calorie target selection**: clicking a target card re-renders the macro table for that target's calories — no page recalculation, purely a client-side re-derivation from the last calculated TDEE/cut/gain values.
- **Responsive**: 3-column grids (sex/units/age row; height/weight row; target cards) collapse to 1 column below the `sm` breakpoint (~640px). Height ft/in inputs stay side-by-side at all widths.

## Formulas
- **BMR (Mifflin–St Jeor)**:
  - Male: `10×weight(kg) + 6.25×height(cm) − 5×age + 5`
  - Female: `10×weight(kg) + 6.25×height(cm) − 5×age − 161`
  - Imperial → metric: `heightCm = ft×30.48 + in×2.54`; `weightKg = lb×0.453592`
  - If "Known BMR" is filled (>0), it overrides the formula result entirely and skips the age/height/weight requirement.
- **Life-stage kcal adjustment** (added to TDEE, after activity multiplier):
  - Standard / Teen / Older adult / Perimenopause: 0
  - Pregnant: +340
  - Breastfeeding: +400
  - Menopause / postmenopause: −50
- **Activity multipliers** (applied to BMR): Sedentary ×1.2, Lightly active ×1.375, Moderately active ×1.55, Very active ×1.725, Extremely active ×1.9.
- **TDEE** = `BMR × activityMultiplier + lifeStageAdjustment`
- **Calorie targets**: Cut = `TDEE × (1 − cutPct)`, Maintain = `TDEE`, Gain = `TDEE × (1 + gainPct)`. Defaults: cutPct = 20%, gainPct = 15% (both configurable, see Design Tokens).
- **Macro split** (grams from the selected target's calories): Protein g = `(kcal × proteinRatio) / 4`, Carbs g = `(kcal × carbRatio) / 4`, Fat g = `(kcal × fatRatio) / 9`. Macro presets (protein/carb/fat ratios): Balanced 30/40/30, High protein 40/30/30, Low carb 35/25/40. Default preset: Balanced.

## State Management
Local component state (no backend/persistence):
- `gender`: 'female' | 'male'
- `units`: 'metric' | 'imperial'
- `lifeStage`: one of the 7 stage keys
- `age`, `heightCm`, `heightFt`, `heightIn`, `weightKg`, `weightLb`, `manualBmr`: string/number inputs
- `activity`: one of the 5 activity keys
- `macroTarget`: 'cut' | 'maintain' | 'gain' (default 'maintain')
- `result`: null until Calculate is clicked, then holds bmr, tdee, cut, maintain, gain, and derived macro fields
- `error`: validation message string

Config-level values (would be app settings/props, not user-facing state): `macroPreset` (balanced/highprotein/lowcarb), `cutPct` (5–25%, default 20), `gainPct` (5–25%, default 15), `defaultUnits` (metric/imperial).

## Design Tokens
- **Colors**: background `#f1f7f5`; text `#1c2321`; muted text `#5b6b66`; faint text `#8ea39c`; borders `#d6e5e0`; accent (teal) — Tailwind `teal-50`/`teal-200`/`teal-600`/`teal-700`/`teal-800`; error — Tailwind `amber-50`/`amber-200`/`amber-800`; white `#ffffff`.
- **Typography**: system sans stack (Tailwind default `font-sans`). Sizes used: 36px (h1 desktop) / 30px (h1 mobile), 30px (result values), 20px (section h3), 18px (macro grams), 14px (body/inputs), 12–13px (captions/helpers), 11px (table headers), 10px (card eyebrow labels). Weights: bold for headings/values, semibold for eyebrow labels/buttons, normal for body/captions.
- **Radius**: 12px (cards/form), 8px (inputs, buttons, small cards).
- **Shadow**: Tailwind `shadow-sm` on the form card and result cards.
- **Spacing scale**: 12px, 16px, 20px, 24px, 32px, 40px gaps/padding as noted above.

## Assets
None — no images or icons used.

## Files
- `TDEE Calculator.dc.html` — full design source (template + logic class) for the screen described above.
