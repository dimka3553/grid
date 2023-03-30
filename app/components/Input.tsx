type TextInputProps = {
  placeholder?: string;
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  type?: "text" | "email" | "password" | "number";
  className?: string;
  unit?: React.ReactNode;
  disabled?: boolean;
  label?: string;
  min?: string;
  max?: string;
  onRelease?: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export default function TextInput({
  placeholder,
  value,
  onChange,
  type = "text",
  className,
  unit,
  disabled,
  label,
  min,
  max,
  onRelease,
}: TextInputProps) {
  return (
    <div>
      {label && <p className="text-xs font-medium text-slate-500">{label}</p>}
      <div className={className}>
        <div className="mt-1 flex items-center">
          {unit && (
            <div className="h-10 flex items-center px-2 bg-slate-100 font-bold border-r text-[14px] border-1 border-slate-200 max-w-[90px] ">
              {unit}
            </div>
          )}
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="bg-slate-100 rounded-none appearance-none w-full h-10 px-4 font-bold"
            disabled={disabled}
            min={min}
            max={max}
            onBlur={onRelease}
          />
        </div>
      </div>
    </div>
  );
}
