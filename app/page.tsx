"use client";

import { useState, useRef, useEffect } from "react";
import {
  IconRocket,
  IconBrain,
  IconFiles,
  IconPlugConnected,
  IconSparkles,
  IconChevronRight,
  IconLayoutSidebar,
  IconSearch,
  IconBell,
  IconLink,
  IconCode,
  IconMessageDots,
  IconTerminal2,
  IconBrandSlack,
  IconBrandWordpress,
  IconCopy,
  IconExternalLink,
  IconPencil,
  IconCheck,
  IconX,
  IconChevronLeft,
  IconAlertCircle,
  IconLoader2,
} from "@tabler/icons-react";

/* ── Mock availability data ─────────────────────────────────────────────────── */
const TAKEN_BY_OTHERS = new Set([
  "support", "sales-bot", "help-center", "demo", "test-agent",
  "assistant", "chat", "bot", "ai", "agent",
]);
const INITIAL_PREFIX = "miodgnfg8e";

/* ── Sidebar nav ────────────────────────────────────────────────────────────── */
const agentTabs = [
  { id: "build",        label: "Build",        icon: <IconFiles size={16} /> },
  { id: "personalize",  label: "Personalize",  icon: <IconSparkles size={16} /> },
  { id: "actions",      label: "Actions",      icon: <IconPlugConnected size={16} /> },
  { id: "intelligence", label: "Intelligence", icon: <IconBrain size={16} /> },
  { id: "deploy",       label: "Deploy",       icon: <IconRocket size={16} />, active: true },
];

/* ── Deploy channel cards ───────────────────────────────────────────────────── */
const deployChannels = [
  { id: "share-link",  label: "Share Link",     icon: IconLink,           description: "Share a public URL anyone can open in their browser.", badge: null },
  { id: "embed",       label: "Embed Widget",   icon: IconCode,           description: "Add a chat bubble to any website with a single script tag.", badge: null },
  { id: "live-chat",   label: "Live Chat",      icon: IconMessageDots,    description: "Full-page chat experience hosted on CustomGPT.", badge: "Popular" },
  { id: "api",         label: "API",            icon: IconTerminal2,      description: "Integrate your agent into any app via REST API.", badge: null },
  { id: "slack",       label: "Slack",          icon: IconBrandSlack,     description: "Add the agent as a Slack bot to any workspace.", badge: "New" },
  { id: "wordpress",   label: "WordPress",      icon: IconBrandWordpress, description: "Install the CustomGPT plugin on your WordPress site.", badge: null },
];

type InputStatus = "idle" | "invalid" | "checking" | "taken" | "available" | "own";

/* ── Validation ─────────────────────────────────────────────────────────────── */
function validateFormat(val: string): boolean {
  return val.length >= 1 && val.length <= 63 && /^[a-z0-9][a-z0-9-]*$/.test(val);
}

/* ── Edit Subdomain Modal ────────────────────────────────────────────────────── */
function EditSubdomainModal({
  currentPrefix,
  ownedHistory,
  onClose,
  onSave,
}: {
  currentPrefix: string;
  ownedHistory: Set<string>;
  onClose: () => void;
  onSave: (newPrefix: string) => void;
}) {
  const [inputVal, setInputVal] = useState(currentPrefix);
  const [status, setStatus] = useState<InputStatus>("idle");
  const [focused, setFocused] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
    inputRef.current?.select();
  }, []);

  function handleChange(raw: string) {
    const val = raw.toLowerCase().replace(/[^a-z0-9-]/g, "");
    setInputVal(val);

    if (timerRef.current) clearTimeout(timerRef.current);

    if (val.length === 0) { setStatus("idle"); return; }
    if (!validateFormat(val)) { setStatus("invalid"); return; }
    if (val === currentPrefix) { setStatus("idle"); return; }

    setStatus("checking");
    timerRef.current = setTimeout(() => {
      if (ownedHistory.has(val) && val !== currentPrefix) {
        setStatus("own");
      } else if (TAKEN_BY_OTHERS.has(val)) {
        setStatus("taken");
      } else {
        setStatus("available");
      }
    }, 550);
  }

  const canSave =
    (status === "available" || status === "own") &&
    inputVal.toLowerCase() !== currentPrefix;

  const borderColor = focused
    ? status === "invalid" || status === "taken"
      ? "var(--cg-danger)"
      : "var(--cg-primary)"
    : status === "invalid" || status === "taken"
    ? "var(--cg-danger)"
    : "var(--cg-border)";

  const ringColor = focused
    ? status === "invalid" || status === "taken"
      ? "rgba(234,84,85,0.16)"
      : "var(--cg-primary-16)"
    : "transparent";

  return (
    <div
      className="modal-backdrop"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="modal-card" style={{ maxWidth: 480 }}>
        {/* Header */}
        <div className="modal-hd" style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div className="modal-title">Edit share link</div>
            <div className="modal-subtitle">
              Customize the URL people use to find your agent.
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              width: 28, height: 28, borderRadius: "var(--cg-radius-sm)",
              border: "1px solid var(--cg-border)", background: "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", color: "var(--cg-fg-3)", flexShrink: 0, marginLeft: 12,
            }}
          >
            <IconX size={14} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body">
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--cg-fg-2)", marginBottom: 6 }}>
            Share URL
          </div>

          {/* Split input row */}
          <div style={{
            display: "flex",
            border: `1px solid ${borderColor}`,
            borderRadius: "var(--cg-radius-sm)",
            overflow: "hidden",
            boxShadow: `0 0 0 3px ${ringColor}`,
            transition: "box-shadow 120ms, border-color 120ms",
          }}>
            <input
              ref={inputRef}
              value={inputVal}
              onChange={e => handleChange(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setFocused(false)}
              placeholder="your-agent"
              maxLength={63}
              spellCheck={false}
              autoCapitalize="none"
              style={{
                flex: 1,
                minWidth: 0,
                padding: "8px 12px",
                border: "none",
                outline: "none",
                fontSize: 14,
                fontFamily: "var(--cg-font)",
                color: "var(--cg-fg-1)",
                background: "var(--cg-bg-card)",
              }}
            />
            <div style={{
              padding: "8px 12px",
              background: "var(--cg-gray-50)",
              borderLeft: `1px solid ${borderColor}`,
              fontSize: 14,
              color: "var(--cg-fg-3)",
              whiteSpace: "nowrap",
              userSelect: "none",
              display: "flex",
              alignItems: "center",
              transition: "border-color 120ms",
            }}>
              .customgpt-agents.com
            </div>
          </div>

          {/* Status message */}
          <div style={{ marginTop: 7, minHeight: 18, display: "flex", alignItems: "center", gap: 5 }}>
            {status === "invalid" && (
              <>
                <IconAlertCircle size={13} style={{ color: "var(--cg-danger)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--cg-danger)" }}>
                  Only letters, numbers, and hyphens. Must start with a letter or digit.
                </span>
              </>
            )}
            {status === "checking" && (
              <>
                <IconLoader2 size={13} style={{ color: "var(--cg-fg-4)", flexShrink: 0, animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontSize: 12, color: "var(--cg-fg-3)" }}>Checking availability…</span>
              </>
            )}
            {status === "taken" && (
              <>
                <IconAlertCircle size={13} style={{ color: "var(--cg-danger)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--cg-danger)" }}>
                  This subdomain is already taken by another account.
                </span>
              </>
            )}
            {status === "available" && (
              <>
                <IconCheck size={13} style={{ color: "var(--cg-success-700)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--cg-success-700)" }}>Available</span>
              </>
            )}
            {status === "own" && (
              <>
                <IconCheck size={13} style={{ color: "var(--cg-success-700)", flexShrink: 0 }} />
                <span style={{ fontSize: 12, color: "var(--cg-success-700)" }}>
                  Your previous subdomain — you can reclaim it.
                </span>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="modal-ft">
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--cg-radius-sm)",
              border: "1px solid var(--cg-border)",
              background: "transparent",
              fontSize: 13, fontWeight: 500,
              color: "var(--cg-fg-2)",
              cursor: "pointer",
              fontFamily: "var(--cg-font)",
            }}
          >
            Cancel
          </button>
          <button
            disabled={!canSave}
            onClick={() => canSave && onSave(inputVal.toLowerCase())}
            style={{
              padding: "8px 16px",
              borderRadius: "var(--cg-radius-sm)",
              border: "none",
              background: canSave ? "var(--cg-primary)" : "var(--cg-gray-200)",
              fontSize: 13, fontWeight: 600,
              color: canSave ? "#fff" : "var(--cg-fg-4)",
              cursor: canSave ? "pointer" : "not-allowed",
              transition: "background 120ms",
              fontFamily: "var(--cg-font)",
            }}
          >
            Save changes
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── Share Link detail view ─────────────────────────────────────────────────── */
function ShareLinkView({
  prefix,
  onBack,
  onSave,
}: {
  prefix: string;
  onBack: () => void;
  onSave: (p: string) => void;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [ownedHistory] = useState(() => new Set([INITIAL_PREFIX]));
  const fullUrl = `${prefix}.customgpt-agents.com`;

  function handleCopy() {
    navigator.clipboard.writeText(`https://${fullUrl}`).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  function handleSave(newPrefix: string) {
    ownedHistory.add(prefix);
    onSave(newPrefix);
    setModalOpen(false);
    setToast(`Share link updated to ${newPrefix}.customgpt-agents.com`);
    setTimeout(() => setToast(null), 3500);
  }

  return (
    <>
      <div style={{ padding: "24px 32px 48px" }}>
        {/* Breadcrumb */}
        <button
          onClick={onBack}
          style={{
            display: "inline-flex", alignItems: "center", gap: 4,
            fontSize: 13, color: "var(--cg-fg-3)",
            background: "none", border: "none", cursor: "pointer",
            padding: "0 0 20px",
            fontFamily: "var(--cg-font)",
          }}
        >
          <IconChevronLeft size={14} />
          Deploy
        </button>

        {/* Heading */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <div style={{
            width: 36, height: 36, borderRadius: "var(--cg-radius)",
            background: "var(--cg-primary-8)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "var(--cg-primary)",
          }}>
            <IconLink size={18} />
          </div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--cg-fg-1)", margin: 0 }}>
            Share Link
          </h1>
        </div>
        <p style={{ fontSize: 13, color: "var(--cg-fg-3)", marginBottom: 28 }}>
          Share a public URL anyone can open in their browser.
        </p>

        {/* URL field card */}
        <div style={{
          background: "var(--cg-bg-card)",
          border: "1px solid var(--cg-divider)",
          borderRadius: "var(--cg-radius-md)",
          padding: "20px 24px",
          maxWidth: 640,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: "var(--cg-fg-3)", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.05em" }}>
            Share URL
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {/* URL pill */}
            <div style={{
              flex: 1, minWidth: 0,
              display: "flex", alignItems: "center",
              height: 38,
              border: "1px solid var(--cg-divider)",
              borderRadius: "var(--cg-radius-sm)",
              background: "var(--cg-gray-50)",
              padding: "0 12px",
              overflow: "hidden",
            }}>
              <span style={{
                fontSize: 13, color: "var(--cg-fg-2)",
                overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                fontFeatureSettings: '"tnum"',
              }}>
                <span style={{ color: "var(--cg-fg-4)", fontSize: 12 }}>https://</span>
                <span style={{ fontWeight: 500, color: "var(--cg-primary)" }}>{prefix}</span>
                <span style={{ color: "var(--cg-fg-3)" }}>.customgpt-agents.com</span>
              </span>
            </div>

            {/* Actions */}
            <button
              onClick={handleCopy}
              title="Copy link"
              style={{
                width: 38, height: 38, flexShrink: 0,
                border: "1px solid var(--cg-border)",
                borderRadius: "var(--cg-radius-sm)",
                background: copied ? "var(--cg-success-100)" : "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer",
                color: copied ? "var(--cg-success-700)" : "var(--cg-fg-3)",
                transition: "background 120ms, color 120ms",
              }}
            >
              {copied ? <IconCheck size={16} /> : <IconCopy size={16} />}
            </button>

            <a
              href={`https://${fullUrl}`}
              target="_blank"
              rel="noreferrer"
              title="Open link"
              style={{
                width: 38, height: 38, flexShrink: 0,
                border: "1px solid var(--cg-border)",
                borderRadius: "var(--cg-radius-sm)",
                background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "var(--cg-fg-3)",
                textDecoration: "none",
                transition: "background 120ms, color 120ms",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cg-gray-100)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <IconExternalLink size={16} />
            </a>

            <button
              onClick={() => setModalOpen(true)}
              title="Edit subdomain"
              style={{
                height: 38,
                padding: "0 14px",
                flexShrink: 0,
                border: "1px solid var(--cg-border)",
                borderRadius: "var(--cg-radius-sm)",
                background: "transparent",
                display: "flex", alignItems: "center", justifyContent: "center",
                gap: 6,
                cursor: "pointer",
                color: "var(--cg-fg-2)",
                fontSize: 13, fontWeight: 500,
                fontFamily: "var(--cg-font)",
                transition: "background 120ms, border-color 120ms",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "var(--cg-gray-100)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
            >
              <IconPencil size={14} />
              Edit
            </button>
          </div>

          <p style={{ fontSize: 12, color: "var(--cg-fg-4)", marginTop: 10 }}>
            You can customize the prefix. The domain suffix{" "}
            <code style={{ fontFamily: "monospace", background: "var(--cg-gray-100)", padding: "1px 4px", borderRadius: 3 }}>
              .customgpt-agents.com
            </code>{" "}
            is fixed.
          </p>
        </div>
      </div>

      {modalOpen && (
        <EditSubdomainModal
          currentPrefix={prefix}
          ownedHistory={ownedHistory}
          onClose={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}

      {toast && (
        <div className="toast toast-success">
          <IconCheck size={15} />
          {toast}
        </div>
      )}
    </>
  );
}

/* ── Channel card (list view) ───────────────────────────────────────────────── */
function ChannelCard({
  channel,
  onConfigure,
}: {
  channel: (typeof deployChannels)[0];
  onConfigure: () => void;
}) {
  const Icon = channel.icon;
  return (
    <div
      style={{
        background: "var(--cg-bg-card)",
        border: "1px solid var(--cg-divider)",
        borderRadius: "var(--cg-radius-md)",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: 12,
        cursor: "pointer",
        transition: "box-shadow var(--cg-dur), border-color var(--cg-dur)",
        position: "relative",
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "var(--cg-shadow-card)";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--cg-primary)";
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
        (e.currentTarget as HTMLElement).style.borderColor = "var(--cg-divider)";
      }}
    >
      {channel.badge && (
        <span style={{
          position: "absolute", top: 12, right: 12,
          fontSize: 10, fontWeight: 600, letterSpacing: "0.04em",
          padding: "2px 7px",
          borderRadius: "var(--cg-radius-full)",
          background: channel.badge === "New" ? "var(--cg-success-100)" : "var(--cg-primary-100)",
          color: channel.badge === "New" ? "var(--cg-success-700)" : "var(--cg-primary)",
        }}>{channel.badge}</span>
      )}
      <div style={{
        width: 40, height: 40, borderRadius: "var(--cg-radius)",
        background: "var(--cg-primary-8)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "var(--cg-primary)",
      }}>
        <Icon size={20} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cg-fg-1)", marginBottom: 4 }}>
          {channel.label}
        </div>
        <div style={{ fontSize: 13, color: "var(--cg-fg-3)", lineHeight: 1.5 }}>
          {channel.description}
        </div>
      </div>
      <button
        onClick={onConfigure}
        style={{
          marginTop: "auto",
          padding: "7px 14px",
          borderRadius: "var(--cg-radius-sm)",
          border: "1px solid var(--cg-border)",
          background: "transparent",
          fontSize: 13, fontWeight: 500,
          color: "var(--cg-fg-2)",
          cursor: "pointer",
          textAlign: "center",
          transition: "background var(--cg-dur-fast)",
          alignSelf: "flex-start",
          fontFamily: "var(--cg-font)",
        }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--cg-gray-100)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        Configure
      </button>
    </div>
  );
}

/* ── Sidebar ────────────────────────────────────────────────────────────────── */
function Sidebar() {
  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "var(--cg-bg-card)",
      borderRight: "1px solid var(--cg-divider)",
      display: "flex",
      flexDirection: "column",
      flexShrink: 0,
    }}>
      <div style={{
        height: 56,
        display: "flex",
        alignItems: "center",
        padding: "0 20px",
        borderBottom: "1px solid var(--cg-divider)",
      }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="CustomGPT" style={{ height: 26 }} />
      </div>

      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--cg-divider)",
        display: "flex", alignItems: "center", gap: 8,
      }}>
        <div style={{
          width: 30, height: 30, borderRadius: "var(--cg-radius-sm)",
          background: "var(--cg-primary-8)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "var(--cg-primary)", fontSize: 14, fontWeight: 700, flexShrink: 0,
        }}>S</div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: "var(--cg-fg-1)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Support Agent
          </div>
          <div style={{ fontSize: 11, color: "var(--cg-fg-4)" }}>Agent settings</div>
        </div>
        <IconChevronRight size={14} style={{ color: "var(--cg-fg-4)", flexShrink: 0, marginLeft: "auto" }} />
      </div>

      <nav style={{ padding: "8px 8px", flex: 1 }}>
        {agentTabs.map(tab => (
          <button key={tab.id} style={{
            width: "100%",
            display: "flex", alignItems: "center", gap: 10,
            padding: "8px 10px",
            borderRadius: "var(--cg-radius-sm)",
            border: "none",
            cursor: "pointer",
            fontSize: 13,
            fontWeight: tab.active ? 600 : 400,
            background: tab.active ? "var(--cg-primary-8)" : "transparent",
            color: tab.active ? "var(--cg-primary)" : "var(--cg-fg-2)",
            textAlign: "left",
            transition: "background var(--cg-dur-fast)",
            marginBottom: 2,
            fontFamily: "var(--cg-font)",
          }}>
            <span style={{ color: tab.active ? "var(--cg-primary)" : "var(--cg-fg-3)" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

/* ── Top bar ────────────────────────────────────────────────────────────────── */
function TopBar() {
  return (
    <div style={{
      height: 56,
      borderBottom: "1px solid var(--cg-divider)",
      display: "flex", alignItems: "center",
      padding: "0 24px", gap: 12,
      background: "var(--cg-bg-card)",
      flexShrink: 0,
    }}>
      <IconLayoutSidebar size={18} style={{ color: "var(--cg-fg-4)", cursor: "pointer" }} />
      <div style={{ flex: 1 }} />
      <button style={{
        width: 32, height: 32, borderRadius: "var(--cg-radius-sm)",
        border: "1px solid var(--cg-border)", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--cg-fg-3)",
      }}>
        <IconSearch size={16} />
      </button>
      <button style={{
        width: 32, height: 32, borderRadius: "var(--cg-radius-sm)",
        border: "1px solid var(--cg-border)", background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--cg-fg-3)",
      }}>
        <IconBell size={16} />
      </button>
      <div style={{
        width: 30, height: 30, borderRadius: "var(--cg-radius-full)",
        background: "var(--cg-primary)",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: "#fff", fontSize: 12, fontWeight: 600,
      }}>M</div>
    </div>
  );
}

/* ── Page ───────────────────────────────────────────────────────────────────── */
export default function DeployPage() {
  const [view, setView] = useState<"list" | "share-link">("list");
  const [prefix, setPrefix] = useState(INITIAL_PREFIX);

  return (
    <div style={{
      display: "flex",
      minHeight: "100vh",
      background: "var(--cg-bg-body)",
      fontFamily: "var(--cg-font)",
    }}>
      <Sidebar />

      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <TopBar />

        <main style={{ flex: 1 }}>
          {view === "list" ? (
            <>
              {/* Page header */}
              <div style={{ padding: "24px 32px 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <IconRocket size={20} style={{ color: "var(--cg-primary)" }} />
                  <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--cg-fg-1)", margin: 0 }}>Deploy</h1>
                </div>
                <p style={{ fontSize: 13, color: "var(--cg-fg-3)", margin: 0 }}>
                  Choose how and where to share your agent.
                </p>
              </div>

              <div style={{ padding: "24px 32px" }}>
                <div style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                  gap: 16,
                }}>
                  {deployChannels.map(ch => (
                    <ChannelCard
                      key={ch.id}
                      channel={ch}
                      onConfigure={() => ch.id === "share-link" && setView("share-link")}
                    />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <ShareLinkView
              prefix={prefix}
              onBack={() => setView("list")}
              onSave={setPrefix}
            />
          )}
        </main>
      </div>
    </div>
  );
}
