import * as React from "react";

const RadioGroup = ({
  value,
  onValueChange,
  children,
  className = "",
  ...props
}) => {
  return (
    <div role="radiogroup" className={className} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            groupValue: value,
            onValueChange,
          });
        }
        return child;
      })}
    </div>
  );
};

const RadioGroupItem = React.forwardRef(
  ({ value, groupValue, onValueChange, className = "", ...props }, ref) => {
    const isChecked = groupValue === value;

    return (
      <button
        type="button"
        role="radio"
        aria-checked={isChecked}
        ref={ref}
        onClick={() => onValueChange && onValueChange(value)}
        className={`h-4 w-4 rounded-full border border-primary text-primary ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...props}
      >
        <span className={`flex items-center justify-center w-full h-full`}>
          {isChecked && <span className="h-2 w-2 rounded-full bg-primary" />}
        </span>
      </button>
    );
  }
);
RadioGroupItem.displayName = "RadioGroupItem";

export { RadioGroup, RadioGroupItem };
