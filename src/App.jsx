import Calculator from './components/Calculator'

export default function App() {
  return (
    <div className="min-h-screen bg-[#f1f7f5] font-sans text-[#1c2321]">
      <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12">
        <header className="mb-8">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-teal-600">Energy needs</p>
          <h1 className="mt-1 text-3xl font-bold sm:text-4xl">TDEE Calculator</h1>
          <p className="mt-2 max-w-xl text-sm text-[#5b6b66]">
            Estimate your Basal Metabolic Rate and Total Daily Energy Expenditure using the Mifflin–St Jeor
            equation.
          </p>
        </header>

        <Calculator />
      </div>
    </div>
  )
}
