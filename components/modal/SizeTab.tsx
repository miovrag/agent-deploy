'use client';

import { useState } from 'react';
import { LiveChatSettings } from '@/lib/types';
import { IconInfoCircle } from '@/components/ui/Icons';

interface Props {
  settings: LiveChatSettings;
  onChange: <K extends keyof LiveChatSettings>(key: K, value: LiveChatSettings[K]) => void;
}

const WIDTH_MIN = 200;
const WIDTH_MAX = 800;
const WIDTH_REC_MIN = 360;
const WIDTH_REC_MAX = 500;

export default function SizeTab({ settings, onChange }: Props) {
  const [widgetType, setWidgetType] = useState<'bubble' | 'embed'>('bubble');
  const [widthError, setWidthError] = useState<string | null>(null);
  const [heightError, setHeightError] = useState<string | null>(null);
  const [widthFocused, setWidthFocused] = useState(false);
  const [heightFocused, setHeightFocused] = useState(false);

  const isDisabled = widgetType === 'bubble';

  function handleWidthBlur(val: number) {
    setWidthFocused(false);
    if (val < WIDTH_MIN || val > WIDTH_MAX) {
      setWidthError(`Enter a value between ${WIDTH_MIN}–${WIDTH_MAX}px.`);
    } else if (val < WIDTH_REC_MIN || val > WIDTH_REC_MAX) {
      setWidthError(`This width may clip the chat window. Recommended: ${WIDTH_REC_MIN}–${WIDTH_REC_MAX}px.`);
    } else {
      setWidthError(null);
    }
  }

  function handleHeightBlur(val: number) {
    setHeightFocused(false);
    if (isNaN(val) || val < 300 || val > 1200) {
      setHeightError('Enter a value between 300–1200px.');
    } else if (val < 600 || val > 800) {
      setHeightError('This height may clip content. Recommended: 600–800px.');
    } else {
      setHeightError(null);
    }
  }

  const inputBase: React.CSSProperties = {
    flex: 1,
    height: 40,
    padding: '0 12px',
    fontSize: 14,
    color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-2)',
    backgroundColor: isDisabled ? 'var(--cg-bg-body)' : 'var(--cg-bg-card)',
    borderRadius: 'var(--cg-radius)',
    outline: 'none',
    transition: 'border-color var(--cg-dur-fast)',
    boxSizing: 'border-box',
    cursor: isDisabled ? 'not-allowed' : 'text',
  };

  const selectBase: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 12px',
    fontSize: 14,
    color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-2)',
    backgroundColor: isDisabled ? 'var(--cg-bg-body)' : 'var(--cg-bg-card)',
    border: `1px solid ${isDisabled ? 'var(--cg-divider)' : 'var(--cg-border)'}`,
    borderRadius: 'var(--cg-radius)',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    /* SVG data URI — CSS vars not supported in data URIs */
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='${isDisabled ? '%23D4D4D4' : '%23737373'}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  const pxLabel: React.CSSProperties = {
    fontSize: 13,
    color: isDisabled ? 'var(--cg-gray-300)' : 'var(--cg-fg-4)',
    flexShrink: 0,
    userSelect: 'none',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Widget type */}
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: 'var(--cg-fg-1)' }}>Widget type</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {([
            { val: 'bubble', label: 'Floating bubble' },
            { val: 'embed',  label: 'Embedded (iframe)' },
          ] as const).map(({ val, label }) => (
            <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', userSelect: 'none' }}>
              <input
                type="radio"
                name="widgetType"
                value={val}
                checked={widgetType === val}
                onChange={() => setWidgetType(val)}
                className="cg-radio"
              />
              <span style={{ fontSize: 14, lineHeight: '20px', color: 'var(--cg-fg-2)' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info banner — floating bubble mode */}
      {isDisabled && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 12,
          backgroundColor: 'var(--cg-primary-8)',
          border: '1px solid var(--cg-primary-24)',
          borderRadius: 'var(--cg-radius)',
          padding: '12px 16px',
        }}>
          <span style={{ color: 'var(--cg-primary)', display: 'inline-flex', flexShrink: 0, marginTop: 1 }}>
            <IconInfoCircle size={16} />
          </span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: 'var(--cg-gray-600)' }}>
            Size is managed automatically by the floating bubble. Switch to <strong>Embedded (iframe)</strong> to set custom dimensions.
          </p>
        </div>
      )}

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, pointerEvents: isDisabled ? 'none' : 'auto' }}>

        {/* Width */}
        <div>
          <label
            htmlFor="chat-width"
            style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4, color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-1)', cursor: isDisabled ? 'default' : 'pointer' }}
          >
            Width
          </label>
          <p style={{ margin: '0 0 8px', fontSize: 12, lineHeight: '16px', color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-3)' }}>
            Control the width of the chat bubble.
          </p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <input
              id="chat-width"
              type="number"
              disabled={isDisabled}
              value={settings.width}
              style={{
                ...inputBase,
                border: `1px solid ${
                  isDisabled ? 'var(--cg-divider)'
                  : widthError ? 'var(--cg-danger)'
                  : widthFocused ? 'var(--cg-primary)'
                  : 'var(--cg-border)'
                }`,
              }}
              onFocus={() => !isDisabled && setWidthFocused(true)}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onChange('width', v);
              }}
              onBlur={(e) => !isDisabled && handleWidthBlur(parseInt(e.target.value, 10))}
            />
            <span style={pxLabel}>px</span>
          </div>
          {widthError && !isDisabled ? (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--cg-danger)', lineHeight: '16px' }}>{widthError}</p>
          ) : (
            <p style={{ margin: '4px 0 0', fontSize: 12, color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-3)', lineHeight: '16px' }}>
              Recommended: {WIDTH_REC_MIN}–{WIDTH_REC_MAX}px
            </p>
          )}
        </div>

        {/* Height */}
        <div>
          <label
            htmlFor="chat-height-mode"
            style={{ display: 'block', fontSize: 14, fontWeight: 600, marginBottom: 4, color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-1)', cursor: isDisabled ? 'default' : 'pointer' }}
          >
            Height
          </label>
          <p style={{ margin: '0 0 8px', fontSize: 12, lineHeight: '16px', color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-3)' }}>
            Control the height of the chat bubble.
          </p>

          {/* Fixed / Dynamic select */}
          <select
            id="chat-height-mode"
            disabled={isDisabled}
            value={settings.heightMode}
            onChange={(e) => onChange('heightMode', e.target.value as 'fixed' | 'dynamic')}
            style={selectBase}
          >
            <option value="fixed">Fixed</option>
            <option value="dynamic">Dynamic</option>
          </select>

          {/* Height value — only shown for fixed mode */}
          {settings.heightMode === 'fixed' && (
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  id="chat-height"
                  type="number"
                  disabled={isDisabled}
                  value={settings.height}
                  style={{
                    ...inputBase,
                    border: `1px solid ${
                      isDisabled ? 'var(--cg-divider)'
                      : heightError ? 'var(--cg-danger)'
                      : heightFocused ? 'var(--cg-primary)'
                      : 'var(--cg-border)'
                    }`,
                  }}
                  onFocus={() => !isDisabled && setHeightFocused(true)}
                  onChange={(e) => {
                    const v = parseInt(e.target.value, 10);
                    if (!isNaN(v)) onChange('height', v);
                  }}
                  onBlur={(e) => !isDisabled && handleHeightBlur(parseInt(e.target.value, 10))}
                />
                <span style={pxLabel}>px</span>
              </div>
              {heightError && !isDisabled ? (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: 'var(--cg-danger)', lineHeight: '16px' }}>{heightError}</p>
              ) : (
                <p style={{ margin: '4px 0 0', fontSize: 12, color: isDisabled ? 'var(--cg-fg-4)' : 'var(--cg-fg-3)', lineHeight: '16px' }}>
                  Recommended: 600–800px
                </p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
