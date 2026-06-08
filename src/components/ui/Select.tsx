import { type SelectHTMLAttributes, forwardRef, useId } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
};

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, id, options, placeholder, className = '', ...props }, ref) => {
    const generatedId = useId();
    const selectId = id ?? generatedId;

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={selectId} className="input-label">
            {label}
          </label>
        )}
        <select
          ref={ref}
          id={selectId}
          className={`select ${error ? 'input--error' : ''} ${className}`.trim()}
          {...props}
        >
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';
export default Select;
