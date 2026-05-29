"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconPlus, IconChevronLeft, IconLayoutSidebar,
  IconFiles, IconSparkles, IconPlugConnected, IconMessage,
  IconRocket, IconChartBar, IconCode, IconUser,
  IconShare, IconSettings, IconTerminal2, IconServer2,
  IconPencil, IconCopy, IconCheck, IconX,
  IconAlertCircle, IconLoader2, IconBolt, IconSend,
  IconBrandSlack,
} from "@tabler/icons-react";
import LiveChatSettingsModal from "@/components/modal/LiveChatSettingsModal";

/* ── Mock data ──────────────────────────────────────────────────────────────── */
const AGENT_ID   = "95211";
const AGENT_KEY  = "7390ddddafa2f53b0631eec69707e438";
const TAKEN_BY_OTHERS = new Set(["support","sales-bot","help-center","demo","test-agent","assistant","chat","bot","ai","agent"]);
const INITIAL_PREFIX  = "miodgnfg8e";

type InputStatus = "idle" | "invalid" | "checking" | "taken" | "available" | "own";

function validateFormat(v: string) {
  return v.length >= 1 && v.length <= 63 && /^[a-z0-9][a-z0-9-]*$/.test(v);
}

/* ── Taken suggestions helper ───────────────────────────────────────────────── */
function getSuggestions(taken: string): string[] {
  return ["-2", "-help", "-chat"]
    .map(s => taken + s)
    .filter(s => validateFormat(s) && !TAKEN_BY_OTHERS.has(s))
    .slice(0, 3);
}

/* ── Edit modal ─────────────────────────────────────────────────────────────── */
function EditModal({
  currentPrefix,
  ownedHistory,
  onClose,
  onSave,
}: {
  currentPrefix: string;
  ownedHistory: Set<string>;
  onClose: () => void;
  onSave: (v: string) => void;
}) {
  const [val, setVal]             = useState(currentPrefix);
  const [status, setStatus]       = useState<InputStatus>("idle");
  const [focused, setFocused]     = useState(false);
  const [hasBeenValid, setHasBeenValid] = useState(false);
  const inputRef  = useRef<HTMLInputElement>(null);
  const mirrorRef = useRef<HTMLSpanElement>(null);
  const timerRef  = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => { inputRef.current?.focus(); inputRef.current?.select(); }, []);

  function handleChange(raw: string) {
    const v = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setVal(v);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (!v)                 { setStatus("idle");    return; }
    if (!validateFormat(v)) { setStatus("invalid"); return; }
    if (v === currentPrefix){ setStatus("idle");    return; }
    setStatus("checking");
    timerRef.current = setTimeout(() => {
      if (ownedHistory.has(v) && v !== currentPrefix) {
        setStatus("own"); setHasBeenValid(true);
      } else if (TAKEN_BY_OTHERS.has(v)) {
        setStatus("taken");
      } else {
        setStatus("available"); setHasBeenValid(true);
      }
    }, 550);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" && canSave) onSave(val);
  }

  const canSave = (status === "available" || status === "own") && val !== currentPrefix;
  const suggestions = status === "taken" ? getSuggestions(val) : [];

  const isErr       = status === "invalid" || status === "taken";
  const borderColor = isErr ? "var(--cg-danger)" : focused ? "var(--cg-primary)" : "var(--cg-border)";
  const ringColor   = isErr
    ? (focused ? "rgba(234,84,85,0.16)" : "transparent")
    : focused ? "var(--cg-primary-16)" : "transparent";

  return (
    <div
      style={{
        position: "fixed", inset: 0,
        background: "rgba(23,23,23,0.5)",
        zIndex: 50,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "var(--cg-sp-6)",
      }}
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      {/* Close X */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        style={{
          position: "absolute",
          top: "calc(50% - 164px)", right: "calc(50% - 274px)",
          width: 32, height: 32,
          borderRadius: "var(--cg-radius)",
          border: "1px solid var(--cg-border)",
          background: "var(--cg-bg-card)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer", color: "var(--cg-fg-3)",
          boxShadow: "var(--cg-shadow-sm)",
          transition: "background var(--cg-dur-fast)",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--cg-gray-100)")}
        onMouseLeave={e => (e.currentTarget.style.background = "var(--cg-bg-card)")}
      >
        <IconX size={14} />
      </button>

      {/* Card */}
      <div style={{
        background: "var(--cg-bg-card)",
        borderRadius: "var(--cg-radius-lg)",
        width: "100%", maxWidth: 520,
        boxShadow: "var(--cg-shadow-modal)",
        padding: "var(--cg-sp-7) var(--cg-sp-7) var(--cg-sp-6)",
        animation: "modal-in 200ms var(--cg-ease)",
      }}>

        <div style={{
          fontSize: 20, fontWeight: 600, lineHeight: "28px",
          color: "var(--cg-fg-1)", marginBottom: "var(--cg-sp-5)",
        }}>
          Custom share link
        </div>

        {/* Input */}
        <div
          style={{
            display: "flex", alignItems: "center",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--cg-radius)",
            padding: "var(--cg-sp-2) var(--cg-sp-4)",
            boxShadow: `0 0 0 3px ${ringColor}`,
            transition: "border-color var(--cg-dur-fast), box-shadow var(--cg-dur-fast)",
            cursor: "text",
            overflow: "hidden",
          }}
          onClick={() => inputRef.current?.focus()}
        >
          <span ref={mirrorRef} aria-hidden style={{
            position: "absolute", visibility: "hidden", whiteSpace: "pre",
            fontSize: 14, fontFamily: "var(--cg-font)", pointerEvents: "none",
          }}>
            {val || "x"}
          </span>
          <input
            ref={inputRef}
            value={val}
            onChange={e => handleChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            maxLength={63}
            spellCheck={false}
            autoCapitalize="none"
            placeholder="my-agent"
            style={{
              border: "none", outline: "none",
              background: "transparent",
              fontSize: 14, fontFamily: "var(--cg-font)",
              color: "var(--cg-fg-1)",
              padding: 0,
              width: mirrorRef.current
                ? `${mirrorRef.current.offsetWidth + 2}px`
                : `${Math.max(val.length, 8) + 1}ch`,
              minWidth: "8ch",
              flexShrink: 0,
            }}
          />
          {/* Fixed suffix with tooltip explaining it's non-editable */}
          <span
            title="This domain is fixed and managed by CustomGPT. You can only change the prefix."
            style={{
              fontSize: 14, fontFamily: "var(--cg-font)",
              color: "var(--cg-primary-48)",
              whiteSpace: "nowrap",
              userSelect: "none",
              cursor: "default",
            }}
          >
            .customgpt-agents.com
          </span>
        </div>

        {/* Format rules — always visible, red on invalid */}
        <p style={{
          margin: "var(--cg-sp-2) 0 0",
          fontSize: 12, lineHeight: "16px",
          color: status === "invalid" ? "var(--cg-danger)" : "var(--cg-fg-4)",
          transition: "color var(--cg-dur-fast)",
          display: "flex", alignItems: "flex-start", gap: "var(--cg-sp-1)",
        }}>
          {status === "invalid" && (
            <IconAlertCircle size={13} style={{ color: "var(--cg-danger)", flexShrink: 0, marginTop: 1 }} />
          )}
          Subdomain must be 1–63 characters long, start with a Latin letter or number, and contain only Latin letters, numbers, or hyphens.
        </p>

        {/* Availability status */}
        <div style={{
          minHeight: 20, marginTop: "var(--cg-sp-1)",
          display: "flex", flexDirection: "column", gap: "var(--cg-sp-2)",
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", gap: "var(--cg-sp-1)" }}>
            {status === "checking" && <>
              <IconLoader2 size={13} style={{ color: "var(--cg-fg-4)", animation: "spin 0.8s linear infinite", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--cg-fg-3)" }}>Checking availability…</span>
            </>}
            {status === "taken" && <>
              <IconAlertCircle size={13} style={{ color: "var(--cg-danger)", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--cg-danger)" }}>
                This subdomain is already taken. Please choose a different one.
              </span>
            </>}
            {status === "available" && <>
              <IconCheck size={13} style={{ color: "var(--cg-success-700)", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--cg-success-700)" }}>Available</span>
            </>}
            {status === "own" && <>
              <IconCheck size={13} style={{ color: "var(--cg-success-700)", flexShrink: 0, marginTop: 1 }} />
              <span style={{ fontSize: 12, lineHeight: "16px", color: "var(--cg-success-700)" }}>
                Your previous subdomain — you can reclaim it.
              </span>
            </>}
          </div>

          {/* Suggestions — shown when taken */}
          {suggestions.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)", flexWrap: "wrap" }}>
              <span style={{ fontSize: 12, color: "var(--cg-fg-4)" }}>Try:</span>
              {suggestions.map(s => (
                <button
                  key={s}
                  onClick={() => handleChange(s)}
                  style={{
                    fontSize: 12, fontFamily: "var(--cg-font)",
                    color: "var(--cg-primary)",
                    background: "var(--cg-primary-8)",
                    border: "1px solid var(--cg-primary-16)",
                    borderRadius: "var(--cg-radius-full)",
                    padding: "2px var(--cg-sp-2)",
                    cursor: "pointer",
                    transition: "background var(--cg-dur-fast)",
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--cg-primary-16)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--cg-primary-8)")}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Warning — revealed progressively once a valid+available name is entered */}
        {hasBeenValid && (
          <div
            role="alert"
            className="cg-alert"
            style={{
              marginBottom: 0, marginTop: "var(--cg-sp-5)",
              background: "var(--cg-bg-card)",
              color: "var(--cg-primary)",
              border: "1px solid var(--cg-border)",
              animation: "modal-in 200ms var(--cg-ease)",
            }}
          >
            <IconAlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
            <p style={{ margin: 0, fontSize: 13, lineHeight: "18px" }}>
              <strong>Changing the subdomain takes effect immediately.</strong>{" "}
              Any links using the previous subdomain will stop working right away, which may disrupt users who already have access to those links.
            </p>
          </div>
        )}

        {/* Spacer to keep footer position stable when warning is hidden */}
        {!hasBeenValid && <div style={{ marginTop: "var(--cg-sp-5)" }} />}

        {/* Footer */}
        <div style={{
          display: "flex", justifyContent: "flex-end",
          gap: "var(--cg-sp-2)", marginTop: "var(--cg-sp-5)",
        }}>
          <button onClick={onClose} className="cg-btn cg-btn-outline">
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave(val)}
            className={`cg-btn cg-btn-destructive${canSave ? "" : " is-disabled"}`}
            style={{ whiteSpace: "nowrap" }}
          >
            I understand and want to proceed
          </button>
        </div>
      </div>
      <style>{`
        @keyframes modal-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}

/* ── Icon button ────────────────────────────────────────────────────────────── */
function IconBtn({ title, onClick, children, active }: {
  title?: string;
  onClick?: () => void;
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <div className="icon-btn-wrap" style={{ position: "relative", display: "inline-flex" }}>
      <button
        onClick={onClick}
        style={{
          width: 32, height: 32, flexShrink: 0,
          border: "none", background: active ? "var(--cg-success-100)" : "transparent",
          borderRadius: "var(--cg-radius)",
          display: "flex", alignItems: "center", justifyContent: "center",
          cursor: "pointer",
          color: active ? "var(--cg-success-700)" : "var(--cg-fg-4)",
          transition: "background var(--cg-dur-fast), color var(--cg-dur-fast)",
        }}
        onMouseEnter={e => !active && ((e.currentTarget as HTMLElement).style.background = "var(--cg-gray-100)")}
        onMouseLeave={e => !active && ((e.currentTarget as HTMLElement).style.background = "transparent")}
      >
        {children}
      </button>
      {title && <span className="icon-btn-tooltip">{title}</span>}
    </div>
  );
}

/* ── Code block ─────────────────────────────────────────────────────────────── */
function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }
  return (
    <div style={{
      border: "1px solid var(--cg-divider)",
      borderRadius: "var(--cg-radius)",
      background: "var(--cg-bg-card)",
      padding: "var(--cg-sp-4) var(--cg-sp-4) var(--cg-sp-3)",
      position: "relative",
    }}>
      <pre style={{
        margin: 0, fontSize: 12, lineHeight: 1.7,
        color: "var(--cg-fg-3)",
        fontFamily: "var(--cg-font-mono, ui-monospace, SFMono-Regular, monospace)",
        whiteSpace: "pre-wrap", wordBreak: "break-all",
        paddingRight: "var(--cg-sp-12)",
      }}>{code}</pre>
      <div style={{
        position: "absolute", bottom: "var(--cg-sp-2)", right: "var(--cg-sp-2)",
        display: "flex", gap: "var(--cg-sp-1)",
      }}>
        <IconBtn title="Copy" onClick={handleCopy} active={copied}>
          {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
        </IconBtn>
        <IconBtn title="Send">
          <IconSend size={15} />
        </IconBtn>
      </div>
    </div>
  );
}

/* ── Section heading ─────────────────────────────────────────────────────────── */
function SectionHeading({ label, actions }: {
  label: string;
  actions?: React.ReactNode;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--cg-sp-2)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)" }}>
        <span style={{ color: "var(--cg-primary)", fontSize: 16, lineHeight: 1 }}>✦</span>
        <span style={{ fontSize: 16, fontWeight: 600, color: "var(--cg-fg-1)" }}>{label}</span>
      </div>
      {actions && <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)" }}>{actions}</div>}
    </div>
  );
}

/* ── Share tab ──────────────────────────────────────────────────────────────── */
function ShareTab({ prefix, onEdit, onLiveChatSettings }: { prefix: string; onEdit: () => void; onLiveChatSettings: () => void }) {
  const [copied, setCopied] = useState(false);
  const fullUrl = `https://${prefix}.customgpt-agents.com`;

  function handleCopy() {
    navigator.clipboard.writeText(fullUrl).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  const liveChatCode =
`<script defer src="https://cdn.customgpt.ai/js/chat.js"></script>
<script defer> (function(){ function init(){ CustomGPT.init({
p_id:'${AGENT_ID}', p_key:'${AGENT_KEY}' }) }
document.readyState === 'complete' ? init() :
window.addEventListener('load', init); })(); </script>`;

  const embedCode =
`<div id="customgpt_chat"></div> <script
src="https://cdn.customgpt.ai/js/embed.js" defer
div_id="customgpt_chat" p_id="${AGENT_ID}"
p_key="${AGENT_KEY}"></script>`;

  return (
    <div style={{ padding: "var(--cg-sp-7) var(--cg-sp-8)", maxWidth: 780 }}>

      {/* Share link section */}
      <section style={{ marginBottom: "var(--cg-sp-8)" }}>
        <SectionHeading label="Share link" />
        <p style={{ fontSize: 14, color: "var(--cg-fg-3)", marginBottom: "var(--cg-sp-3)" }}>
          Send this URL for quick access to the agent.
        </p>

        {/* URL field — input height 40px per DS btn-md spec */}
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid var(--cg-border)",
          borderRadius: "var(--cg-radius)",
          background: "var(--cg-bg-card)",
          padding: "0 var(--cg-sp-2) 0 var(--cg-sp-4)",
          height: 40,
        }}>
          <span style={{ flex: 1, fontSize: 14, color: "var(--cg-fg-2)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fullUrl}
          </span>
          <div style={{ display: "flex", gap: "var(--cg-sp-1)", marginLeft: "var(--cg-sp-2)", flexShrink: 0 }}>
            <IconBtn title="Edit share link" onClick={onEdit}>
              <IconPencil size={15} />
            </IconBtn>
            <IconBtn title="Copy link" onClick={handleCopy} active={copied}>
              {copied ? <IconCheck size={15} /> : <IconCopy size={15} />}
            </IconBtn>
          </div>
        </div>

        <div style={{ textAlign: "right", marginTop: "var(--cg-sp-2)" }}>
          <a href="#" style={{ fontSize: 14, color: "var(--cg-primary)", textDecoration: "none" }}
            onMouseEnter={e => (e.currentTarget.style.textDecoration = "underline")}
            onMouseLeave={e => (e.currentTarget.style.textDecoration = "none")}
          >
            Prefer the old link format?
          </a>
        </div>
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--cg-divider)", marginBottom: "var(--cg-sp-8)" }} />

      {/* Live chat section */}
      <section style={{ marginBottom: "var(--cg-sp-8)" }}>
        <SectionHeading
          label="Add a live chat to your website"
          actions={
            <>
              <button className="cg-btn cg-btn-outline cg-btn-sm">Try it out</button>
              <button
                onClick={onLiveChatSettings}
                title="Live chat settings"
                style={{
                  width: 32, height: 32, border: "1px solid var(--cg-border)",
                  borderRadius: "var(--cg-radius)", background: "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  cursor: "pointer", color: "var(--cg-fg-3)",
                  transition: "background var(--cg-dur-fast), color var(--cg-dur-fast)",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cg-gray-100)"; (e.currentTarget as HTMLElement).style.color = "var(--cg-fg-1)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; (e.currentTarget as HTMLElement).style.color = "var(--cg-fg-3)"; }}
              >
                <IconSettings size={15} />
              </button>
            </>
          }
        />
        <p style={{ fontSize: 14, color: "var(--cg-fg-3)", marginBottom: "var(--cg-sp-3)" }}>
          To add a chat widget in the bottom right corner, copy the following code and paste it anywhere
          inside the &lt;body&gt; section of your webpage.
        </p>
        <CodeBlock code={liveChatCode} />
      </section>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--cg-divider)", marginBottom: 36 }} />

      {/* Embed section */}
      <section>
        <SectionHeading
          label="Embed an agent into your website"
          actions={
            <>
              <button className="cg-btn cg-btn-outline cg-btn-sm">Try it out</button>
              <button style={{
                width: 32, height: 32, border: "1px solid var(--cg-border)",
                borderRadius: "var(--cg-radius)", background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "var(--cg-fg-3)",
                transition: "background var(--cg-dur-fast)",
              }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--cg-gray-100)")}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
              >
                <IconSettings size={15} />
              </button>
            </>
          }
        />
        <p style={{ fontSize: 14, color: "var(--cg-fg-3)", marginBottom: "var(--cg-sp-3)" }}>
          To add the agent anywhere on a page, copy the following code and paste it into the &lt;body&gt;
          section of your webpage.
        </p>
        <CodeBlock code={embedCode} />
      </section>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
const sidebarNav = [
  { id: "build",       label: "Build",       icon: IconFiles },
  { id: "personalize", label: "Personalize", icon: IconSparkles },
  { id: "actions",     label: "Actions",     icon: IconPlugConnected },
  { id: "ask",         label: "Ask",         icon: IconMessage },
  { id: "deploy",      label: "Deploy",      icon: IconRocket, active: true },
  { id: "analyze",     label: "Analyze",     icon: IconChartBar },
];

function Sidebar() {
  return (
    <aside style={{
      width: 270, flexShrink: 0,
      background: "var(--cg-bg-card)",
      borderRight: "1px solid var(--cg-divider)",
      display: "flex", flexDirection: "column",
      minHeight: "100vh",
    }}>
      {/* Logo */}
      <div style={{ padding: "var(--cg-sp-4) var(--cg-sp-5)", borderBottom: "1px solid var(--cg-divider)" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="CustomGPT.ai" style={{ height: 28 }} />
      </div>

      {/* New Agent button */}
      <div style={{ padding: "var(--cg-sp-3) var(--cg-sp-4)", borderBottom: "1px solid var(--cg-divider)" }}>
        {/* btn-primary, height 40px (btn-md) */}
        <button className="cg-btn cg-btn-primary" style={{ width: "100%", justifyContent: "center" }}>
          <IconPlus size={15} /> New Agent
        </button>
      </div>

      {/* My Agent */}
      <div style={{ padding: "var(--cg-sp-1) var(--cg-sp-2)", borderBottom: "1px solid var(--cg-divider)" }}>
        <button style={{
          width: "100%", display: "flex", alignItems: "center", gap: "var(--cg-sp-2)",
          padding: "var(--cg-sp-2) var(--cg-sp-2)", borderRadius: "var(--cg-radius)",
          border: "none", background: "transparent",
          fontSize: 13, fontWeight: 600, color: "var(--cg-primary)",
          cursor: "pointer", fontFamily: "var(--cg-font)",
        }}>
          <IconChevronLeft size={15} style={{ color: "var(--cg-primary)" }} />
          My Agent
        </button>
      </div>

      {/* Nav items */}
      <nav style={{ padding: "8px 10px", flex: 1 }}>
        {sidebarNav.map(item => {
          const Icon = item.icon;
          return (
            <button key={item.id} style={{
              width: "100%", display: "flex", alignItems: "center", gap: 10,
              padding: "var(--cg-sp-2) var(--cg-sp-3)", marginBottom: "var(--cg-sp-1)",
              borderRadius: "var(--cg-radius)",
              border: "none",
              background: item.active ? "var(--cg-primary-8)" : "transparent",
              fontSize: 14, fontWeight: item.active ? 600 : 400,
              color: item.active ? "var(--cg-primary)" : "var(--cg-fg-2)",
              cursor: "pointer", textAlign: "left",
              fontFamily: "var(--cg-font)",
              transition: "background var(--cg-dur-fast)",
            }}
              onMouseEnter={e => !item.active && ((e.currentTarget as HTMLElement).style.background = "var(--cg-gray-50)")}
              onMouseLeave={e => !item.active && ((e.currentTarget as HTMLElement).style.background = "transparent")}
            >
              <Icon size={16} style={{ color: item.active ? "var(--cg-primary)" : "var(--cg-fg-3)", flexShrink: 0 }} />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Copilot */}
      <div style={{
        margin: "0 var(--cg-sp-2) var(--cg-sp-2)",
        border: "1px solid var(--cg-divider)",
        borderRadius: "var(--cg-radius)",
        padding: "var(--cg-sp-2) var(--cg-sp-3)",
      }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--cg-fg-3)", marginBottom: "var(--cg-sp-2)", letterSpacing: "0.02em" }}>
          CustomGPT.ai Copilot
        </div>
        <div style={{
          display: "flex", alignItems: "center",
          border: "1px solid var(--cg-border)",
          borderRadius: "var(--cg-radius)",
          padding: "var(--cg-sp-2) var(--cg-sp-3)",
          background: "var(--cg-bg-card)",
          gap: "var(--cg-sp-2)",
        }}>
          <span style={{ flex: 1, fontSize: 12, color: "var(--cg-fg-4)" }}>I need help with…</span>
          <IconSend size={14} style={{ color: "var(--cg-fg-4)", flexShrink: 0 }} />
        </div>
      </div>

      {/* Developers */}
      <div style={{
        padding: "var(--cg-sp-3) var(--cg-sp-5)",
        borderTop: "1px solid var(--cg-divider)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer",
        transition: "background var(--cg-dur-fast)",
      }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--cg-gray-50)")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "var(--cg-radius)",
            background: "var(--cg-primary-8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--cg-primary)",
          }}>
            <IconCode size={16} />
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--cg-fg-1)" }}>Developers</span>
        </div>
        <IconChevronLeft size={14} style={{ color: "var(--cg-fg-4)", transform: "rotate(180deg)" }} />
      </div>

      {/* My Profile */}
      <div style={{
        padding: "var(--cg-sp-3) var(--cg-sp-5)",
        borderTop: "1px solid var(--cg-divider)",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        cursor: "pointer",
        transition: "background var(--cg-dur-fast)",
      }}
        onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = "var(--cg-gray-50)")}
        onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = "transparent")}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)" }}>
          <div style={{
            width: 32, height: 32, borderRadius: "var(--cg-radius-full)",
            background: "var(--cg-primary-24)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--cg-primary)", fontSize: 12, fontWeight: 700,
          }}>
            MR
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "var(--cg-fg-1)" }}>My Profile</span>
        </div>
        <IconChevronLeft size={14} style={{ color: "var(--cg-fg-4)", transform: "rotate(180deg)" }} />
      </div>
    </aside>
  );
}

/* ── Tabs ───────────────────────────────────────────────────────────────────── */
const tabs = [
  { id: "share",        label: "Share",       icon: IconBrandSlack },
  { id: "integrations", label: "Integrations",icon: IconPlugConnected },
  { id: "advanced",     label: "Advanced",    icon: IconSettings },
  { id: "api",          label: "API",         icon: IconTerminal2 },
  { id: "mcp",          label: "MCP Server",  icon: IconServer2 },
];

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function DeployPage() {
  const [activeTab, setActiveTab]        = useState("share");
  const [prefix, setPrefix]              = useState(INITIAL_PREFIX);
  const [modalOpen, setModalOpen]        = useState(false);
  const [liveChatModalOpen, setLiveChatModalOpen] = useState(false);
  const [toast, setToast]                = useState<string | null>(null);
  const [ownedHistory]                   = useState(() => new Set([INITIAL_PREFIX]));

  function handleSave(newPrefix: string) {
    ownedHistory.add(prefix);
    setPrefix(newPrefix);
    setModalOpen(false);
    setToast(`Share link updated to ${newPrefix}.customgpt-agents.com`);
    setTimeout(() => setToast(null), 3200);
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--cg-bg-body)", fontFamily: "var(--cg-font)" }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>

        {/* Top bar — 56px height */}
        <div style={{
          height: 56, background: "var(--cg-bg-card)",
          borderBottom: "1px solid var(--cg-divider)",
          display: "flex", alignItems: "center",
          padding: "0 var(--cg-sp-6) 0 var(--cg-sp-7)",
          gap: "var(--cg-sp-3)", flexShrink: 0,
        }}>
          <IconLayoutSidebar size={18} style={{ color: "var(--cg-fg-4)", cursor: "pointer", flexShrink: 0 }} />
          <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-3)", flex: 1, minWidth: 0 }}>
            {/* h3 token: 20px / 600 */}
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "var(--cg-fg-1)", margin: 0, whiteSpace: "nowrap" }}>
              Deploy
              <span style={{ color: "var(--cg-fg-3)", fontWeight: 400 }}> • </span>
              My Agent
            </h1>
            {/* BETA badge — warning-100 bg / warning-700 text per DS status colors */}
            <span style={{
              display: "inline-flex", alignItems: "center", gap: "var(--cg-sp-1)",
              background: "var(--cg-warning-100)", color: "var(--cg-warning-700)",
              padding: "2px var(--cg-sp-2)", borderRadius: "var(--cg-radius-full)",
              fontSize: 12, fontWeight: 600, whiteSpace: "nowrap",
            }}>
              <IconBolt size={11} />
              Plan and Act (BETA)
            </span>
          </div>
          {/* Agent ID / Key — helper-12 token */}
          <div style={{ textAlign: "right", flexShrink: 0 }}>
            <div style={{ fontSize: 12, color: "var(--cg-fg-4)" }}>Agent ID: {AGENT_ID}</div>
            <div style={{ fontSize: 12, color: "var(--cg-fg-4)" }}>Agent Key: {AGENT_KEY}</div>
          </div>
        </div>

        {/* Tab nav */}
        <div style={{
          display: "flex",
          borderBottom: "1px solid var(--cg-divider)",
          background: "var(--cg-bg-card)",
          padding: "0 var(--cg-sp-7)",
          flexShrink: 0,
        }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = tab.id === activeTab;
            return (
              <button key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  display: "inline-flex", alignItems: "center", gap: "var(--cg-sp-2)",
                  padding: "var(--cg-sp-3) var(--cg-sp-4)",
                  border: "none",
                  borderBottom: `2px solid ${active ? "var(--cg-primary)" : "transparent"}`,
                  background: "transparent",
                  fontSize: 14, fontWeight: active ? 600 : 400,
                  color: active ? "var(--cg-primary)" : "var(--cg-fg-3)",
                  cursor: "pointer",
                  transition: "color var(--cg-dur-fast), border-color var(--cg-dur-fast)",
                  fontFamily: "var(--cg-font)",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => !active && ((e.currentTarget as HTMLElement).style.color = "var(--cg-fg-2)")}
                onMouseLeave={e => !active && ((e.currentTarget as HTMLElement).style.color = "var(--cg-fg-3)")}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <main style={{ flex: 1, overflowY: "auto" }}>
          {activeTab === "share" && (
            <ShareTab prefix={prefix} onEdit={() => setModalOpen(true)} onLiveChatSettings={() => setLiveChatModalOpen(true)} />
          )}
          {activeTab !== "share" && (
            <div style={{ padding: "var(--cg-sp-12) var(--cg-sp-8)", textAlign: "center", color: "var(--cg-fg-4)", fontSize: 14 }}>
              Coming soon
            </div>
          )}
        </main>
      </div>

      {modalOpen && (
        <EditModal
          currentPrefix={prefix}
          ownedHistory={ownedHistory}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {liveChatModalOpen && (
        <LiveChatSettingsModal onClose={() => setLiveChatModalOpen(false)} />
      )}

      {/* Toast — cg-alert-success pattern */}
      {toast && (
        <div className="cg-alert cg-alert-success" style={{
          position: "fixed", bottom: "var(--cg-sp-6)", right: "var(--cg-sp-6)",
          marginBottom: 0, zIndex: 60,
          boxShadow: "var(--cg-shadow)",
          animation: "modal-in 200ms var(--cg-ease)",
          fontWeight: 500,
        }}>
          <IconCheck size={15} style={{ flexShrink: 0 }} />
          {toast}
        </div>
      )}
    </div>
  );
}
