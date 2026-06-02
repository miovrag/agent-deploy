'use client';

interface ToggleProps {
  checked: boolean;
  onChange: (val: boolean) => void;
  disabled?: boolean;
  id?: string;
}

export default function Toggle({ checked, onChange, disabled, id }: ToggleProps) {
  const trackColor = disabled
    ? 'var(--cg-gray-200)'
    : checked
      ? 'var(--cg-primary)'
      : 'var(--cg-gray-300)';

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
        borderRadius: 'var(--cg-radius-full)',
        border: 'none',
        padding: 2,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: `background-color var(--cg-dur-fast)`,
        backgroundColor: trackColor,
        flexShrink: 0,
        outline: 'none',
      }}
      onFocus={(e) => {
        if (!disabled) e.currentTarget.style.boxShadow = '0 0 0 3px var(--cg-primary-16)';
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
          backgroundColor: 'var(--cg-bg-card)',
          boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
          transition: 'transform var(--cg-dur-fast) var(--cg-ease)',
          transform: checked ? 'translateX(16px)' : 'translateX(0)',
          flexShrink: 0,
        }}
      />
    </button>
  );
}
