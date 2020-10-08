const electron = require('electron');
const { shell } = require('electron');
const app = electron.app;
const axios = require('axios');
const BrowserWindow = electron.BrowserWindow;
const { ipcMain: ipc } = require('electron-better-ipc');
const path = require('path');
const windowStateKeeper = require('electron-window-state');

let windows = [];

function createWindow() {
    const size = electron.screen.getPrimaryDisplay().workAreaSize;

    let mainWindowState = windowStateKeeper({
        defaultWidth: size.width - 200,
        defaultHeight: size.height - 640
    });

    windows.main = new BrowserWindow({
        x: mainWindowState.x,
        y: mainWindowState.y,
        width: mainWindowState.width,
        height: mainWindowState.height,
        webPreferences: { webSecurity: false, nodeIntegration: true },
        frame: true
    });

    mainWindowState.manage(windows.main);

    windows.main.loadURL(
        `file://${path.join(__dirname, 'index.html')}`
    );

    windows.main.once('did-finish-load', () => {
        windows.main.setTitle('Shards');
        windows.main.show();
        windows.main.focus();
    });

    windows.main.on('closed', () => {
        windows.main = null;
    });

    windows.main.webContents.on('new-window', (e) => {
        e.preventDefault();
    });

    windows.main.webContents.on('will-navigate', (e, url) => {
        e.preventDefault();
        if (url.startsWith('http:') || url.startsWith('https:')) {
            shell.openExternal(url);
        }
    });
}

app.on('ready', async () => {
    createWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (windows.main === null) {
        createWindow();
    }
});

ipc.answerRenderer('get-inventory', async (query) => {
    const itemurl = `https://www.pathofexile.com/character-window/get-stash-items?league=${query.league}&realm=${query.platform}&accountName=${query.accountname}&tabs=0&tabIndex=${query.tabs}`;
    const resp = await axios.get(itemurl, {
        headers: {
            Cookie: `POESESSID=${query.sessionID};`
        },
        timeout: 1200
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Bad response: ');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('No response: ' + error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return resp;
});

ipc.answerRenderer('get-leagues', async () => {
    const leagueurl = `https://www.pathofexile.com/api/leagues?type=main&realm=pc&compat=1`;
    const resp = await axios.get(leagueurl, {
        timeout: 1200
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Bad response: ');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('No response: ' + error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return resp;
});

ipc.answerRenderer('get-tabs', async (query) => {
    const tabsurl = `https://www.pathofexile.com/character-window/get-stash-items?league=${query.league}&realm=${query.platform}&accountName=${query.accountname}&tabs=1&tabIndex=0`;
    const resp = await axios.get(tabsurl, {
        headers: {
            Cookie: `POESESSID=${query.sessionID}`
        },
        timeout: 1200
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Bad response: ');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('No response: ' + error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return resp;
});

ipc.answerRenderer('get-wikidata', async () => {
    const wikiurl = `https://pathofexile.gamepedia.com/api.php?action=cargoquery&tables=items,stackables&join_on=items._pageID=stackables._pageID&fields=items.class_id,items.name,items.tags,stackables.stack_size&where=items.tags%20HOLDS%20LIKE%20%27%currency_shard%%27%20OR%20items.tags%20HOLDS%20LIKE%27divination_card%27%20OR%20items.tags%20HOLDS%20LIKE%27legion_splinter%27%20OR%20items.tags%20HOLDS%20LIKE%27breachstone_splinter%27&limit=500&format=json`;
    const resp = await axios.get(wikiurl, {
        timeout: 1200
    })
        .then(function (response) {
            return response.data;
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log('Bad response: ');
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log('No response: ' + error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
        });

    return resp;
});