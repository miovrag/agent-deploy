export type IconPosition = 'right' | 'left';
export type IconSize = 'small' | 'medium' | 'large';
export type ChatWindowPosition = 'focus' | 'compact' | 'bubble';
export type MobileFontSize = 'reduced' | 'desktop';
export type HeightMode = 'fixed' | 'dynamic';
export type SaveState = 'idle' | 'saving' | 'success' | 'error';
export type ActiveTab = 'appearance' | 'behavior' | 'size' | 'advanced';

export interface LiveChatSettings {
  iconPosition: IconPosition;
  iconSize: IconSize;
  chatWindowPosition: ChatWindowPosition;
  mobileFontSize: MobileFontSize;
  promptStarterQuestion: boolean;
  autoStartConversation: boolean;
  hidePromptFromList: boolean;
  dontPromptMobile: boolean;
  autoPopupDesktop: boolean;
  autoPopupMobile: boolean;
  resetPreviousConversation: boolean;
  keepConversationOpen: boolean;
  width: number;
  heightMode: HeightMode;
  height: number;
}

export const DEFAULT_SETTINGS: LiveChatSettings = {
  iconPosition: 'right',
  iconSize: 'small',
  chatWindowPosition: 'compact',
  mobileFontSize: 'reduced',
  promptStarterQuestion: false,
  autoStartConversation: true,
  hidePromptFromList: false,
  dontPromptMobile: false,
  autoPopupDesktop: false,
  autoPopupMobile: false,
  resetPreviousConversation: false,
  keepConversationOpen: false,
  width: 420,
  heightMode: 'fixed',
  height: 700,
};
