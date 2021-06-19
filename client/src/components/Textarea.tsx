import React from "react";
import { FaExclamationCircle } from "react-icons/fa";

interface Props
  extends React.DetailedHTMLProps<
    React.TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  > {
  label: string;
  error: string;
}

function Textarea({ label, error, ...props }: Props) {
  return (
    <div className="form-control">
      <label htmlFor={props.id}>{label}</label>
      <div className="container">
        <textarea {...props} />
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

export default Textarea;
