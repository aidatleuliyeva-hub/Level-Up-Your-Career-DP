// F:\gopro\levelup-frontend\src\components\ui\Modal.jsx
import React, { useEffect } from "react";
import "./Modal.css";

export default function Modal({ open, onClose, title, children, width = 480 }) {
  //   ESC
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-container"
        style={{ maxWidth: width }}
        onClick={(e) => e.stopPropagation()}
      >
        {title && <h2 className="modal-title">{title}</h2>}

        <div className="modal-content">{children}</div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
