import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AnalysisPanel from "./AnalysisPanel";
import LoadingOverlay from "./LoadingOverlay";

const severityStyles = {
  high: {
    border: "#EF4444",
    bg: "rgba(239,68,68,0.18)",
    hover: "rgba(239,68,68,0.32)",
    dot: "#EF4444",
    label: "#EF4444",
    labelBg: "rgba(239,68,68,0.15)",
  },
  medium: {
    border: "#F59E0B",
    bg: "rgba(245,158,11,0.15)",
    hover: "rgba(245,158,11,0.28)",
    dot: "#F59E0B",
    label: "#F59E0B",
    labelBg: "rgba(245,158,11,0.12)",
  },
};

function HeatmapBox({ annotation, index, onClick, isSelected }) {
  const { zone, severity } = annotation;
  const s = severityStyles[severity] || severityStyles.medium;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: index * 0.08 }}
      onClick={() => onClick(annotation)}
      whileHover={{ backgroundColor: s.hover }}
      style={{
        position: "absolute",
        left: `${zone.xPercent}%`,
        top: `${zone.yPercent}%`,
        width: `${zone.widthPercent}%`,
        height: `${zone.heightPercent}%`,
        border: `2px solid ${s.border}`,
        backgroundColor: isSelected ? s.hover : s.bg,
        borderRadius: "6px",
        cursor: "pointer",
        boxSizing: "border-box",
        transition: "background-color 0.15s",
        zIndex: isSelected ? 50 : 10,
      }}
    >
      {/* Number Badge */}
      <div
        style={{
          position: "absolute",
          top: "-12px",
          left: "-12px",
          width: "24px",
          height: "24px",
          backgroundColor: s.border,
          color: "white",
          fontSize: "12px",
          fontWeight: "800",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "50%",
          boxShadow: "0 2px 6px rgba(0,0,0,0.4)",
          zIndex: 20,
        }}
      >
        {index + 1}
      </div>

      {/* Pulse dot (hidden if we have a badge, or we can keep it inside the box) */}
      <motion.div
        animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
        transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: s.dot,
        }}
      />
    </motion.div>
  );
}

export default function ImagePreview({
  imageUrl,
  analyzing,
  annotations,
  error,
  selectedAnnotation,
  onAnnotationClick,
  onAnalyze,
  onReset,
  onClosePanel,
}) {
  const imageContainerRef = useRef(null);
  const hasAnnotations = annotations.length > 0;
  const highCount = annotations.filter((a) => a.severity === "high").length;
  const mediumCount = annotations.filter((a) => a.severity === "medium").length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        width: "100%",
        maxWidth: "1280px",
        margin: "0 auto",
        padding: "24px 16px 48px",
        boxSizing: "border-box",
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          marginBottom: "16px",
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div>
          <h2
            style={{
              color: "white",
              fontWeight: "700",
              fontSize: "20px",
              margin: 0,
            }}
          >
            {hasAnnotations
              ? `${annotations.length} confusion zones detected`
              : "Screenshot uploaded"}
          </h2>
          <p style={{ color: "#6B7280", fontSize: "13px", marginTop: "4px" }}>
            {hasAnnotations
              ? "Click any highlighted zone to see AI reasoning and fix suggestions"
              : "Click Analyze to detect UX confusion zones with AI"}
          </p>
        </div>

        <motion.button
          onClick={onReset}
          whileHover={{ borderColor: "#7C3AED", color: "white" }}
          whileTap={{ scale: 0.96 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            padding: "8px 14px",
            borderRadius: "8px",
            fontSize: "13px",
            color: "#6B7280",
            border: "1px solid #2D2D3D",
            background: "transparent",
            cursor: "pointer",
            transition: "all 0.15s",
            flexShrink: 0,
          }}
        >
          ✕ Upload new
        </motion.button>
      </div>

      {/* Error banner */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            style={{
              marginBottom: "14px",
              padding: "10px 16px",
              borderRadius: "10px",
              backgroundColor: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
              color: "#FCA5A5",
              fontSize: "13px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>⚠ {error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main layout: image + side panel */}
      <motion.div
        layout
        style={{
          display: "flex",
          gap: "16px",
          alignItems: "flex-start",
          flexWrap: "wrap",
        }}
      >
        {/* Image container */}
        <motion.div
          layout
          style={{
            flex: "1 1 320px",
            borderRadius: "16px",
            overflow: "hidden",
            border: "1px solid #2D2D3D",
            backgroundColor: "#1A1A24",
            minWidth: 0,
            width: "100%",
          }}
        >
          {/* Browser bar */}
          <div
            style={{
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              borderBottom: "1px solid #2D2D3D",
            }}
          >
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#EF4444",
                opacity: 0.8,
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#F59E0B",
                opacity: 0.8,
              }}
            />
            <div
              style={{
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: "#22C55E",
                opacity: 0.8,
              }}
            />
            <span
              style={{
                marginLeft: "10px",
                fontSize: "11px",
                color: "#6B7280",
                fontFamily: "monospace",
              }}
            >
              uploaded-screenshot.png
            </span>
            {hasAnnotations && (
              <div style={{ marginLeft: "auto", display: "flex", gap: "6px" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#EF4444",
                    backgroundColor: "rgba(239,68,68,0.1)",
                    padding: "2px 8px",
                    borderRadius: "99px",
                  }}
                >
                  {highCount} high
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: "600",
                    color: "#F59E0B",
                    backgroundColor: "rgba(245,158,11,0.1)",
                    padding: "2px 8px",
                    borderRadius: "99px",
                  }}
                >
                  {mediumCount} medium
                </span>
              </div>
            )}
          </div>

          {/* Image + overlay */}
          <div
            ref={imageContainerRef}
            style={{ position: "relative", width: "100%" }}
          >
            <img
              src={imageUrl}
              alt="Uploaded UI"
              style={{
                width: "100%",
                display: "block",
                objectFit: "contain",
                maxHeight: "72vh",
              }}
            />

            {/* Heatmap boxes */}
            <AnimatePresence>
              {hasAnnotations &&
                annotations.map((annotation, i) => (
                  <HeatmapBox
                    key={annotation.id}
                    annotation={annotation}
                    index={i}
                    onClick={onAnnotationClick}
                    isSelected={selectedAnnotation?.id === annotation.id}
                  />
                ))}
            </AnimatePresence>

            {/* Loading overlay */}
            <LoadingOverlay visible={analyzing} />
          </div>
        </motion.div>

        {/* Right panel */}
        <motion.div
          layout
          style={{
            width: "100%",
            maxWidth: "500px",
            borderRadius: "16px",
            border: "1px solid #2D2D3D",
            backgroundColor: "#1A1A24",
            display: "flex",
            flexDirection: "column",
            flex: "1 1 280px",
          }}
        >
          {/* Panel header */}
          <div
            style={{ padding: "14px 18px", borderBottom: "1px solid #2D2D3D" }}
          >
            <p
              style={{
                color: "white",
                fontWeight: "600",
                fontSize: "14px",
                margin: 0,
              }}
            >
              AI Analysis
            </p>
            <p style={{ color: "#6B7280", fontSize: "12px", marginTop: "2px" }}>
              Confusion zone detector
            </p>
          </div>

          {/* Panel body */}
          <div style={{ flex: 1, padding: "16px 18px", overflowY: "auto" }}>
            {!hasAnnotations ? (
              /* Empty state */
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  textAlign: "center",
                  paddingTop: "20px",
                }}
              >
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{
                    repeat: Infinity,
                    duration: 2.5,
                    ease: "easeInOut",
                  }}
                  style={{
                    width: "52px",
                    height: "52px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(124,58,237,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "14px",
                  }}
                >
                  <svg
                    width="24"
                    height="24"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="#7C3AED"
                    strokeWidth={1.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"
                    />
                  </svg>
                </motion.div>
                <p
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: "14px",
                    marginBottom: "6px",
                  }}
                >
                  Ready to analyze
                </p>
                <p
                  style={{
                    color: "#6B7280",
                    fontSize: "12px",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                  }}
                >
                  AI will scan for confusion zones, unclear labels, hierarchy
                  issues, and contrast problems.
                </p>
                <div style={{ width: "100%", textAlign: "left" }}>
                  {[
                    { color: "#EF4444", label: "High confusion areas" },
                    { color: "#F59E0B", label: "Medium friction points" },
                    { color: "#7C3AED", label: "Hierarchy issues" },
                  ].map((item) => (
                    <div
                      key={item.label}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        marginBottom: "8px",
                      }}
                    >
                      <div
                        style={{
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: item.color,
                          flexShrink: 0,
                        }}
                      />
                      <span style={{ fontSize: "12px", color: "#6B7280" }}>
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              /* Zones list */
              <div
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <p
                  style={{
                    fontSize: "11px",
                    color: "#6B7280",
                    marginBottom: "4px",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                  }}
                >
                  Click a zone to inspect
                </p>
                {annotations.map((ann, i) => {
                  const s =
                    severityStyles[ann.severity] || severityStyles.medium;
                  const isActive = selectedAnnotation?.id === ann.id;
                  return (
                    <motion.div
                      key={ann.id}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      onClick={() => onAnnotationClick(ann)}
                      whileHover={{ borderColor: s.border }}
                      style={{
                        padding: "10px 12px",
                        borderRadius: "10px",
                        border: `1px solid ${isActive ? s.border : "#2D2D3D"}`,
                        backgroundColor: isActive ? s.bg : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          marginBottom: "4px",
                        }}
                      >
                        <div
                          style={{
                            width: "18px",
                            height: "18px",
                            borderRadius: "50%",
                            backgroundColor: s.border,
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "10px",
                            fontWeight: "800",
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            color: "white",
                          }}
                        >
                          {ann.title}
                        </span>
                        <span
                          style={{
                            marginLeft: "auto",
                            fontSize: "10px",
                            fontWeight: "600",
                            color: s.label,
                            backgroundColor: s.labelBg,
                            padding: "1px 6px",
                            borderRadius: "99px",
                            textTransform: "uppercase",
                            flexShrink: 0,
                          }}
                        >
                          {ann.severity}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: "11px",
                          color: "#6B7280",
                          margin: 0,
                          lineHeight: "1.4",
                        }}
                      >
                        {ann.explanation.length > 65
                          ? ann.explanation.slice(0, 65) + "…"
                          : ann.explanation}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Analyze button */}
          <div style={{ padding: "14px 18px", borderTop: "1px solid #2D2D3D" }}>
            <motion.button
              onClick={onAnalyze}
              disabled={analyzing}
              whileHover={analyzing ? {} : { opacity: 0.88 }}
              whileTap={analyzing ? {} : { scale: 0.97 }}
              style={{
                width: "100%",
                padding: "12px",
                borderRadius: "12px",
                border: "none",
                backgroundColor: analyzing ? "#4B3B8C" : "#7C3AED",
                color: "white",
                fontSize: "14px",
                fontWeight: "600",
                cursor: analyzing ? "not-allowed" : "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                transition: "background-color 0.15s",
              }}
            >
              {analyzing ? (
                <>
                  <div
                    style={{
                      width: "14px",
                      height: "14px",
                      borderRadius: "50%",
                      border: "2px solid rgba(255,255,255,0.3)",
                      borderTop: "2px solid white",
                      animation: "spin 0.75s linear infinite",
                    }}
                  />
                  Analyzing…
                </>
              ) : hasAnnotations ? (
                "Re-analyze"
              ) : (
                "Analyze with AI"
              )}
            </motion.button>
          </div>
        </motion.div>
      </motion.div>

      {/* Floating detail panel */}
      <AnimatePresence>
        {selectedAnnotation && (
          <AnalysisPanel
            key={selectedAnnotation.id}
            annotation={selectedAnnotation}
            onClose={onClosePanel}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
