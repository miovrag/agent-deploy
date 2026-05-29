'use client';

import Toggle from '@/components/ui/Toggle';
import { IconInfoCircle, IconAlertTriangle } from '@/components/ui/Icons';
import { LiveChatSettings } from '@/lib/types';

interface Props {
  settings: LiveChatSettings;
  onChange: <K extends keyof LiveChatSettings>(key: K, value: LiveChatSettings[K]) => void;
}

function HelpBtn({ title }: { title: string }) {
  return (
    <span title={title} style={{ color: '#A3A3A3', display: 'inline-flex', flexShrink: 0 }}>
      <IconInfoCircle size={14} />
    </span>
  );
}

function ToggleRow({
  label,
  description,
  helpText,
  checked,
  onChange,
  disabled,
  warning,
}: {
  label: string;
  description?: string;
  helpText?: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  warning?: string;
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: description ? 'flex-start' : 'center',
          justifyContent: 'space-between',
          gap: 16,
          paddingTop: 12,
          paddingBottom: warning ? 8 : 12,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 14, lineHeight: '20px', color: disabled ? '#737373' : '#404040' }}>
              {label}
            </span>
            {helpText && <HelpBtn title={helpText} />}
          </div>
          {description && (
            <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: '#737373' }}>
              {description}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, paddingTop: description ? 2 : 0 }}>
          <Toggle checked={checked} onChange={onChange} disabled={disabled} />
          <span
            style={{
              fontSize: 12,
              fontWeight: 500,
              color: checked && !disabled ? '#7367F0' : '#A3A3A3',
              minWidth: 48,
            }}
          >
            {checked ? 'Enabled' : 'Disabled'}
          </span>
        </div>
      </div>
      {warning && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            gap: 8,
            backgroundColor: '#FFF7EE',
            border: '1px solid #FECDA0',
            borderRadius: 6,
            padding: '8px 12px',
            marginBottom: 8,
          }}
        >
          <span style={{ color: '#FF9F43', lineHeight: 1, flexShrink: 0, marginTop: 1, display: 'inline-flex' }}>
            <IconAlertTriangle size={14} />
          </span>
          <p style={{ margin: 0, fontSize: 12, lineHeight: '18px', color: '#92400E' }}>{warning}</p>
        </div>
      )}
    </div>
  );
}

function RowDivider() {
  return <div style={{ height: 1, backgroundColor: '#F5F5F5' }} />;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        margin: 0,
        fontSize: 11,
        fontWeight: 600,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        color: '#A3A3A3',
      }}
    >
      {children}
    </p>
  );
}

export default function BehaviorTab({ settings, onChange }: Props) {
  const autoStartConflict = settings.autoStartConversation && settings.dontPromptMobile;

  return (
    <div>
      {/* Agent behavior */}
      <SectionHeader>Agent Initiative</SectionHeader>
      <p style={{ margin: '4px 0 0', fontSize: 12, lineHeight: '16px', color: '#737373' }}>
        If enabled, the agent will take the initiative and display the first Starter Question as a suggested prompt next to its avatar.
      </p>
      <div style={{ borderBottom: '1px solid #E5E5E5', marginBottom: 24 }}>
        <ToggleRow
          label="Prompt user with a Starter Question"
          description="If enabled, the agent will take the initiative and display the first Starter Question as a suggested prompt next to its avatar."
          checked={settings.promptStarterQuestion}
          onChange={(v) => onChange('promptStarterQuestion', v)}
        />
        <RowDivider />
        <ToggleRow
          label="Automatically start the conversation"
          description="When enabled, clicking the Agent Initiative prompt will automatically send the message and initiate the conversation. Each use will count toward your query limit."
          checked={settings.autoStartConversation}
          onChange={(v) => onChange('autoStartConversation', v)}
        />
        <RowDivider />
        <ToggleRow
          label="Hide prompt from Starter Question list"
          helpText="Hides the starter question from the visible prompt list"
          checked={settings.hidePromptFromList}
          onChange={(v) => onChange('hidePromptFromList', v)}
          disabled={!settings.promptStarterQuestion}
        />
        <RowDivider />
        <ToggleRow
          label="Don't prompt user on mobile"
          description="When enabled, the agent will not display the first Starter Question on mobile. Use this if Starter Questions cover important elements on the page."
          checked={settings.dontPromptMobile}
          onChange={(v) => onChange('dontPromptMobile', v)}
          disabled={!settings.promptStarterQuestion}
          warning={
            autoStartConflict
              ? "Auto-start is active on desktop only when 'Don't prompt on mobile' is on."
              : undefined
          }
        />
      </div>

      {/* Auto-popup */}
      <SectionHeader>Auto-popup</SectionHeader>
      <div>
        <ToggleRow
          label="Pop up chat bubble (Desktop)"
          helpText="Automatically expand the chat bubble for desktop visitors"
          checked={settings.autoPopupDesktop}
          onChange={(v) => onChange('autoPopupDesktop', v)}
          disabled={settings.promptStarterQuestion}
        />
        <RowDivider />
        <ToggleRow
          label="Pop up chat bubble (Mobile)"
          helpText="Automatically expand the chat bubble for mobile visitors"
          checked={settings.autoPopupMobile}
          onChange={(v) => onChange('autoPopupMobile', v)}
          disabled={settings.promptStarterQuestion}
        />
        <RowDivider />
        <ToggleRow
          label="Reset previous conversation"
          helpText="Clear conversation history each time a visitor opens the chat"
          checked={settings.resetPreviousConversation}
          onChange={(v) => onChange('resetPreviousConversation', v)}
        />
        <RowDivider />
        <ToggleRow
          label="Keep conversation open"
          helpText="Keep the chat window open when the visitor navigates to another page"
          checked={settings.keepConversationOpen}
          onChange={(v) => onChange('keepConversationOpen', v)}
          disabled={settings.resetPreviousConversation}
        />
      </div>
    </div>
  );
}
