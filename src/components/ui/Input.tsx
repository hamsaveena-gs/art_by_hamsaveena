import { type InputHTMLAttributes, forwardRef, useId } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;

    return (
      <div className="input-group">
        {label && (
          <label htmlFor={inputId} className="input-label">
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`input ${error ? 'input--error' : ''} ${className}`.trim()}
          {...props}
        />
        {error && <p className="input-error">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
export default Input;
