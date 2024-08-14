/* ===== REQUIREMENTS ===== */
const { app, ipcRenderer, contextBridge } = require('electron');

// Shutdown me context bridge
contextBridge.exposeInMainWorld('sdme', {
    shutdown: (options) => ipcRenderer.invoke('shutdown', options),
    reboot: (options) => ipcRenderer.invoke('reboot', options),
    abort: () => ipcRenderer.invoke('abort')
});

// Platform context bridge
contextBridge.exposeInMainWorld('platform', {
    getPlatform: () => ipcRenderer.invoke('getPlatform')
});