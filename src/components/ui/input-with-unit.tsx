'use client'

interface InputWithUnitProps {
  label: string
  name: string
  value?: number
  defaultValue?: number
  required?: boolean
  min?: number
  options: { value: string; label: string }[]
  hideArrow?: boolean
  onChange?: (value: number) => void
}

export function InputWithUnit({
  label,
  name,
  value,
  defaultValue,
  required,
  min = 0,
  options,
  hideArrow,
  onChange,
}: InputWithUnitProps) {
  return (
    <div className="w-full">
      <label htmlFor={name} className="block text-base font-semibold text-gray-900">
        {label}
      </label>
      <div className="mt-1 relative flex">
        <input
          type="number"
          name={name}
          id={name}
          value={value}
          defaultValue={defaultValue}
          required={required}
          min={min}
          onChange={(e) => onChange?.(Number(e.target.value))}
          className="block w-full rounded-l-md border border-gray-300 px-3.5 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <select
          name={`${name}Unit`}
          className={`w-20 h-[42px] rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-2.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ${
            hideArrow ? 'appearance-none' : ''
          }`}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
} 