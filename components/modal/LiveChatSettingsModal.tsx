'use client';

import { useState, useCallback } from 'react';
import {
  LiveChatSettings,
  DEFAULT_SETTINGS,
  ActiveTab,
  SaveState,
} from '@/lib/types';
import AppearanceTab from './AppearanceTab';
import BehaviorTab from './BehaviorTab';
import SizeTab from './SizeTab';
import AdvancedTab from './AdvancedTab';
import { IconX, IconCheck } from '@/components/ui/Icons';

type Plan = 'standard' | 'premium' | 'enterprise';

interface Props {
  onClose: () => void;
  currentPlan?: Plan;
}

const TABS: { id: ActiveTab; label: string }[] = [
  { id: 'appearance', label: 'Appearance' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'size', label: 'Size' },
  { id: 'advanced', label: 'Advanced' },
];

function settingsEqual(a: LiveChatSettings, b: LiveChatSettings) {
  return JSON.stringify(a) === JSON.stringify(b);
}

export default function LiveChatSettingsModal({ onClose, currentPlan = 'standard' }: Props) {
  const [settings, setSettings] = useState<LiveChatSettings>(DEFAULT_SETTINGS);
  const [savedSettings, setSavedSettings] = useState<LiveChatSettings>(DEFAULT_SETTINGS);
  const [activeTab, setActiveTab] = useState<ActiveTab>('appearance');
  const [saveState, setSaveState] = useState<SaveState>('idle');
  const [showToast, setShowToast] = useState(false);
  const [showUnsavedDialog, setShowUnsavedDialog] = useState(false);

  const hasUnsaved = !settingsEqual(settings, savedSettings);

  const handleChange = useCallback(
    <K extends keyof LiveChatSettings>(key: K, value: LiveChatSettings[K]) => {
      setSettings((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  function handleSave() {
    if (saveState !== 'idle') return;
    setSaveState('saving');
    setTimeout(() => {
      setSavedSettings(settings);
      setSaveState('success');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      setTimeout(() => setSaveState('idle'), 2200);
    }, 1200);
  }

  function handleCloseRequest() {
    if (hasUnsaved) {
      setShowUnsavedDialog(true);
    } else {
      onClose();
    }
  }

  function handleDiscardAndClose() {
    setShowUnsavedDialog(false);
    onClose();
  }

  function handleSaveAndClose() {
    setShowUnsavedDialog(false);
    setSavedSettings(settings);
    onClose();
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={handleCloseRequest}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(23,23,23,0.55)',
          zIndex: 40,
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Live Chat Settings"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50,
          width: '100%',
          maxWidth: 680,
          height: 520,
          backgroundColor: '#FFFFFF',
          borderRadius: 16,
          boxShadow: '0 8px 32px 0 rgba(23,23,23,0.18)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Toast */}
        {showToast && (
          <div
            className="toast-enter"
            style={{
              position: 'absolute',
              top: 12,
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 10,
              backgroundColor: '#28C76F',
              color: '#FFF',
              fontSize: 13,
              fontWeight: 500,
              padding: '8px 16px',
              borderRadius: 8,
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              <IconCheck size={14} /> Live Chat Settings saved.
            </span>
          </div>
        )}

        {/* Header */}
        <div
          style={{
            padding: '20px 24px 0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: 18,
              fontWeight: 600,
              color: '#171717',
              lineHeight: '28px',
            }}
          >
            Live Chat Settings
          </h2>
          <button
            type="button"
            onClick={handleCloseRequest}
            aria-label="Close modal"
            style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              border: 'none',
              backgroundColor: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#737373',
              transition: 'background-color 120ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F5F5F5')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
          >
            <IconX size={18} />
          </button>
        </div>

        {/* Tab bar */}
        <div
          role="tablist"
          style={{
            display: 'flex',
            borderBottom: '1px solid #E5E5E5',
            padding: '0 24px',
            marginTop: 16,
            flexShrink: 0,
            gap: 4,
          }}
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: 14,
                  fontWeight: isActive ? 600 : 400,
                  color: isActive ? '#7367F0' : '#737373',
                  border: 'none',
                  borderBottom: isActive ? '2px solid #7367F0' : '2px solid transparent',
                  backgroundColor: 'transparent',
                  cursor: 'pointer',
                  marginBottom: -1,
                  transition: 'color 120ms, border-color 120ms',
                  whiteSpace: 'nowrap',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#404040';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#737373';
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Body */}
        <div
          className="modal-body"
          style={{
            flex: 1,
            overflowY: 'auto',
            padding: '24px 24px 8px',
          }}
        >
          {activeTab === 'appearance' && (
            <AppearanceTab settings={settings} onChange={handleChange} />
          )}
          {activeTab === 'behavior' && (
            <BehaviorTab settings={settings} onChange={handleChange} />
          )}
          {activeTab === 'size' && (
            <SizeTab settings={settings} onChange={handleChange} />
          )}
          {activeTab === 'advanced' && <AdvancedTab currentPlan={currentPlan} />}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: '1px solid #E5E5E5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <button
            type="button"
            onClick={handleCloseRequest}
            style={{
              height: 40,
              padding: '0 20px',
              fontSize: 14,
              fontWeight: 500,
              color: '#525252',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: 8,
              cursor: 'pointer',
              transition: 'background-color 120ms, border-color 120ms',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F5F5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            Cancel
          </button>

          <SaveButton state={saveState} hasUnsaved={hasUnsaved} onClick={handleSave} />
        </div>
      </div>

      {/* Unsaved changes dialog */}
      {showUnsavedDialog && (
        <UnsavedDialog
          onDiscard={handleDiscardAndClose}
          onSave={handleSaveAndClose}
          onCancel={() => setShowUnsavedDialog(false)}
        />
      )}
    </>
  );
}

function SaveButton({
  state,
  hasUnsaved,
  onClick,
}: {
  state: SaveState;
  hasUnsaved: boolean;
  onClick: () => void;
}) {
  const isSaving = state === 'saving';
  const isSuccess = state === 'success';
  const isError = state === 'error';

  const bg = isError ? '#EA5455' : '#7367F0';
  const bgHover = isError ? '#D14B4C' : '#685DD8';

  return (
    <button
      type="button"
      disabled={isSaving}
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        height: 40,
        padding: '0 24px',
        fontSize: 14,
        fontWeight: 600,
        color: '#FFFFFF',
        backgroundColor: isSuccess ? '#28C76F' : bg,
        border: 'none',
        borderRadius: 8,
        cursor: isSaving ? 'not-allowed' : 'pointer',
        transition: 'background-color 200ms',
        minWidth: 132,
        justifyContent: 'center',
      }}
      onMouseEnter={(e) => {
        if (!isSaving && !isSuccess) e.currentTarget.style.backgroundColor = isError ? '#D14B4C' : bgHover;
      }}
      onMouseLeave={(e) => {
        if (!isSaving && !isSuccess) e.currentTarget.style.backgroundColor = isSuccess ? '#28C76F' : bg;
      }}
      title={!hasUnsaved && state === 'idle' ? 'No changes to save' : undefined}
    >
      {isSaving && <span className="spinner" />}
      {isSaving && 'Saving…'}
      {isSuccess && <><IconCheck size={14} /> Saved</>}
      {isError && 'Save failed — retry'}
      {state === 'idle' && 'Save Settings'}
    </button>
  );
}

function UnsavedDialog({
  onDiscard,
  onSave,
  onCancel,
}: {
  onDiscard: () => void;
  onSave: () => void;
  onCancel: () => void;
}) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 60,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
      }}
    >
      <div
        style={{
          backgroundColor: '#FFF',
          borderRadius: 16,
          padding: '24px',
          width: 360,
          boxShadow: '0 8px 32px rgba(23,23,23,0.22)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <h3 style={{ margin: '0 0 8px', fontSize: 16, fontWeight: 600, color: '#171717' }}>
          Unsaved changes
        </h3>
        <p style={{ margin: '0 0 20px', fontSize: 14, lineHeight: '20px', color: '#525252' }}>
          You have unsaved changes. What would you like to do?
        </p>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button
            type="button"
            onClick={onCancel}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 500,
              color: '#525252',
              backgroundColor: 'transparent',
              border: '1px solid #D4D4D4',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Keep editing
          </button>
          <button
            type="button"
            onClick={onDiscard}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 500,
              color: '#EA5455',
              backgroundColor: '#FEF2F2',
              border: '1px solid #FBDCDC',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Discard changes
          </button>
          <button
            type="button"
            onClick={onSave}
            style={{
              padding: '8px 16px',
              fontSize: 14,
              fontWeight: 600,
              color: '#FFF',
              backgroundColor: '#7367F0',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
            }}
          >
            Save & close
          </button>
        </div>
      </div>
    </div>
  );
}
