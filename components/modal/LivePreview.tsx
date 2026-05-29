'use client';

import { IconPosition, IconSize, ChatWindowPosition } from '@/lib/types';

interface LivePreviewProps {
  iconPosition: IconPosition;
  chatWindowPosition: ChatWindowPosition;
  iconSize: IconSize;
}

const ICON_DIAMETER: Record<IconSize, number> = { small: 11, medium: 14, large: 18 };

export default function LivePreview({ iconPosition, chatWindowPosition, iconSize }: LivePreviewProps) {
  const d = ICON_DIAMETER[iconSize];
  const isRight = iconPosition === 'right';
  const showWindow = chatWindowPosition !== 'bubble';
  const windowW = chatWindowPosition === 'focus' ? 82 : 62;
  const windowH = chatWindowPosition === 'focus' ? 88 : 68;

  return (
    <div
      style={{
        width: 120,
        height: 90,
        border: '1px solid #E5E5E5',
        borderRadius: 6,
        backgroundColor: '#FAFAFA',
        position: 'relative',
        overflow: 'hidden',
        flexShrink: 0,
        transition: 'all 200ms',
      }}
    >
      {/* Browser chrome */}
      <div
        style={{
          height: 14,
          backgroundColor: '#FFF',
          borderBottom: '1px solid #E5E5E5',
          display: 'flex',
          alignItems: 'center',
          paddingLeft: 6,
          gap: 3,
        }}
      >
        {['#EA5455', '#FF9F43', '#28C76F'].map((c) => (
          <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c, flexShrink: 0 }} />
        ))}
        <div style={{ flex: 1, height: 4, backgroundColor: '#E5E5E5', borderRadius: 2, marginLeft: 4, marginRight: 6 }} />
      </div>

      {/* Page content */}
      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ height: 5, width: '75%', backgroundColor: '#D4D4D4', borderRadius: 2 }} />
        <div style={{ height: 4, width: '58%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
        <div style={{ height: 4, width: '68%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
        <div style={{ height: 4, width: '48%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
      </div>

      {/* Chat window */}
      {showWindow && (
        <div
          style={{
            position: 'absolute',
            bottom: d + 10,
            right: isRight ? 5 : undefined,
            left: !isRight ? 5 : undefined,
            width: windowW,
            height: windowH,
            backgroundColor: '#FFF',
            borderRadius: 5,
            boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
            border: '1px solid #E5E5E5',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
            transition: 'all 200ms cubic-bezier(0,0,0.2,1)',
          }}
        >
          {/* Window header */}
          <div
            style={{
              height: 14,
              backgroundColor: '#7367F0',
              display: 'flex',
              alignItems: 'center',
              paddingLeft: 6,
              paddingRight: 6,
              gap: 4,
            }}
          >
            <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
            <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
          </div>
          {/* Bubbles */}
          <div
            style={{
              flex: 1,
              padding: 5,
              display: 'flex',
              flexDirection: 'column',
              gap: 4,
              justifyContent: 'flex-end',
            }}
          >
            <div
              style={{
                alignSelf: 'flex-start',
                backgroundColor: '#EAE8FD',
                borderRadius: '6px 6px 6px 2px',
                padding: '3px 5px',
                maxWidth: '70%',
              }}
            >
              <div style={{ height: 3, width: 22, backgroundColor: '#A39BF6', borderRadius: 1 }} />
            </div>
            <div
              style={{
                alignSelf: 'flex-end',
                backgroundColor: '#7367F0',
                borderRadius: '6px 6px 2px 6px',
                padding: '3px 5px',
                maxWidth: '70%',
              }}
            >
              <div style={{ height: 3, width: 16, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
            </div>
          </div>
          {/* Input area */}
          <div style={{ height: 10, backgroundColor: '#F5F5F5', borderTop: '1px solid #E5E5E5' }} />
        </div>
      )}

      {/* Widget icon */}
      <div
        style={{
          position: 'absolute',
          bottom: 6,
          right: isRight ? 6 : undefined,
          left: !isRight ? 6 : undefined,
          width: d,
          height: d,
          borderRadius: '50%',
          backgroundColor: '#7367F0',
          boxShadow: '0 2px 6px rgba(115,103,240,0.45)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms cubic-bezier(0,0,0.2,1)',
          flexShrink: 0,
        }}
      >
        <div
          style={{
            width: d * 0.48,
            height: d * 0.48,
            backgroundColor: 'rgba(255,255,255,0.85)',
            borderRadius: '50%',
          }}
        />
      </div>
    </div>
  );
}
