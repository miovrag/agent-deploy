'use client';

const ICON_D = 14;

function BrowserChrome() {
  return (
    <div style={{ height: 14, backgroundColor: '#FFF', borderBottom: '1px solid #E5E5E5', display: 'flex', alignItems: 'center', paddingLeft: 6, gap: 3 }}>
      {(['#EA5455', '#FF9F43', '#28C76F'] as const).map((c) => (
        <div key={c} style={{ width: 5, height: 5, borderRadius: '50%', backgroundColor: c, flexShrink: 0 }} />
      ))}
      <div style={{ flex: 1, height: 4, backgroundColor: '#E5E5E5', borderRadius: 2, marginLeft: 4, marginRight: 6 }} />
    </div>
  );
}

function PageContent() {
  return (
    <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ height: 5, width: '75%', backgroundColor: '#D4D4D4', borderRadius: 2 }} />
      <div style={{ height: 4, width: '58%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
      <div style={{ height: 4, width: '68%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
      <div style={{ height: 4, width: '48%', backgroundColor: '#E5E5E5', borderRadius: 2 }} />
    </div>
  );
}

function WidgetIcon() {
  return (
    <div style={{
      position: 'absolute', bottom: 6, right: 6,
      width: ICON_D, height: ICON_D, borderRadius: '50%',
      backgroundColor: '#7367F0',
      boxShadow: '0 2px 6px rgba(115,103,240,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexShrink: 0,
    }}>
      <div style={{ width: 7, height: 7, backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: '50%' }} />
    </div>
  );
}

function PreviewShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ width: 120, height: 90, border: '1px solid #E5E5E5', borderRadius: 6, backgroundColor: '#FAFAFA', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
      <BrowserChrome />
      <PageContent />
      {children}
    </div>
  );
}

export function AgentInitiativePreview({
  promptStarterQuestion,
  autoStartConversation,
}: {
  promptStarterQuestion: boolean;
  autoStartConversation: boolean;
}) {
  return (
    <PreviewShell>
      {/* Speech bubble — always rendered so transition works */}
      <div style={{
        position: 'absolute',
        bottom: 9,
        right: 6 + ICON_D + 5,
        backgroundColor: '#FFF',
        border: '1px solid #E5E5E5',
        borderRadius: '5px 5px 1px 5px',
        padding: '4px 6px',
        boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        minWidth: 44,
        opacity: promptStarterQuestion ? 1 : 0,
        transition: 'opacity 200ms',
      }}>
        <div style={{ height: 3, width: 32, backgroundColor: '#D4D4D4', borderRadius: 1 }} />
        <div style={{ height: 3, width: 24, backgroundColor: '#E5E5E5', borderRadius: 1 }} />
        <div style={{
          height: 3, width: 18, backgroundColor: '#A39BF6', borderRadius: 1,
          opacity: autoStartConversation ? 1 : 0,
          transition: 'opacity 200ms',
        }} />
      </div>
      <WidgetIcon />
    </PreviewShell>
  );
}

export function AutoPopupPreview({ autoPopupDesktop }: { autoPopupDesktop: boolean }) {
  return (
    <PreviewShell>
      {/* Chat window — always rendered so transition works */}
      <div style={{
        position: 'absolute',
        bottom: ICON_D + 10,
        right: 5,
        width: 62, height: 68,
        backgroundColor: '#FFF',
        borderRadius: 5,
        boxShadow: '0 2px 10px rgba(0,0,0,0.12)',
        border: '1px solid #E5E5E5',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        opacity: autoPopupDesktop ? 1 : 0,
        transition: 'opacity 200ms',
      }}>
        <div style={{ height: 14, backgroundColor: '#7367F0', display: 'flex', alignItems: 'center', paddingLeft: 6, paddingRight: 6, gap: 4 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.7)' }} />
          <div style={{ flex: 1, height: 3, backgroundColor: 'rgba(255,255,255,0.5)', borderRadius: 1 }} />
        </div>
        <div style={{ flex: 1, padding: 5, display: 'flex', flexDirection: 'column', gap: 4, justifyContent: 'flex-end' }}>
          <div style={{ alignSelf: 'flex-start', backgroundColor: '#EAE8FD', borderRadius: '6px 6px 6px 2px', padding: '3px 5px', maxWidth: '70%' }}>
            <div style={{ height: 3, width: 22, backgroundColor: '#A39BF6', borderRadius: 1 }} />
          </div>
          <div style={{ alignSelf: 'flex-end', backgroundColor: '#7367F0', borderRadius: '6px 6px 2px 6px', padding: '3px 5px', maxWidth: '70%' }}>
            <div style={{ height: 3, width: 16, backgroundColor: 'rgba(255,255,255,0.75)', borderRadius: 1 }} />
          </div>
        </div>
        <div style={{ height: 10, backgroundColor: '#F5F5F5', borderTop: '1px solid #E5E5E5' }} />
      </div>
      <WidgetIcon />
    </PreviewShell>
  );
}
