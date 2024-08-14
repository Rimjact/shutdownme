/* 
========= Shutdown Me =========
This is simple app for Windows, MacOS and Linux for shutdown system by time.

v1.0.0 (14.08.2024) | © Rimjact, 2024
*/

process.env.NODE_ENV = 'production';

const path = require('path');
const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const shell = require('electron').shell;
const shutdownMe = require('./shutdownme');

// Current env is not production
const isDev = process.env.NODE_ENV !== 'production';
// Current platform is MacOS?
const isMacOS = process.platform === 'darwin';

// Windows
let mainWindow = null;
let aboutWindow = null;

// Menu template
const menu = [
    {
        label: 'Help',
        submenu: [
            {
                label: 'About',
                click: createAboutWindow,
                accelerator: 'CmdOrCtrl+H'
            }
        ]
    }
];

/* ========= FUNCTIONS ========= */
// Function for create a main window of the application
function createMainWindow() {
    // Create a new window
    mainWindow = new BrowserWindow({
        title: 'ShutdownMe',
        width: isDev ? 847 : 321, // if env is dev, set more width for devtools (526 px is devtool) 
        height: 370, // 321 + 49
        show: false,
        webPreferences: {
            contextIsolation: true,
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js')
        },
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        maximizable: false,
        resizable: false,
    });

    // =! Open devtools panel if in dev env !=
    if (isDev) mainWindow.webContents.openDevTools();

    // View a intex.html file on the main window
    mainWindow.loadFile(path.join(__dirname, './renderer/index.html'));
    mainWindow.webContents.on('dom-ready', () => {
        mainWindow.show();
    });
}

// Function for create a about window of the application
function createAboutWindow() {
    if (aboutWindow) return;

    // Create a new window
    aboutWindow = new BrowserWindow({
        title: 'ShutdownMe - About',
        width: 300,
        height: 265,
        icon: path.join(__dirname, 'assets/icons/icon.png'),
        show: false,
        resizable: false,
        maximizable: false,
        minimizable: false
    });

    // Setup window
    aboutWindow.removeMenu();

    // For open my GitHub page
    aboutWindow.webContents.on('will-navigate', (event, url) => {
        event.preventDefault();
        shell.openExternal(url);
    });

    // View a about.html file on the about window
    aboutWindow.loadFile(path.join(__dirname, './renderer/about.html'));
    aboutWindow.webContents.on('dom-ready', () => {
        aboutWindow.show();
    });

    aboutWindow.on('close', () => (aboutWindow = null));
}

/* ========= EVENTS ========= */
// When app full loaded
app.whenReady().then(() => {
    // Create main windows first
    createMainWindow();

    // Implement menu
    const mainMenu = Menu.buildFromTemplate(menu);
    Menu.setApplicationMenu(mainMenu);

    // On app is active
    app.on('activate', () => {
        // Create main window if is not opened
        if (BrowserWindow.getAllWindows().length === 0)
            createMainWindow();

        if (aboutWindow === null)
            createAboutWindow();
    });
});

// When all app windows are closed
app.on('window-all-closed', () => { 
    // If current platform is not MacOS
    if (!isMacOS) app.quit();
});

/* === FOR PRELOAD === */ 
// Shutdown
ipcMain.handle('shutdown', (...args) => {
    const options = args[1];
    shutdownMe.shutdown(options)
});
// Reboot
ipcMain.handle('reboot', (...args) => {
    const options = args[1];
    shutdownMe.reboot(options)
});
// Abort
ipcMain.handle('abort', () => {
    shutdownMe.abortCommand();
});

// Get platform handler
ipcMain.handle('getPlatform', () => {
    return process.platform;
});