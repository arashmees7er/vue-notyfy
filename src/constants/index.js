import { ICONS } from './icons';

export const Z_INDEX_LIST = {
  notification: 1003,
};

export const NOTIFICATION_POSITIONS = ['top', 'bottom', 'left', 'right'];
export const NOTIFICATION_TYPES = ['success', 'warning', 'info', 'error', 'offline'];
export const NOTIFICATION_ICONS = {
  success: { ...ICONS.check, height: 16 },
  info: { ...ICONS.info, height: 14 },
  warning: { ...ICONS.exclamation, height: 14 },
  error: { ...ICONS.exclamationTriangle, height: 16 },
  offline: { ...ICONS.wifiSlash, height: 14 },
  close: { ...ICONS.close },
  chevronDown: { ...ICONS.chevronDown }
};
export const NOTIFICATION_THEME = {
  colors: {
    success: '#4f88ff',
    successDarken: '#2d71fe',
    info: '#5d6a89',
    infoDarken: '#535f7b',
    warning: '#f8a623',
    warningDarken: '#f69a07',
    error: '#ff4577',
    errorDarken: '#ff245f',
    offline: '#ff4577',
    offlineDarken: '#ff245f',
  },
};
