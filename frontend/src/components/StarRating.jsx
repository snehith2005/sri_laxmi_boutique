import { useState } from "react";

export default function StarRating({ value = 0, onChange, readOnly = false, size = 18 }) {
  const [hover, setHover] = useState(0);
  const stars = [1, 2, 3, 4, 5];
  const active = hover || value;

  return (
    <span className="star-rating" style={{ fontSize: size }}>
      {stars.map((s) => (
        <span
          key={s}
          className={`star ${s <= active ? "star-filled" : ""} ${readOnly ? "" : "star-interactive"}`}
          onMouseEnter={() => !readOnly && setHover(s)}
          onMouseLeave={() => !readOnly && setHover(0)}
          onClick={() => !readOnly && onChange && onChange(s)}
        >
          ★
        </span>
      ))}
    </span>
  );
}
