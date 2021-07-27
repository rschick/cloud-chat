import { useCallback, useState } from "react";
import InputGroup from "react-bootstrap/InputGroup";
import Search from "@icons/Search";
import Close from "@icons/Close";

export default function SearchInput({
  value,
  onChange = () => {},
  searching,
  onSearchingChange = () => {},
}) {
  const handleFocus = useCallback(() => {
    if (!searching) {
      onSearchingChange(true);
    }
  }, [searching]);

  const handleBlur = useCallback(() => {
    if (!value && searching) {
      onSearchingChange(false);
    }
  }, [value, searching]);

  const handleClose = useCallback(() => {
    if (value) {
      onChange("");
      onSearchingChange(false);
    }
  }, [value]);

  const handleChange = useCallback((event) => {
    onChange(event.target.value);
  }, []);

  return (
    <InputGroup>
      <style jsx>{`
        .close {
          position: absolute;
          right: 0.45rem;
          top: 0.25rem;
          z-index: 1000;
        }

        .search {
          position: absolute;
          z-index: 1000;
          left: 0.45rem;
          top: 0.25rem;
        }

        .input {
          padding-left: 2rem;
        }
      `}</style>

      <span className="search text-secondary">
        <Search />
      </span>
      <input
        className="form-control rounded-3 input"
        placeholder="Search"
        onFocus={handleFocus}
        onBlur={handleBlur}
        value={value}
        onChange={handleChange}
      />
      {searching && (
        <span className="close">
          <button
            className="bg-white border-0 text-secondary"
            onClick={handleClose}
          >
            <Close />
          </button>
        </span>
      )}
    </InputGroup>
  );
}
