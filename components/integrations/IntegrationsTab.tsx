"use client";

import { useState } from "react";
import {
  IconBrandSlack, IconBrandWordpress, IconBrandNotion, IconBrandWix,
  IconExternalLink, IconCheck, IconLoader2, IconAlertCircle, IconCode,
  IconCopy, IconChevronLeft, IconX, IconPlugConnected,
} from "@tabler/icons-react";

/* ── constants ─────────────────────────────────────────────────────────────── */
const AGENT_NAME     = "My Agent";
const AGENT_ID       = "95211";
const WORKSPACE_NAME = "HS360";
const MOCK_KEY       = `${AGENT_ID}|J8kP2mQvR5nT9xL3bF7gH4wA1sZ6yE`;
const MOCK_KEY_MASKED = `${AGENT_ID}|J8kP•••••••••••••••••••••••••6yE`;

type SlackPhase = "idle" | "connecting" | "completing" | "key_ready" | "connected";

/* ── integration card data ──────────────────────────────────────────────────── */
interface IntegCard {
  id: string;
  name: string;
  description: string;
  bgColor: string;
  hasConnect?: boolean;
  hasTryItOut?: boolean;
  isCode?: boolean;
}

const OTHER_INTEGRATIONS: IntegCard[] = [
  {
    id: "wordpress",
    name: "WordPress",
    description: "Use the official CustomGPT.ai plugin for WordPress to add the chat widget to your website.",
    bgColor: "#21759B18",
    hasConnect: true, hasTryItOut: true,
  },
  {
    id: "shopify",
    name: "Shopify",
    description: "Add the chat widget to your Shopify store to respond to product queries and customer requests.",
    bgColor: "#96BF4818",
  },
  {
    id: "sharepoint",
    name: "SharePoint",
    description: "Embed the agent directly into your SharePoint site to maximize your team's productivity.",
    bgColor: "#0078D418", isCode: true,
  },
  {
    id: "notion",
    name: "Notion",
    description: "Embed the agent directly into your Notion page to integrate it seamlessly into your workflows.",
    bgColor: "#19191918", isCode: true,
  },
  {
    id: "wix",
    name: "WiX",
    description: "Add the agent to your WiX website to boost user engagement and deflect up to 93% of support tickets.",
    bgColor: "#FAAD0018",
  },
  {
    id: "readme",
    name: "ReadMe",
    description: "Embed the agent in your ReadMe knowledge base to provide lightning-fast issue resolution.",
    bgColor: "#018EF518", isCode: true,
  },
  {
    id: "pendo",
    name: "Pendo",
    description: "Deploy the agent inside the Pendo Resource Center widget for quick access for your customers.",
    bgColor: "#FF487618", isCode: true,
  },
  {
    id: "iframe",
    name: "iFrame",
    description: "Quickly embed the agent on any website or platform as a simple iframe.",
    bgColor: "#73737318", isCode: false,
  },
];

/* ── brand logo ─────────────────────────────────────────────────────────────── */

function BrandLogo({ id, bg }: { id: string; bg: string }) {
  const wrap: React.CSSProperties = {
    width: 40, height: 40, borderRadius: 10, flexShrink: 0,
    background: bg,
    border: `1px solid ${bg.replace("18", "35")}`,
    display: "flex", alignItems: "center", justifyContent: "center",
  };
  const imgStyle: React.CSSProperties = { width: 22, height: 22, objectFit: "contain" };

  if (id === "wordpress")  return <div style={wrap}><IconBrandWordpress size={22} style={{ color: "#21759B" }} /></div>;
  if (id === "notion")     return <div style={wrap}><IconBrandNotion    size={22} style={{ color: "#191919" }} /></div>;
  if (id === "wix")        return <div style={wrap}><IconBrandWix       size={22} style={{ color: "#FAAD00" }} /></div>;
  if (id === "iframe")     return <div style={wrap}><IconCode           size={22} style={{ color: "#737373" }} /></div>;
  // SVG file logos
  const src: Record<string, string> = {
    shopify:    "/logos/shopify.svg",
    sharepoint: "/logos/sharepoint.svg",
    readme:     "/logos/readme.svg",
    pendo:      "/logos/pendo.svg",
  };
  if (src[id]) return <div style={wrap}><img src={src[id]} alt={id} style={imgStyle} /></div>;
  return <div style={wrap} />;
}

function DocsBtn() {
  return (
    <button className="cg-btn cg-btn-neutral cg-btn-sm" style={{ gap: 4 }}>
      Docs <IconExternalLink size={12} />
    </button>
  );
}

/* ── integration card ───────────────────────────────────────────────────────── */
function IntegCard({ card }: { card: IntegCard }) {
  return (
    <div style={{
      background: "var(--cg-bg-card)",
      border: "1px solid var(--cg-divider)",
      borderRadius: "var(--cg-radius-md)",
      padding: "var(--cg-sp-5)",
      display: "flex", flexDirection: "column", gap: "var(--cg-sp-3)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-3)" }}>
          <BrandLogo id={card.id} bg={card.bgColor} />
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--cg-fg-1)" }}>{card.name}</span>
        </div>
        {card.isCode && (
          <div style={{ color: "var(--cg-fg-4)", display: "flex", alignItems: "center" }}>
            <IconCode size={16} />
          </div>
        )}
      </div>
      <p style={{ fontSize: 13, lineHeight: "18px", color: "var(--cg-fg-3)", flex: 1, margin: 0 }}>
        {card.description}
      </p>
      <div style={{ display: "flex", gap: "var(--cg-sp-2)", marginTop: "var(--cg-sp-1)" }}>
        {card.hasConnect && (
          <button className="cg-btn cg-btn-outline cg-btn-sm" style={{ gap: 4 }}>
            <IconPlugConnected size={12} /> Connect
          </button>
        )}
        {card.hasTryItOut && (
          <button className="cg-btn cg-btn-neutral cg-btn-sm">Try it out</button>
        )}
        <DocsBtn />
      </div>
    </div>
  );
}

/* ── slack card — idle / connecting / connected ─────────────────────────────── */
function SlackCard({
  phase,
  onConnect,
  onManage,
  onDisconnect,
}: {
  phase: SlackPhase;
  onConnect: () => void;
  onManage: () => void;
  onDisconnect: () => void;
}) {
  const isConnected = phase === "connected";
  const isConnecting = phase === "connecting";

  return (
    <div style={{
      background: "var(--cg-bg-card)",
      border: `1px solid ${isConnected ? "rgba(28,199,111,0.35)" : "var(--cg-divider)"}`,
      borderRadius: "var(--cg-radius-md)",
      padding: "var(--cg-sp-5)",
      display: "flex", flexDirection: "column", gap: "var(--cg-sp-3)",
      boxShadow: isConnected ? "0 0 0 3px rgba(28,199,111,0.08)" : "none",
      transition: "border-color var(--cg-dur), box-shadow var(--cg-dur)",
    }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-3)" }}>
          <div style={{
            width: 40, height: 40, borderRadius: 10, flexShrink: 0,
            background: "#4A154B18", border: "1px solid #4A154B30",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <IconBrandSlack size={22} style={{ color: "#611f69" }} />
          </div>
          <span style={{ fontSize: 15, fontWeight: 600, color: "var(--cg-fg-1)" }}>Slack</span>
        </div>
        {isConnected && (
          <div style={{
            display: "flex", alignItems: "center", gap: 6,
            background: "var(--cg-success-100)",
            border: "1px solid rgba(28,199,111,0.35)",
            borderRadius: "var(--cg-radius-full)",
            padding: "3px 10px",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--cg-success)", display: "block", flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "var(--cg-success-700)" }}>Connected</span>
            <span style={{ fontSize: 12, color: "var(--cg-success-700)", opacity: 0.7 }}>· {WORKSPACE_NAME}</span>
          </div>
        )}
      </div>

      <p style={{ fontSize: 13, lineHeight: "18px", color: "var(--cg-fg-3)", margin: 0 }}>
        Connect the agent with your Slack workspace, add it to channels, and choose who can access it and where.
      </p>

      {isConnected && (
        <div style={{
          background: "var(--cg-gray-50)",
          border: "1px solid var(--cg-divider)",
          borderRadius: "var(--cg-radius)",
          padding: "var(--cg-sp-3) var(--cg-sp-4)",
          display: "flex", alignItems: "center", justifyContent: "space-between",
        }}>
          <div>
            <div style={{ fontSize: 12, color: "var(--cg-fg-3)", marginBottom: 2 }}>Connection key</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: "var(--cg-fg-2)", fontFamily: "var(--cg-font-mono, monospace)" }}>
              {MOCK_KEY_MASKED}
            </div>
          </div>
          <div style={{ display: "flex", gap: "var(--cg-sp-2)", alignItems: "center" }}>
            <button
              onClick={onManage}
              style={{
                fontSize: 12, fontWeight: 600,
                color: "var(--cg-primary)", background: "none",
                border: "none", cursor: "pointer", padding: 0,
              }}
            >
              Regenerate
            </button>
          </div>
        </div>
      )}

      <div style={{ display: "flex", gap: "var(--cg-sp-2)", marginTop: "var(--cg-sp-1)" }}>
        {!isConnected ? (
          <button
            className="cg-btn cg-btn-outline cg-btn-sm"
            onClick={onConnect}
            disabled={isConnecting}
            style={{ gap: 4, minWidth: 90, justifyContent: "center" }}
          >
            {isConnecting ? (
              <><IconLoader2 size={12} style={{ animation: "spin 0.7s linear infinite" }} /> Connecting…</>
            ) : (
              <><IconPlugConnected size={12} /> Connect</>
            )}
          </button>
        ) : (
          <button
            className="cg-btn cg-btn-neutral cg-btn-sm"
            onClick={onDisconnect}
            style={{ gap: 4 }}
          >
            <IconX size={12} /> Disconnect
          </button>
        )}
        <DocsBtn />
      </div>
    </div>
  );
}

/* ── stepper ────────────────────────────────────────────────────────────────── */
function Stepper({ step }: { step: 2 | 3 }) {
  const steps = [
    { n: 1, label: "Authorize Slack workspace", done: true },
    { n: 2, label: step >= 3 ? "API key copied to clipboard" : "Create your connection key", done: step >= 3 },
    { n: 3, label: "Activate in Slack", done: false },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {steps.map((s, i) => {
        const active = s.n === step;
        const done   = s.done;
        const pending = !done && !active;
        return (
          <div key={s.n} style={{ display: "flex", alignItems: "flex-start", gap: "var(--cg-sp-3)" }}>
            {/* line + dot */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 24, flexShrink: 0 }}>
              <div style={{
                width: 24, height: 24,
                borderRadius: "50%",
                background: done
                  ? "var(--cg-success-100)"
                  : active
                    ? "var(--cg-primary)"
                    : "var(--cg-gray-100)",
                border: done
                  ? "1.5px solid rgba(28,199,111,0.4)"
                  : active
                    ? "1.5px solid var(--cg-primary)"
                    : "1.5px solid var(--cg-gray-300)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
                transition: "all var(--cg-dur)",
              }}>
                {done ? (
                  <IconCheck size={12} style={{ color: "var(--cg-success-700)" }} />
                ) : (
                  <span style={{
                    fontSize: 11, fontWeight: 700,
                    color: active ? "#fff" : "var(--cg-fg-4)",
                    lineHeight: 1,
                  }}>{s.n}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div style={{
                  width: 1.5, flex: 1, minHeight: 20,
                  background: done ? "rgba(28,199,111,0.3)" : "var(--cg-gray-200)",
                  marginTop: 2, marginBottom: 2,
                }} />
              )}
            </div>

            {/* label */}
            <div style={{ paddingTop: 3, paddingBottom: i < steps.length - 1 ? "var(--cg-sp-4)" : 0 }}>
              <span style={{
                fontSize: 13, fontWeight: active ? 600 : 400,
                color: done
                  ? "var(--cg-success-700)"
                  : active
                    ? "var(--cg-fg-1)"
                    : "var(--cg-fg-4)",
              }}>
                {s.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ── slack completion screen ────────────────────────────────────────────────── */
function SlackCompletionScreen({
  phase,
  keyName,
  setKeyName,
  keyScope,
  setKeyScope,
  generating,
  onGenerate,
  onCopyAgain,
  onOpenSlack,
  onBack,
}: {
  phase: "completing" | "key_ready";
  keyName: string;
  setKeyName: (v: string) => void;
  keyScope: "agent" | "all";
  setKeyScope: (v: "agent" | "all") => void;
  generating: boolean;
  onGenerate: () => void;
  onCopyAgain: () => void;
  onOpenSlack: () => void;
  onBack: () => void;
}) {
  const [copyAgainDone, setCopyAgainDone] = useState(false);
  const [expiry, setExpiry] = useState<"never" | "custom">("never");
  const [expiryDays, setExpiryDays] = useState("");

  function handleCopyAgain() {
    onCopyAgain();
    setCopyAgainDone(true);
    setTimeout(() => setCopyAgainDone(false), 1800);
  }

  const currentStep = phase === "completing" ? 2 : 3;

  return (
    <div style={{ padding: "var(--cg-sp-7) var(--cg-sp-8)", maxWidth: 780 }}>

      {/* back link + progress counter */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "var(--cg-sp-6)" }}>
        <button
          onClick={onBack}
          style={{
            display: "flex", alignItems: "center", gap: 4,
            fontSize: 13, fontWeight: 500, color: "var(--cg-fg-3)",
            background: "none", border: "none", cursor: "pointer", padding: 0,
          }}
          onMouseEnter={e => (e.currentTarget.style.color = "var(--cg-fg-1)")}
          onMouseLeave={e => (e.currentTarget.style.color = "var(--cg-fg-3)")}
        >
          <IconChevronLeft size={15} />
          Back to Integrations
        </button>
        <span style={{ fontSize: 12, color: "var(--cg-fg-4)", fontWeight: 500 }}>
          Step {currentStep} of 3
        </span>
      </div>

      {/* success banner */}
      <div style={{
        display: "flex", alignItems: "center", gap: "var(--cg-sp-3)",
        background: "var(--cg-success-100)",
        border: "1px solid rgba(28,199,111,0.35)",
        borderRadius: "var(--cg-radius-md)",
        padding: "var(--cg-sp-4) var(--cg-sp-5)",
        marginBottom: "var(--cg-sp-7)",
      }}>
        <div style={{
          width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
          background: "rgba(28,199,111,0.15)",
          border: "1.5px solid rgba(28,199,111,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <IconBrandSlack size={18} style={{ color: "var(--cg-success-700)" }} />
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cg-success-700)" }}>
            Slack workspace "{WORKSPACE_NAME}" connected!
          </div>
          <div style={{ fontSize: 12, color: "var(--cg-success-700)", opacity: 0.8, marginTop: 1 }}>
            {phase === "completing"
              ? "One more step — create a connection key to activate your agent."
              : "Almost done — open Slack and paste your key to activate the bot."}
          </div>
        </div>
      </div>

      {/* two-column layout: stepper left, content right */}
      <div style={{ display: "flex", gap: "var(--cg-sp-8)", alignItems: "flex-start" }}>

        {/* stepper column */}
        <div style={{ width: 220, flexShrink: 0, paddingTop: 2 }}>
          <Stepper step={currentStep as 2 | 3} />
        </div>

        {/* divider */}
        <div style={{ width: 1, background: "var(--cg-divider)", alignSelf: "stretch", flexShrink: 0 }} />

        {/* content column */}
        <div style={{ flex: 1, minWidth: 0 }}>

          {/* ── step 2: create key ── */}
          {phase === "completing" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cg-sp-5)" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--cg-fg-1)", marginBottom: "var(--cg-sp-1)" }}>
                  Create your connection key
                </div>
                <div style={{ fontSize: 13, color: "var(--cg-fg-3)" }}>
                  This key allows Slack to securely communicate with your agent.
                </div>
              </div>

              {/* key name */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--cg-fg-2)", marginBottom: "var(--cg-sp-1)" }}>
                  Key name
                </label>
                <input
                  className="cg-input"
                  value={keyName}
                  onChange={e => setKeyName(e.target.value)}
                  placeholder={`${AGENT_NAME} — Slack ${WORKSPACE_NAME}`}
                />
              </div>

              {/* scope */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--cg-fg-2)", marginBottom: "var(--cg-sp-2)" }}>
                  Scope
                </label>
                <div className="radio-group">
                  <label className="radio-opt">
                    <input
                      type="radio" className="cg-radio"
                      checked={keyScope === "agent"}
                      onChange={() => setKeyScope("agent")}
                    />
                    <span className="radio-opt-label">
                      This agent only
                      <small>Only "{AGENT_NAME}" can use this key</small>
                    </span>
                  </label>
                  <label className="radio-opt">
                    <input
                      type="radio" className="cg-radio"
                      checked={keyScope === "all"}
                      onChange={() => setKeyScope("all")}
                    />
                    <span className="radio-opt-label">
                      All agents in my account
                      <small>Any agent can use this key</small>
                    </span>
                  </label>
                </div>
              </div>

              {/* expiry */}
              <div>
                <label style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--cg-fg-2)", marginBottom: "var(--cg-sp-2)" }}>
                  Key expiry
                </label>
                <div className="radio-group">
                  <label className="radio-opt">
                    <input
                      type="radio" className="cg-radio"
                      checked={expiry === "never"}
                      onChange={() => setExpiry("never")}
                    />
                    <span className="radio-opt-label">Never expires</span>
                  </label>
                  <label className="radio-opt">
                    <input
                      type="radio" className="cg-radio"
                      checked={expiry === "custom"}
                      onChange={() => setExpiry("custom")}
                    />
                    <span className="radio-opt-label" style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                      Expires after
                      <input
                        type="number"
                        className="cg-input"
                        value={expiryDays}
                        onChange={e => { setExpiry("custom"); setExpiryDays(e.target.value); }}
                        onClick={() => setExpiry("custom")}
                        placeholder="30"
                        min="1"
                        style={{ width: 70, padding: "4px 10px", fontSize: 13 }}
                      />
                      days
                    </span>
                  </label>
                </div>
              </div>

              {/* one-time warning */}
              <div style={{
                display: "flex", gap: "var(--cg-sp-2)",
                background: "var(--cg-warning-100)",
                border: "1px solid rgba(255,159,67,0.35)",
                borderRadius: "var(--cg-radius)",
                padding: "var(--cg-sp-3) var(--cg-sp-4)",
              }}>
                <IconAlertCircle size={15} style={{ color: "var(--cg-warning-700)", flexShrink: 0, marginTop: 1 }} />
                <p style={{ fontSize: 13, lineHeight: "18px", color: "var(--cg-warning-700)", margin: 0 }}>
                  This key is <strong>shown only once</strong>. If you lose it, you can always regenerate a new one from Deploy → API.
                </p>
              </div>

              {/* CTA */}
              <div>
                <button
                  className="cg-btn cg-btn-primary"
                  onClick={onGenerate}
                  disabled={generating || !keyName.trim()}
                  style={{ gap: 8 }}
                >
                  {generating
                    ? <><span className="spinner" /> Generating…</>
                    : <><IconCopy size={15} /> Generate &amp; Copy Key</>
                  }
                </button>
              </div>
            </div>
          )}

          {/* ── step 3: activate in slack ── */}
          {phase === "key_ready" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "var(--cg-sp-5)" }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: "var(--cg-fg-1)", marginBottom: "var(--cg-sp-1)" }}>
                  Activate in Slack
                </div>
                <div style={{ fontSize: 13, color: "var(--cg-fg-3)" }}>
                  Your key has been copied. Now paste it in the Slack app.
                </div>
              </div>

              {/* instructions */}
              <div style={{
                background: "var(--cg-gray-50)",
                border: "1px solid var(--cg-divider)",
                borderRadius: "var(--cg-radius-md)",
                padding: "var(--cg-sp-4) var(--cg-sp-5)",
                display: "flex", flexDirection: "column", gap: "var(--cg-sp-3)",
              }}>
                <div style={{ fontSize: 13, fontWeight: 500, color: "var(--cg-fg-2)" }}>In Slack, go to:</div>
                <div style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)", flexWrap: "wrap" }}>
                  {["Your bot", "Home", "Connection tab"].map((step, i, arr) => (
                    <div key={step} style={{ display: "flex", alignItems: "center", gap: "var(--cg-sp-2)" }}>
                      <span style={{
                        background: "var(--cg-bg-card)",
                        border: "1px solid var(--cg-border)",
                        borderRadius: "var(--cg-radius-sm)",
                        padding: "3px 10px",
                        fontSize: 13, fontWeight: 500, color: "var(--cg-fg-1)",
                      }}>{step}</span>
                      {i < arr.length - 1 && (
                        <span style={{ color: "var(--cg-fg-4)", fontSize: 13 }}>→</span>
                      )}
                    </div>
                  ))}
                </div>
                <div style={{ fontSize: 13, color: "var(--cg-fg-3)" }}>
                  Paste your key in the <strong style={{ color: "var(--cg-fg-2)" }}>API Key</strong> field and click Connect.
                </div>
              </div>

              {/* key display */}
              <div style={{
                background: "var(--cg-bg-card)",
                border: "1px solid var(--cg-divider)",
                borderRadius: "var(--cg-radius)",
                padding: "var(--cg-sp-3) var(--cg-sp-4)",
                display: "flex", alignItems: "center", justifyContent: "space-between", gap: "var(--cg-sp-3)",
              }}>
                <code style={{
                  fontSize: 13, fontFamily: "var(--cg-font-mono, ui-monospace, monospace)",
                  color: "var(--cg-fg-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                }}>
                  {MOCK_KEY_MASKED}
                </code>
                <button
                  onClick={handleCopyAgain}
                  className="cg-btn cg-btn-neutral cg-btn-sm"
                  style={{ gap: 4, flexShrink: 0 }}
                >
                  {copyAgainDone
                    ? <><IconCheck size={12} /> Copied</>
                    : <><IconCopy size={12} /> Copy again</>
                  }
                </button>
              </div>

              {/* CTAs */}
              <div style={{ display: "flex", gap: "var(--cg-sp-3)", alignItems: "center" }}>
                <button
                  className="cg-btn cg-btn-primary"
                  onClick={onOpenSlack}
                  style={{ gap: 8 }}
                >
                  <IconBrandSlack size={15} />
                  Open in Slack
                </button>
                <span style={{ fontSize: 13, color: "var(--cg-fg-4)" }}>
                  or switch to your Slack app and paste manually
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

/* ── main export ────────────────────────────────────────────────────────────── */
export default function IntegrationsTab() {
  const [slackPhase, setSlackPhase] = useState<SlackPhase>("idle");
  const [keyName, setKeyName] = useState(`${AGENT_NAME} — Slack ${WORKSPACE_NAME}`);
  const [keyScope, setKeyScope] = useState<"agent" | "all">("agent");
  const [generating, setGenerating] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  }

  function handleConnect() {
    setSlackPhase("connecting");
    setTimeout(() => setSlackPhase("completing"), 1200);
  }

  function handleGenerate() {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      navigator.clipboard.writeText(MOCK_KEY).catch(() => {});
      setSlackPhase("key_ready");
    }, 700);
  }

  function handleCopyAgain() {
    navigator.clipboard.writeText(MOCK_KEY).catch(() => {});
  }

  function handleOpenSlack() {
    setSlackPhase("connected");
    showToast("Agent activated in Slack workspace HS360");
  }

  function handleDisconnect() {
    setSlackPhase("idle");
    setKeyName(`${AGENT_NAME} — Slack ${WORKSPACE_NAME}`);
    setKeyScope("agent");
  }

  /* completion wizard — full tab takeover */
  if (slackPhase === "completing" || slackPhase === "key_ready") {
    return (
      <>
        <SlackCompletionScreen
          phase={slackPhase}
          keyName={keyName}
          setKeyName={setKeyName}
          keyScope={keyScope}
          setKeyScope={setKeyScope}
          generating={generating}
          onGenerate={handleGenerate}
          onCopyAgain={handleCopyAgain}
          onOpenSlack={handleOpenSlack}
          onBack={() => setSlackPhase("idle")}
        />
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
      </>
    );
  }

  /* integrations grid */
  return (
    <div style={{ padding: "var(--cg-sp-7) var(--cg-sp-8)" }}>

      {/* setup-incomplete resume banner */}
      {false && (
        <div className="cg-alert" style={{
          background: "var(--cg-warning-100)",
          border: "1px solid rgba(255,159,67,0.35)",
          color: "var(--cg-warning-700)",
          marginBottom: "var(--cg-sp-6)",
        }}>
          <IconAlertCircle size={16} style={{ flexShrink: 0, marginTop: 1 }} />
          <div>
            <strong>Slack setup incomplete.</strong> You connected the workspace but haven't activated the agent yet.{" "}
            <button
              onClick={() => setSlackPhase("completing")}
              style={{ fontWeight: 600, color: "var(--cg-warning-700)", background: "none", border: "none", cursor: "pointer", textDecoration: "underline", padding: 0, fontSize: "inherit" }}
            >
              Finish setup
            </button>
          </div>
        </div>
      )}

      {/* grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "var(--cg-sp-4)",
        maxWidth: 900,
      }}>
        {/* Slack card — always first */}
        <SlackCard
          phase={slackPhase}
          onConnect={handleConnect}
          onManage={() => setSlackPhase("completing")}
          onDisconnect={handleDisconnect}
        />

        {/* other integrations */}
        {OTHER_INTEGRATIONS.map(card => (
          <IntegCard key={card.id} card={card} />
        ))}
      </div>

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

      <style>{`@keyframes modal-in { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }`}</style>
    </div>
  );
}
