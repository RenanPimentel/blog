import React, { DetailedHTMLProps, InputHTMLAttributes } from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Props
  extends DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  > {
  label?: string;
  error: string;
}

function Input({ label, error, ...props }: Props) {
  if (label) {
    return (
      <div className="form-control">
        <label htmlFor={props.id}>{label}</label>
        <div className="container">
          <input
            {...props}
            className={props.className + (error ? " border-red" : "")}
          />
          {error && (
            <span className="error">
              <FaExclamationCircle />
              <div className="error-data-container">
                <span className="error-data">{error}</span>
              </div>
            </span>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <input
        {...props}
        className={props.className + (error ? " border-red" : "")}
      />
      {error && (
        <span className="error" style={{ right: "10px", top: "0px" }}>
          <FaExclamationCircle />
          <div className="error-data-container">
            <span className="error-data">{error}</span>
          </div>
        </span>
      )}
    </div>
  );
}

export default Input;
