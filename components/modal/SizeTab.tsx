'use client';

import { useState } from 'react';
import { LiveChatSettings } from '@/lib/types';
import { IconInfoCircle } from '@/components/ui/Icons';

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

const WIDTH_MIN = 200;
const WIDTH_MAX = 800;
const WIDTH_REC_MIN = 360;
const WIDTH_REC_MAX = 500;

export default function SizeTab({ settings, onChange }: Props) {
  const [widgetType, setWidgetType] = useState<'bubble' | 'embed'>('bubble');
  const [widthError, setWidthError] = useState<string | null>(null);
  const [widthFocused, setWidthFocused] = useState(false);

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

  const inputBase: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 40px 0 12px',
    fontSize: 14,
    color: isDisabled ? '#A3A3A3' : '#404040',
    backgroundColor: isDisabled ? '#FAFAFA' : '#FFF',
    border: `1px solid ${isDisabled ? '#E5E5E5' : widthError ? '#EA5455' : widthFocused ? '#7367F0' : '#D4D4D4'}`,
    borderRadius: 8,
    outline: 'none',
    transition: 'border-color 120ms',
    boxSizing: 'border-box',
    cursor: isDisabled ? 'not-allowed' : 'text',
  };

  const selectBase: React.CSSProperties = {
    width: '100%',
    height: 40,
    padding: '0 12px',
    fontSize: 14,
    color: isDisabled ? '#A3A3A3' : '#404040',
    backgroundColor: isDisabled ? '#FAFAFA' : '#FFF',
    border: `1px solid ${isDisabled ? '#E5E5E5' : '#D4D4D4'}`,
    borderRadius: 8,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    cursor: isDisabled ? 'not-allowed' : 'pointer',
    backgroundImage: `url("data:image/svg+xml,%3Csvg width='10' height='6' viewBox='0 0 10 6' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M1 1L5 5L9 1' stroke='${isDisabled ? '%23D4D4D4' : '%23737373'}' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 12px center',
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>

      {/* Widget type selector */}
      <div>
        <p style={{ margin: '0 0 8px', fontSize: 14, fontWeight: 600, color: '#171717' }}>Widget type</p>
        <div style={{ display: 'flex', gap: 24 }}>
          {([
            { val: 'bubble', label: 'Floating bubble' },
            { val: 'embed', label: 'Embedded (iframe)' },
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
              <span style={{ fontSize: 14, lineHeight: '20px', color: '#404040' }}>{label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Info banner — only for bubble mode */}
      {isDisabled && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: 10,
          backgroundColor: 'rgba(115,103,240,0.06)',
          border: '1px solid rgba(115,103,240,0.2)',
          borderRadius: 8,
          padding: '12px 16px',
        }}>
          <span style={{ color: '#7367F0', display: 'inline-flex', flexShrink: 0, marginTop: 1 }}>
            <IconInfoCircle size={16} />
          </span>
          <p style={{ margin: 0, fontSize: 13, lineHeight: '20px', color: '#525252' }}>
            Size is managed automatically by the floating bubble. Switch to <strong>Embedded (iframe)</strong> to set custom dimensions.
          </p>
        </div>
      )}

      {/* Fields */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24, pointerEvents: isDisabled ? 'none' : 'auto' }}>

        {/* Width */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <label
                htmlFor="chat-width"
                style={{ fontSize: 14, fontWeight: 600, color: isDisabled ? '#A3A3A3' : '#171717', cursor: isDisabled ? 'default' : 'pointer' }}
              >
                Width
              </label>
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: isDisabled ? '#A3A3A3' : '#737373' }}>
              Control the width of the chat bubble.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
            <input
              id="chat-width"
              type="number"
              disabled={isDisabled}
              value={settings.width}
              style={inputBase}
              onFocus={() => !isDisabled && setWidthFocused(true)}
              onChange={(e) => {
                const v = parseInt(e.target.value, 10);
                if (!isNaN(v)) onChange('width', v);
              }}
              onBlur={(e) => !isDisabled && handleWidthBlur(parseInt(e.target.value, 10))}
            />
            <span style={{
              position: 'absolute',
              right: 12,
              top: '50%',
              transform: 'translateY(-50%)',
              fontSize: 13,
              color: isDisabled ? '#D4D4D4' : '#A3A3A3',
              pointerEvents: 'none',
            }}>
              px
            </span>
          </div>
          {widthError && !isDisabled ? (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: '#EA5455', lineHeight: '16px' }}>
              {widthError}
            </p>
          ) : (
            <p style={{ margin: '6px 0 0', fontSize: 12, color: isDisabled ? '#A3A3A3' : '#737373', lineHeight: '16px' }}>
              Recommended: {WIDTH_REC_MIN}–{WIDTH_REC_MAX}px
            </p>
          )}
        </div>

        {/* Height */}
        <div>
          <div style={{ marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <label
                htmlFor="chat-height-mode"
                style={{ fontSize: 14, fontWeight: 600, color: isDisabled ? '#A3A3A3' : '#171717', cursor: isDisabled ? 'default' : 'pointer' }}
              >
                Height
              </label>
            </div>
            <p style={{ margin: 0, fontSize: 12, lineHeight: '16px', color: isDisabled ? '#A3A3A3' : '#737373' }}>
              Control the height of the chat bubble.
            </p>
          </div>
          <div style={{ position: 'relative' }}>
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
          </div>

          <div
            className="height-input-wrap"
            data-visible={settings.heightMode === 'fixed' ? 'true' : 'false'}
          >
            <div style={{ position: 'relative', marginTop: 10 }}>
              <input
                id="chat-height"
                type="number"
                disabled={isDisabled}
                value={settings.height}
                style={{ ...inputBase, border: `1px solid ${isDisabled ? '#E5E5E5' : '#D4D4D4'}` }}
                onChange={(e) => {
                  const v = parseInt(e.target.value, 10);
                  if (!isNaN(v)) onChange('height', v);
                }}
              />
              <span style={{
                position: 'absolute',
                right: 12,
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 13,
                color: isDisabled ? '#D4D4D4' : '#A3A3A3',
                pointerEvents: 'none',
              }}>
                px
              </span>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: 12, color: isDisabled ? '#A3A3A3' : '#737373', lineHeight: '16px' }}>
              Recommended: 600–800px
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
