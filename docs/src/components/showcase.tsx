"use client";

import * as React from "react";
import { Icon, IconButton } from "@mui/index";

interface ShowcaseProps {
  title: string;
  /** Code snippet to display */
  code?: string;
  children: React.ReactNode;
  className?: string;
}

export function Showcase({ title, code, children, className }: ShowcaseProps) {
  const [showCode, setShowCode] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-outline-variant bg-surface-container">
        <h3 className="text-sm font-medium text-surface-foreground">{title}</h3>
        {code && (
          <div className="flex items-center gap-1">
            <IconButton
              variant="standard"
              size="xs"
              aria-label={showCode ? "Hide code" : "Show code"}
              onClick={() => setShowCode(!showCode)}
            >
              <Icon name="code" size={18} />
            </IconButton>
            <IconButton
              variant="standard"
              size="xs"
              aria-label="Copy code"
              onClick={handleCopy}
            >
              <Icon name={copied ? "check" : "content_copy"} size={18} />
            </IconButton>
          </div>
        )}
      </div>

      {/* Preview */}
      <div
        className={`p-6 bg-surface-container-low flex flex-wrap items-center gap-4 ${className ?? ""}`}
      >
        {children}
      </div>

      {/* Code block */}
      {showCode && code && (
        <div className="border-t border-outline-variant bg-surface-container-highest overflow-x-auto">
          <pre className="p-4 text-[13px] leading-5 font-mono text-surface-foreground">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}

/**
 * Interactive Playground — lets users toggle props and see the result.
 */
interface PlaygroundProps {
  title: string;
  /** Controls to render (radio groups, checkboxes, selects) */
  controls: React.ReactNode;
  /** The live component preview */
  children: React.ReactNode;
  /** Generated code based on current props */
  code?: string;
}

export function Playground({ title, controls, children, code }: PlaygroundProps) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="rounded-2xl border border-outline-variant overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-outline-variant bg-surface-container">
        <h3 className="text-sm font-medium text-surface-foreground">{title}</h3>
      </div>

      <div className="flex flex-col lg:flex-row">
        {/* Preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-surface-container-low min-h-40">
          {children}
        </div>

        {/* Controls */}
        <div className="w-full lg:w-72 border-t lg:border-t-0 lg:border-l border-outline-variant bg-surface-container p-4 space-y-4">
          <p className="text-[11px] font-medium uppercase tracking-wider text-surface-variant-foreground">
            Props
          </p>
          {controls}
        </div>
      </div>

      {/* Code output */}
      {code && (
        <div className="border-t border-outline-variant bg-surface-container-highest overflow-x-auto">
          <div className="flex items-center justify-between px-4 py-1.5 border-b border-outline-variant">
            <span className="text-[11px] font-medium uppercase tracking-wider text-surface-variant-foreground">
              Code
            </span>
            <IconButton
              variant="standard"
              size="xs"
              aria-label="Copy code"
              onClick={handleCopy}
            >
              <Icon name={copied ? "check" : "content_copy"} size={18} />
            </IconButton>
          </div>
          <pre className="p-4 text-[13px] leading-5 font-mono text-surface-foreground">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
