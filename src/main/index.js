import { app, BrowserWindow, ipcMain, Menu, MenuItem, dialog, clipboard, globalShortcut } from 'electron'
// import { autoUpdater } from 'electron-updater'
import { screenshot } from './puppeteer'

import path from 'path'

import os from 'os'

require('./request')
require('./npm')
const { showSettingsWindow, createSettingsWindow } = require('./settings')
const { showAboutWindow } = require('./about')

const { checkUpdate } = require('./autoUpdate')
// console.log('=======', !fs.existsSync(app.getAppPath() + path.sep + 'db.json'), app.getAppPath() + path.sep + 'db.json')
// if (!fs.existsSync(app.getAppPath() + path.sep + 'db.json')) {
//   fs.writeFileSync(app.getAppPath() + path.sep + 'db.json', '')
// }
const pkg = require('../../package.json')
// const puppeteer = require('puppeteer')

function initMenu () {
  const isMac = process.platform === 'darwin'
  const template = [
    // { role: 'appMenu' }
    ...(isMac ? [{
      label: pkg.name,
      submenu: [
        {
          label: '关于 ' + pkg.name,
          click: () => {
            showAboutWindow()
          }
        },
        { type: 'separator' },
        {
          label: '设置',
          accelerator: 'CmdOrCtrl+,',
          click: () => {
            showSettingsWindow()
          }
        },
        { type: 'separator' },
        {
          role: 'quit',
          label: '退出 ' + pkg.name
        }
      ]
    }] : []),
    // { role: 'fileMenu' }
    {
      label: '编辑',
      submenu: [
        {
          role: 'undo',
          label: '撤销'
        },
        {
          role: 'redo',
          label: '重做'
        },
        { type: 'separator' },
        {
          role: 'cut',
          label: '剪切'
        },
        {
          role: 'copy',
          label: '复制'
        },
        {
          role: 'paste',
          label: '粘贴'
        }
      ]
    },
    {
      label: '帮助',
      role: 'help',
      submenu: [
        {
          label: 'Learn More',
          click: async () => {
            const { shell } = require('electron')
            await shell.openExternal('https://electronjs.org')
          }
        }
      ]
    }
  ]
  const menu = Menu.buildFromTemplate(template)
  Menu.setApplicationMenu(menu)
}
// initMenu()

// if (process.mas) app.setName('Enkel')
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

let mainWindow
let menuWindow

let menuWindowNormalBounds = {}
const winURL = process.env.NODE_ENV === 'development'
  ? `http://localhost:9080`
  : `file://${__dirname}/index.html`

function createWindow () {
  /**
   * Initial window options
   */
  // systemPreferences.promptTouchID('登录Enkel').then(success => {
  //   dialog.showMessageBox({
  //     message: '成功'
  //   })
  // }).catch(err => {
  //   dialog.showMessageBox({
  //     message: '失败: ' + err.message
  //   })
  // })
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    titleBarStyle: 'hidden',
    show: true,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })
  mainWindow.loadURL(winURL)

  // initMenu()

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show()
  // })

  mainWindow.on('closed', () => {
    mainWindow = null
    // app.quit()
  })
  // mainWindow.setAspectRatio(16 / 9)
}

function createNewWindow (arg) {
  let newWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
    titleBarStyle: 'hidden',
    show: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    }
  })
  const url = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/${arg.path}`
    : `file://${__dirname}/index.html?page=${arg.path}`
  newWindow.loadURL(url)

  newWindow.on('closed', () => {
    // newWindow = null
    newWindow.destroy()
    // app.quit()
  })

  newWindow.once('ready-to-show', () => {
    newWindow.show()
  })
}

function createMenuWindow () {
  menuWindow = new BrowserWindow({
    height: 667,
    width: 375,
    // titleBarStyle: 'hidden',
    // modal: true,
    // parent: mainWindow,
    frame: false,
    show: false,
    resizable: false,
    alwaysOnTop: true,
    transparent: true,
    backgroundColor: '#00ffffff',
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false,
      // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
    },
    id: 'menu'
  })

  const menuURL = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/menu`
    : `file://${__dirname}/index.html?page=menu`

  menuWindow.loadURL(menuURL)

  menuWindow.on('close', (event) => {
    menuWindow = null
    // if (process.platform !== 'darwin') {
    app.exit(0)
    // }
    // if (menuWindow) {
    //   menuWindow.destroy()
    //   app.quit()
    // }
    // event.preventDefault()
  })
  menuWindow.once('ready-to-show', () => {
    menuWindow.show()
  })
}

function minimizeMenuWindow () {
  menuWindowNormalBounds = menuWindow.getNormalBounds()
  menuWindow.setBounds({
    x: 20,
    y: 20,
    height: 48,
    width: 48
  }, true)
}

function restoreMenuWindow () {
  menuWindow.setBounds(menuWindowNormalBounds, true)
}

// function createShotcutsWindow (data) {
//   let shortcutsWindow = new BrowserWindow({
//     height: 363,
//     width: 600,
//     modal: true,
//     show: true,
//     // transparent: true,
//     alwaysOnTop: true,
//     x: 144 / 2,
//     y: 394 / 2,
//     webPreferences: {
//       javascript: true,
//       plugins: true,
//       nodeIntegration: true, // 是否集成 Nodejs
//       webSecurity: false,
//       // preload: path.join(__dirname, '../renderer/index.js') // 但预加载的 js 文件内仍可以使用 Nodejs 的 API
//     }
//   })
// }

let modalLoadingWindow
function createModalLoadingWindow () {
  const modalLoadingUrl = process.env.NODE_ENV === 'development'
    ? `http://localhost:9080/#/modal-loading`
    : `file://${__dirname}/index.html?page=modal-loading`
  modalLoadingWindow = new BrowserWindow({
    height: 128,
    width: 128,
    modal: true,
    show: false,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#00ffffff',
    frame: false,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false
    },
    id: 'modal-loading'
  })
  modalLoadingWindow.on('close', (event) => {
    // menuWindow = null
    if (modalLoadingWindow) {
      modalLoadingWindow.hide()
    }
    event.preventDefault()
  })
  modalLoadingWindow.loadURL(modalLoadingUrl)
}

let shortcutsWindow
function createShotcutsWindow (data) {
  // const { width, height } = screen.getPrimaryDisplay().workAreaSize
  // const screenshotQrcodeUrl = process.env.NODE_ENV === 'development'
  //   ? `http://localhost:9080/#/screenshot-qrcode`
  //   : `file://${__dirname}/index.html?page=screenshot-qrcode`
  shortcutsWindow = new BrowserWindow({
    height: data.height,
    width: data.width,
    modal: true,
    show: true,
    transparent: true,
    alwaysOnTop: true,
    backgroundColor: '#88000000',
    frame: false,
    x: data.x,
    y: data.y,
    webPreferences: {
      javascript: true,
      plugins: true,
      nodeIntegration: true, // 是否集成 Nodejs
      webSecurity: false
    }
  })
  shortcutsWindow.on('blur', () => {
    shortcutsWindow.destroy()
  })
  // shortcutsWindow.loadURL(screenshotQrcodeUrl)
}

ipcMain.on('show-shortcuts', async (event, args) => {
  if (modalLoadingWindow) {
    modalLoadingWindow.hide()
  }

  let dpr = args.dpr || 2
  let x = (args.topLeftCorner.x).toFixed(2) / dpr
  let y = (args.topLeftCorner.y).toFixed(2) / dpr
  let width = ((args.topRightCorner.x).toFixed(2) - (args.topLeftCorner.x).toFixed(2)) / dpr
  let height = ((args.bottomLeftCorner.y).toFixed(2) - (args.topLeftCorner.y).toFixed(2)) / dpr
  dialog.showMessageBox({
    message: JSON.stringify({
      width: width,
      height: height,
      x: x,
      y: y
    }, null, 2)
  })
  createShotcutsWindow({
    width: width,
    height: height,
    x: x,
    y: y
  })

  let res = await dialog.showMessageBox({
    title: '扫描结果',
    message: '扫描结果: ' + args.message,
    defaultId: 1,
    cancelId: 0,
    buttons: ['取消', '复制']
  })
  if (res.response == 1) {
    clipboard.writeText(args.message, 'selection')
  } else {
    event.preventDefault()
  }
})

ipcMain.on('hide-modal-loading', (event) => {
  if (modalLoadingWindow) {
    modalLoadingWindow.hide()
  }
})
ipcMain.on('show-modal-loading', () => {
  if (!modalLoadingWindow) {
    createModalLoadingWindow()
  }
  modalLoadingWindow.show()
})

app.on('ready', async () => {
  // if ((process.env.NODE_ENV == 'development') && !process.env.IS_TEST) {
  // Install Vue Devtools
  // await installVueDevtools()
  // }
  // createWindow()
  // require('./shortcuts')
  createMenuWindow()

  if (!modalLoadingWindow) {
    createModalLoadingWindow()
  }

  globalShortcut.register('CommandOrControl+Shift+E', () => {
    // createModalLoadingWindow()
    if (shortcutsWindow) {
      shortcutsWindow.destroy()
    }

    // createShotcutsWindow()
    menuWindow.webContents.send('desktop-capturer')
  })

  createSettingsWindow()

  // globalShortcut.register('CommandOrControl+,', () => {
  //   showSettingsWindow()
  // })

  // 每次运行APP检测更新。这里设置延时是为了避免还未开始渲染，更新检测就已经完成(网速超快，页面加载跟不上)。
  // setTimeout(() => {
  //   autoUpdater.checkForUpdates()
  // }, 1500)
})
app.on('will-quit', () => {
  globalShortcut.unregisterAll()
})

app.on('window-all-closed', () => {
  // if (process.platform !== 'darwin') {
  app.quit()
  // }
})

app.on('activate', () => {
  // if (mainWindow === null) {
  //   createWindow()
  // }
  if (menuWindow === null) {
    createMenuWindow()
  }
})

ipcMain.on('open-menu', (event, arg) => {
  if (!menuWindow) {
    createMenuWindow()
  }
  menuWindow.show()

  event.returnValue = 'opened'
})

ipcMain.on('close-menu', (event, arg) => {
  if (menuWindow) {
    menuWindow.hide()
  }
})

ipcMain.on('set-bounds', (event, arg) => {
  if (menuWindow) {
    menuWindow.setBounds(arg, true)
  }
})

ipcMain.on('menu-fold', (event) => {
  minimizeMenuWindow()
  event.reply('menu-folded')
})
ipcMain.on('menu-unfold', (event) => {
  restoreMenuWindow()
  event.reply('menu-unfolded')
})

ipcMain.on('navigate-to', (event, arg) => {
  createNewWindow(arg)
  // if (mainWindow === null) {
  //   createWindow()
  // }
  // console.log('>>>>>>>', arg)
  // mainWindow.webContents.send('navigate-to', arg)
  // mainWindow.showInactive()
  // mainWindow.flashFrame(true)
})

ipcMain.on('right-menu-click', (event, arg) => {
  const menu = new Menu()
  for (let i = 0; i < arg.routes.length; i++) {
    menu.append(new MenuItem({
      label: arg.routes[i].name,
      submenu: arg.routes[i].routes.map(item => {
        return {
          label: item.meta.title,
          click () {
            createNewWindow({
              path: item.name
            })
            /**
            if (mainWindow === null) {
              // createWindow()
              setTimeout(() => {
                createNewWindow({
                  path: item.name
                })
                // mainWindow.webContents.send('navigate-to', {
                //   path: item.name
                // })
                // mainWindow.showInactive()
              }, 1000)
            } else {
              createNewWindow({
                path: item.name
              })
              // mainWindow.webContents.send('navigate-to', {
              //   path: item.name
              // })
              // mainWindow.showInactive()
            }
             */
          }
        }
      })
    }))
  }
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})

ipcMain.on('contextmenu-tool-request', (event, args) => {
  const menu = new Menu()
  menu.append(new MenuItem({
    label: '删除',
    click: async () => {
      let res = await dialog.showMessageBox({
        type: 'info',
        message: `确定删除【${args.label}】吗`,
        defaultId: 1,
        cancelId: 0,
        buttons: ['取消', '确定']
      })
      if (res.response == 1) {
        event.reply('contextmenu-tool-request-delete', {
          deleted: args,
          requests: removeRequest(args)
        })
      } else {
        event.preventDefault()
      }
    }
  }))
  menu.append(new MenuItem({
    label: '修改',
    click: () => {
      event.reply('contextmenu-tool-request-modify', args)
    }
  }))
  // menu.append(new MenuItem({
  //   label: '移动到',
  //   submenu: [
  //     {
  //       label: '笑话目录',
  //       type: 'submenu'
  //     }
  //   ]
  // }))
  const win = BrowserWindow.fromWebContents(event.sender)
  menu.popup(win)
})


function getHost (u) {
  let url = 'https://' + u.replace(/^([^/]*\/?\/?)(.*)$/, '$2')
  var result = url.match("^https?:\/\/([^\/:]*)")
  if (result && result[1]) {
    var domain = result[1].match("[0-9a-zA-Z-]*\.(com\.tw|com\.cn|com\.hk|net\.cn|org\.cn|gov\.cn|ac\.cn|bj\.cn|sh\.cn|tj\.cn|cq\.cn|he\.cn|sx\.cn|nm\.cn|ln\.cn|jl\.cn|hl\.cn|js\.cn|zj\.cn|ah\.cn|fj\.cn|jx\.cn|sd\.cn|ha\.cn|hb\.cn|hn\.cn|gd\.cn|gx\.cn|hi\.cn|sc\.cn|gz\.cn|yn\.cn|xz\.cn|sn\.cn|gs\.cn|qh\.cn|nx\.cn|xj\.cn|tw\.cn|hk\.cn|mo\.cn|com|net|org|biz|info|cn|mobi|name|sh|ac|io|tw|hk|ws|travel|us|tm|cc|tv|la|in|中国|公司|网络)$")
    try { return domain[0] } catch (e) { }
  }
  return ''
}

ipcMain.on('open-save', async (event, args) => {
  let response = await dialog.showSaveDialogSync({
    defaultPath: path.resolve(os.homedir(), '.' + path.sep + 'Downloads' + path.sep + 'screenshot.jpg'),
    buttonLabel: '保存'
  })
  if (response) {
    if (args.type === 'screenshot') {
      screenshot(event, Object.assign({}, args, {
        path: response
      }))
    }
  }
})

ipcMain.on('show-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (['menu', 'modal-loading', 'settings', 'about'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      item.show()
    }
  })
})

ipcMain.on('hide-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (['menu', 'modal-loading', 'settings', 'about'].indexOf(item.webContents.browserWindowOptions.id) < 0) {
      item.hide()
    }
  })
})

ipcMain.on('close-all-window', (event, args) => {
  BrowserWindow.getAllWindows().forEach(item => {
    if (item.id != menuWindow.id) {
      item.destroy()
    }
  })
})

// checkUpdate()

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

// import { autoUpdater } from 'electron-updater'

// autoUpdater.on('update-downloaded', () => {
//   autoUpdater.quitAndInstall()
// })

// app.on('ready', () => {
//   if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
// })
// 发送消息给渲染线程
/**
function sendStatusToWindow (status, params) {
  mainWindow.webContents.send(status, params)
}
autoUpdater.autoDownload = false // 关闭自动更新
autoUpdater.autoInstallOnAppQuit = true // APP退出的时候自动安装
autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...')
})
autoUpdater.on('update-available', (info) => {
  // 可以更新版本
  sendStatusToWindow('autoUpdater-canUpdate', info)
})
// autoUpdater.on('update-not-available', (info) => {
//   // 不能够更新
// })
autoUpdater.on('error', (err) => {
  // 更新错误
  sendStatusToWindow('autoUpdater-error', err)
})
autoUpdater.on('download-progress', (progressObj) => {
  // 正在下载的下载进度
  sendStatusToWindow('autoUpdater-progress', progressObj)
})
autoUpdater.on('update-downloaded', (info) => {
  // 下载完成
  sendStatusToWindow('autoUpdater-downloaded')
})

ipcMain.on('exit-app', () => {
  app.quit()
})
 */

