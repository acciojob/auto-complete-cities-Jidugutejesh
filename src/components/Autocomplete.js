import React, { useState, useMemo, useEffect, useRef } from "react";

/**
 * Props:
 *  - suggestions: array of strings (cities / street names)
 */
export default function Autocomplete({ suggestions = [] }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);               // show/hide list
  const [activeIndex, setActiveIndex] = useState(-1);    // keyboard selection
  const containerRef = useRef(null);

  // filtered suggestions (case-insensitive, startsWith and includes)
  const filtered = useMemo(() => {
    const q = input.trim().toLowerCase();
    if (!q) return suggestions.slice(0, 8); // show top 8 when empty
    return suggestions
      .filter(s => s.toLowerCase().includes(q))
      .slice(0, 8); // limit results
  }, [input, suggestions]);

  useEffect(() => {
    // close dropdown when clicking outside
    function onDocClick(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function onChange(e) {
    setInput(e.target.value);
    setOpen(true);
    setActiveIndex(-1);
  }

  function onSelect(value) {
    setInput(value);
    setOpen(false);
    setActiveIndex(-1);
  }

  function onKeyDown(e) {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex(i => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex(i => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0 && activeIndex < filtered.length) {
        onSelect(filtered[activeIndex]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIndex(-1);
    }
  }

  // ensure activeIndex stays valid when filtered changes
  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(filtered.length - 1);
  }, [filtered, activeIndex]);

  return (
    <div ref={containerRef} style={{ width: 360, position: "relative", fontFamily: "sans-serif" }}>
      <label style={{ display: "block", marginBottom: 6, fontSize: 14 }}>Enter city or street</label>
      <input
        aria-autocomplete="list"
        aria-expanded={open}
        value={input}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onFocus={() => setOpen(true)}
        placeholder="Type a city..."
        style={{
          width: "100%",
          padding: "10px 12px",
          fontSize: 16,
          borderRadius: 6,
          border: "1px solid #ccc",
          boxSizing: "border-box"
        }}
      />

      {open && filtered.length > 0 && (
        <ul
          role="listbox"
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            position: "absolute",
            left: 0,
            right: 0,
            top: 56,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: 6,
            boxShadow: "0 6px 18px rgba(0,0,0,0.06)",
            maxHeight: 220,
            overflow: "auto",
            zIndex: 10
          }}
        >
          {filtered.map((s, idx) => {
            const isActive = idx === activeIndex;
            return (
              <li
                key={s + idx}
                role="option"
                aria-selected={isActive}
                onMouseDown={(ev) => { ev.preventDefault(); /* prevent blur */ }}
                onClick={() => onSelect(s)}
                onMouseEnter={() => setActiveIndex(idx)}
                style={{
                  padding: "10px 12px",
                  background: isActive ? "#f0f5ff" : "white",
                  cursor: "pointer",
                  borderBottom: "1px solid #f2f2f2",
                }}
              >
                {s}
              </li>
            );
          })}
        </ul>
      )}

      {open && filtered.length === 0 && (
        <div style={{
          position: "absolute",
          top: 56,
          left: 0,
          right: 0,
          padding: 12,
          border: "1px solid #eee",
          borderRadius: 6,
          background: "#fff",
          boxShadow: "0 6px 18px rgba(0,0,0,0.04)",
        }}>
          No results
        </div>
      )}
    </div>
  );
}
