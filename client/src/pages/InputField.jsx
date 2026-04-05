import React from "react";

const InputField = ({
  Icon: IconComponent,
  placeholder,
  type = "text",
  value,
  onChange
}) => (
  <div
    className="group flex items-center gap-3 mb-4
    px-4 py-3 rounded-xl
    bg-white/10 border border-white/20
    focus-within:border-indigo-400 transition"
  >
    {IconComponent
      ? React.createElement(IconComponent, {
          size: 20,
          className: "text-gray-400 group-focus-within:text-indigo-400",
        })
      : null}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full bg-transparent outline-none
      text-sm text-white placeholder-gray-400"
    />
  </div>
);

export default InputField;
