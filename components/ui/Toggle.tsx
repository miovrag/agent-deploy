'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export default function Toggle({ checked, onChange, disabled, id }: ToggleProps) {
  const trackColor = disabled ? '#DBDADE' : checked ? '#7367F0' : '#D4D4D4';

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        width: 36,
        height: 20,
        borderRadius: 1000,
        border: 'none',
        padding: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'background-color 200ms',
        backgroundColor: trackColor,
        flexShrink: 0,
        outline: 'none',
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.boxShadow = '0 0 0 3px rgba(115,103,240,0.2)';
      }}
      onBlur={(e) => {
        e.currentTarget.style.boxShadow = 'none';
      }}
    >
      <span
        style={{
          width: 16,
          height: 16,
          borderRadius: '50%',
          backgroundColor: '#FFFFFF',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'transform 200ms cubic-bezier(0,0,0.2,1)',
          transform: checked ? 'translateX(16px)' : 'translateX(0)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}
