const { app, BrowserWindow } = require('electron');
const path = require('path');

// Logic phát hiện môi trường: Nếu chưa đóng gói thì là Dev
const isDev = !app.isPackaged;

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "QLHS UBND Phường Minh Hưng",
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
    autoHideMenuBar: true
  });

  if (isDev) {
    // Thử load localhost, nếu lỗi thì fallback về file tĩnh (đề phòng chưa chạy Vite)
    mainWindow.loadURL('http://localhost:5173').catch(() => {
        console.log('Không tìm thấy Vite Server, đang thử load file tĩnh...');
        mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
    });
    // mainWindow.webContents.openDevTools(); 
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});