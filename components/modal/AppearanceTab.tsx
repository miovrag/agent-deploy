'use client';

import { LiveChatSettings } from '@/lib/types';
import LivePreview from './LivePreview';
import { IconInfoCircle } from '@/components/ui/Icons';

interface Props {
  settings: LiveChatSettings;
  onChange: <K extends keyof LiveChatSettings>(key: K, value: LiveChatSettings[K]) => void;
}

function RadioOption({
  name,
  value,
  checked,
  onChange,
  label,
  description,
}: {
  name: string;
  value: string;
  checked: boolean;
  onChange: () => void;
  label: string;
  description?: string;
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: description ? 'flex-start' : 'center',
        gap: 8,
        cursor: 'pointer',
        userSelect: 'none',
      }}
    >
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        className="cg-radio"
        style={{ marginTop: description ? 3 : 0 }}
      />
      <span>
        <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', color: 'var(--cg-fg-2)' }}>{label}</span>
        {description && (
          <span style={{ display: 'block', fontSize: 12, lineHeight: '16px', color: 'var(--cg-fg-3)', marginTop: 2 }}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: 'var(--cg-divider)' }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--cg-fg-1)', margin: '0 0 12px 0' }}>
      {children}
    </p>
  );
}

function HelpBtn({ title }: { title: string }) {
  return (
    <span title={title} style={{ color: 'var(--cg-fg-4)', display: 'inline-flex', flexShrink: 0, cursor: 'help' }}>
      <IconInfoCircle size={14} />
    </span>
  );
}

export default function AppearanceTab({ settings, onChange }: Props) {
  return (
    <div style={{ display: 'flex', gap: 24 }}>

      {/* Settings column */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 16, minWidth: 0 }}>

        {/* Agent icon position */}
        <div>
          <SectionLabel>Agent icon position</SectionLabel>
          <div style={{ display: 'flex', gap: 24 }}>
            <RadioOption
              name="iconPosition"
              value="left"
              checked={settings.iconPosition === 'left'}
              onChange={() => onChange('iconPosition', 'left')}
              label="Left"
            />
            <RadioOption
              name="iconPosition"
              value="right"
              checked={settings.iconPosition === 'right'}
              onChange={() => onChange('iconPosition', 'right')}
              label="Right"
            />
          </div>
        </div>

        <Divider />

        {/* Agent icon size */}
        <div>
          <SectionLabel>Agent icon size</SectionLabel>
          <div style={{ display: 'flex', gap: 24 }}>
            {(['small', 'medium', 'large'] as const).map((s) => (
              <RadioOption
                key={s}
                name="iconSize"
                value={s}
                checked={settings.iconSize === s}
                onChange={() => onChange('iconSize', s)}
                label={s.charAt(0).toUpperCase() + s.slice(1)}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* Chat window position */}
        <div>
          <SectionLabel>Chat window position</SectionLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {([
              { v: 'focus',   l: 'Focus mode' },
              { v: 'compact', l: 'Compact' },
              { v: 'bubble',  l: 'Bubble in the corner' },
            ] as const).map(({ v, l }) => (
              <RadioOption
                key={v}
                name="chatWindowPosition"
                value={v}
                checked={settings.chatWindowPosition === v}
                onChange={() => onChange('chatWindowPosition', v)}
                label={l}
              />
            ))}
          </div>
        </div>

        <Divider />

        {/* Mobile font size */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--cg-fg-1)', margin: 0 }}>Mobile font size</p>
            <HelpBtn title="If 'Reduced' is selected, text on viewports under 700px will appear one size smaller than on desktop. If not, the font size remains consistent across all viewports." />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <RadioOption
              name="mobileFontSize"
              value="reduced"
              checked={settings.mobileFontSize === 'reduced'}
              onChange={() => onChange('mobileFontSize', 'reduced')}
              label="Reduced"
            />
            <RadioOption
              name="mobileFontSize"
              value="desktop"
              checked={settings.mobileFontSize === 'desktop'}
              onChange={() => onChange('mobileFontSize', 'desktop')}
              label="Same as Desktop"
            />
          </div>
        </div>

      </div>

      {/* Preview column — stays visible while any setting is changed */}
      <div style={{
        flexShrink: 0,
        width: 132,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: 6,
      }}>
        <p style={{ margin: 0, fontSize: 12, fontWeight: 500, color: 'var(--cg-fg-3)' }}>Preview</p>
        <LivePreview
          iconPosition={settings.iconPosition}
          chatWindowPosition={settings.chatWindowPosition}
          iconSize={settings.iconSize}
        />
      </div>

    </div>
  );
}
