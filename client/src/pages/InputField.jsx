const InputField = ({
  Icon,
  placeholder,
  type = "text",
  value,
  onChange,
  onFocus,
  onBlur,
  error,
  touched
}) => (
  <div className="flex flex-col gap-1 mb-4">
    <div
      className={`group flex items-center gap-3 px-4 py-3 rounded-xl transition border
      bg-white/80 backdrop-blur-sm shadow-sm
      ${touched && error ? "border-rose-300 focus-within:border-rose-400" : "border-slate-200 focus-within:border-indigo-300"}`}
    >
      <Icon
        size={20}
        className={`${touched && error ? "text-rose-400" : "text-slate-500"} group-focus-within:text-indigo-500`}
      />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
        onBlur={onBlur}
        required
        className="w-full bg-transparent outline-none text-sm text-slate-900 placeholder-slate-500"
      />
      {touched && error && <span className="text-xs text-rose-400 font-medium">!</span>}
    </div>
    {touched && error && (
      <p className="text-xs text-rose-500 px-1">{error}</p>
    )}
  </div>
);

export default InputField;
