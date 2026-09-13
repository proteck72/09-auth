"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h2>Could not load notes for this filter!</h2>
      <button
        onClick={() => reset()}
        style={{
          marginTop: "16px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        Try again
      </button>
    </div>
  );
}