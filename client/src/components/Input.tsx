import React, {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from "react";
import { TextareaHTMLAttributes } from "react";

interface Props {
  maxChars: number;
  minChars: number;
  label: string;
  value: string;
  setValue: CallableFunction;
  error: string;
  textArea: boolean;
  errorTimeSpan: number;
  constraints: boolean[];
  setError: CallableFunction;
  inputDetails: DetailedHTMLProps<
    InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >;
  textAreaDetails: DetailedHTMLProps<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    HTMLTextAreaElement
  >;
}

const getRandomNumber = (min = 0, max = 10) => {
  return Math.floor(Math.random() * (max - min) + min);
};

const getHtmlId = (len = 20) => {
  let output = "";
  for (let i = 0; i < len; i++) {
    output += getRandomNumber();
  }
  return output;
};

function Input({
  label,
  maxChars,
  minChars,
  error,
  setValue,
  value,
  textArea,
  errorTimeSpan,
  constraints,
  setError,
  inputDetails,
  textAreaDetails,
}: Props) {
  const [htmlId] = useState(getHtmlId());
  const [stopDefault, setStopDefault] = useState(false);
  const [showError, setShowError] = useState(Boolean(error));

  useEffect(() => {
    setStopDefault(
      Boolean(error) ||
        value.length > maxChars ||
        value.length < minChars ||
        constraints.some(Boolean)
    );
  }, [constraints, error, maxChars, minChars, value]);

  useEffect(() => {
    if (stopDefault) setValue(value.trim().slice(0, maxChars));
  }, [maxChars, setValue, stopDefault, value]);

  useEffect(() => {
    setShowError(Boolean(error));

    setTimeout(() => {
      setError("");
      setShowError(false);
    }, errorTimeSpan || 3000);
  }, [error, errorTimeSpan, setError]);

  return (
    <section className="input-wrapper">
      <label htmlFor={htmlId}>{label}</label>
      <div className="input-container">
        {textArea ? (
          <textarea
            {...textAreaDetails}
            className={`${textAreaDetails.className || ""} ${
              stopDefault ? "border-red" : ""
            }`}
            onChange={e => setValue(e.target.value)}
            value={value}
            id={htmlId}
          />
        ) : (
          <input
            {...inputDetails}
            className={`${inputDetails.className || ""} ${
              stopDefault ? "border-red" : ""
            }`}
            onChange={e => setValue(e.target.value)}
            value={value}
            id={htmlId}
          />
        )}
        {showError && (
          <div className="error-container">
            <span className="error">
              {error.length > maxChars / 2
                ? `${error.slice(0, Math.floor(maxChars / 2))}...`
                : error}
            </span>
          </div>
        )}
      </div>
    </section>
  );
}

Input.defaultProps = {
  maxChars: 64,
  minChars: 0,
  inputDetails: {
    className: "input",
    type: "text",
  },
  textArea: false,
  errorTimeSpan: 0,
  constraints: [] as Boolean[],
} as Props;

export default Input;
