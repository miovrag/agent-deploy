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
        <span style={{ display: 'block', fontSize: 14, lineHeight: '20px', color: '#404040' }}>{label}</span>
        {description && (
          <span style={{ display: 'block', fontSize: 12, lineHeight: '16px', color: '#737373', marginTop: 2 }}>
            {description}
          </span>
        )}
      </span>
    </label>
  );
}

function HelpBtn({ title }: { title: string }) {
  return (
    <span title={title} style={{ color: '#A3A3A3', display: 'inline-flex', flexShrink: 0 }}>
      <IconInfoCircle size={14} />
    </span>
  );
}

function Divider() {
  return <div style={{ height: 1, backgroundColor: '#E5E5E5' }} />;
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', margin: '0 0 12px 0' }}>
      {children}
    </p>
  );
}

export default function AppearanceTab({ settings, onChange }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Agent icon position */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
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
        <LivePreview
          iconPosition={settings.iconPosition}
          chatWindowPosition={settings.chatWindowPosition}
          iconSize={settings.iconSize}
        />
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16 }}>
        <div style={{ flex: 1 }}>
          <div style={{ marginBottom: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', margin: 0 }}>Chat window position</p>
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: '#737373' }}>
              Choose the chat window position as size for your agent.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {[
              { v: 'focus', l: 'Focus mode', d: 'Larger, centered chat window for an immersive experience — ideal for long-form conversations.' },
              { v: 'compact', l: 'Compact', d: 'Smaller window anchored near the icon, allowing visitors to browse while chatting.' },
              { v: 'bubble', l: 'Bubble in the corner', d: 'Lightweight bubble-style window in the corner, keeping the chat subtle and unobtrusive.' },
            ].map(({ v, l, d }) => (
              <RadioOption
                key={v}
                name="chatWindowPosition"
                value={v}
                checked={settings.chatWindowPosition === v}
                onChange={() => onChange('chatWindowPosition', v as LiveChatSettings['chatWindowPosition'])}
                label={l}
                description={d}
              />
            ))}
          </div>
        </div>
        <LivePreview
          iconPosition={settings.iconPosition}
          chatWindowPosition={settings.chatWindowPosition}
          iconSize={settings.iconSize}
        />
      </div>

      <Divider />

      {/* Mobile font size */}
      <div>
        <div style={{ marginBottom: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#171717', margin: 0 }}>Mobile font size</p>
          </div>
          <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: '#737373' }}>
            If &ldquo;Reduced&rdquo; is selected, text on viewports under 700px will appear one size smaller than on desktop. If not, the font size remains consistent across all viewports.
          </p>
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
  );
}
