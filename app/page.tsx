"use client";

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
} from "@tabler/icons-react";

/* ── Sidebar nav items ─────────────────────────────────────────────────── */
const agentTabs = [
  { id: "build",        label: "Build",        icon: <IconFiles size={16} /> },
  { id: "personalize",  label: "Personalize",  icon: <IconSparkles size={16} /> },
  { id: "actions",      label: "Actions",      icon: <IconPlugConnected size={16} /> },
  { id: "intelligence", label: "Intelligence", icon: <IconBrain size={16} /> },
  { id: "deploy",       label: "Deploy",       icon: <IconRocket size={16} />, active: true },
];

/* ── Deploy channel cards ──────────────────────────────────────────────── */
const deployChannels = [
  {
    id: "share-link",
    label: "Share Link",
    icon: "ti ti-link",
    description: "Share a public URL anyone can open in their browser.",
    badge: null,
  },
  {
    id: "embed",
    label: "Embed Widget",
    icon: "ti ti-code",
    description: "Add a chat bubble to any website with a single script tag.",
    badge: null,
  },
  {
    id: "live-chat",
    label: "Live Chat",
    icon: "ti ti-message-dots",
    description: "Full-page chat experience hosted on CustomGPT.",
    badge: "Popular",
  },
  {
    id: "api",
    label: "API",
    icon: "ti ti-terminal-2",
    description: "Integrate your agent into any app via REST API.",
    badge: null,
  },
  {
    id: "slack",
    label: "Slack",
    icon: "ti ti-brand-slack",
    description: "Add the agent as a Slack bot to any workspace.",
    badge: "New",
  },
  {
    id: "wordpress",
    label: "WordPress",
    icon: "ti ti-brand-wordpress",
    description: "Install the CustomGPT plugin on your WordPress site.",
    badge: null,
  },
];

/* ── Components ────────────────────────────────────────────────────────── */

function Sidebar() {
  return (
    <aside style={{
      width: 220,
      minHeight: "100vh",
      background: "var(--cg-bg-card)",
      borderRight: "1px solid var(--cg-divider)",
      display: "flex",
      flexDirection: "column",
      padding: "0",
      flexShrink: 0,
    }}>
      {/* Logo */}
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

      {/* Agent name */}
      <div style={{
        padding: "14px 16px",
        borderBottom: "1px solid var(--cg-divider)",
        display: "flex",
        alignItems: "center",
        gap: 8,
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

      {/* Nav */}
      <nav style={{ padding: "8px 8px", flex: 1 }}>
        {agentTabs.map(tab => (
          <button key={tab.id} style={{
            width: "100%",
            display: "flex",
            alignItems: "center",
            gap: 10,
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
          }}>
            <span style={{ color: tab.active ? "var(--cg-primary)" : "var(--cg-fg-3)" }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}

function TopBar() {
  return (
    <div style={{
      height: 56,
      borderBottom: "1px solid var(--cg-divider)",
      display: "flex",
      alignItems: "center",
      padding: "0 24px",
      gap: 12,
      background: "var(--cg-bg-card)",
      flexShrink: 0,
    }}>
      <IconLayoutSidebar size={18} style={{ color: "var(--cg-fg-4)", cursor: "pointer" }} />
      <div style={{ flex: 1 }} />
      <button style={{
        width: 32, height: 32, borderRadius: "var(--cg-radius-sm)",
        border: "1px solid var(--cg-border)",
        background: "transparent",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "var(--cg-fg-3)",
      }}>
        <IconSearch size={16} />
      </button>
      <button style={{
        width: 32, height: 32, borderRadius: "var(--cg-radius-sm)",
        border: "1px solid var(--cg-border)",
        background: "transparent",
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

function PageHeader() {
  return (
    <div style={{ padding: "24px 32px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
        <IconRocket size={20} style={{ color: "var(--cg-primary)" }} />
        <h1 style={{ fontSize: 18, fontWeight: 700, color: "var(--cg-fg-1)", margin: 0 }}>Deploy</h1>
      </div>
      <p style={{ fontSize: 13, color: "var(--cg-fg-3)", margin: 0 }}>
        Choose how and where to share your agent.
      </p>
    </div>
  );
}

function ChannelCard({ channel }: { channel: typeof deployChannels[0] }) {
  return (
    <div style={{
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
        color: "var(--cg-primary)", fontSize: 20,
      }}>
        <i className={channel.icon} />
      </div>
      <div>
        <div style={{ fontSize: 14, fontWeight: 600, color: "var(--cg-fg-1)", marginBottom: 4 }}>
          {channel.label}
        </div>
        <div style={{ fontSize: 13, color: "var(--cg-fg-3)", lineHeight: 1.5 }}>
          {channel.description}
        </div>
      </div>
      <button style={{
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
      }}
        onMouseEnter={e => (e.currentTarget.style.background = "var(--cg-gray-100)")}
        onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
      >
        Configure
      </button>
    </div>
  );
}

/* ── Page ──────────────────────────────────────────────────────────────── */
export default function DeployPage() {
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

        <main style={{ flex: 1, padding: "0 0 48px" }}>
          <PageHeader />

          <div style={{ padding: "24px 32px" }}>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}>
              {deployChannels.map(ch => (
                <ChannelCard key={ch.id} channel={ch} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
