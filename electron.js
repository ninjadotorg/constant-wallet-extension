const electron = require('electron');
const path = require('path');
const fs = require('fs');
const { download } = require('electron-dl');
const { exec } = require('child_process');


const { app, BrowserWindow, Menu, ipcMain } = electron;

const downloadLink = 'https://github.com/ninjadotorg/constant/releases/download/constant-0.0.1-beta/constant';

const menu = new Menu();

let win;

const userHome = process.env.HOME || process.env.USERPROFILE;
const storePath = path.resolve(userHome, '.constant');

let downloaded = false;
let downloadFinished = false;

try {
  fs.accessSync(storePath, fs.F_OK);
} catch (e) {
  fs.mkdirSync(storePath);
}

if (fs.existsSync(path.resolve(storePath, 'constant'))) {
  downloaded = true;
}

function runChain() {
  try {
    fs.accessSync(path.resolve(storePath, 'data'), fs.F_OK);
  } catch (e) {
    fs.mkdirSync(path.resolve(storePath, 'data'));
  }
  try {
    fs.accessSync(path.resolve(storePath, 'data/node-1'), fs.F_OK);
  } catch (e) {
    fs.mkdirSync(path.resolve(storePath, 'data/node-1'));
  }
  try {
    fs.accessSync(path.resolve(storePath, 'data/node-1/testnet'), fs.F_OK);
  } catch (e) {
    fs.mkdirSync(path.resolve(storePath, 'data/node-1/testnet'));
  }

  fs.copyFileSync(path.relative(__dirname, 'wallet'), path.resolve(storePath, 'data/node-1/testnet/wallet'));

  exec(`${path.resolve(storePath, 'constant')} --enablewallet --wallet "wallet" --walletpassphrase "12345678" --testnet --norpcauth --generate --producerkeyset "12pmcvmL2rYC6D4ydq5Ppv4xseoCcoeueb9y52H6EdTQLnXgJRYzc38T9cApymJQPkTrwqoeXh4Kk4A64miN1TygFth7UjFtnTyUtYAbZuvYR372Pkqs1yaEa1n5NPWbZNhDKsHLfaAEpy91CSRDzngJDABu6qmri8NvEnkYdKht2qF4dh7D9fcrihgwbKpmfLtj7tNcDZ8vaovMTZTj7pgpcavqwz7K3izB5prdsJt4jq8mGGQNJDR1PhkJWPeu7Rd41GoxvHit2NtA9egFUA444Tdco65GumDJPyeRN2K512eSCCGCiKQ9t9P7shq6vw22xmLHDA6xWBzSN2GBMGnnnawSPWe3upEehQunwvJtdg7J8j7JP7J2DZjQdSz9d3mL5tKiQdBPYwj3sLvNdLLFPXUfEQjMgJkiFDLDxkRfEKRkexhF31wJHxN3Qt3Mjeh9ou2UpUBEpoWFoqi6zyTdFbrmEJqvJK2Z8jCx1mxmQ97Naq94qvxuVJURsRT5FnV4oDS9tY4daS6Ae4GZywLe56LqXoS15hMi4KbssMcuzXBeQujdbXVhqVoZSv5gPh6XtWrhqBV1V6EpRFht9a9YyfxKq8TY35QPfapS8DRYuXYktpNcHfmWNMepMwU9Lw9Roj481qyqGa1xidWrcAXKzzTEokHZnLJRkXVnzBQ7uVB9Kgh8tf5vupP5R2ebrwc5E6Piw1QJJGboPb2uEva4bgngn5ghibtbBC9yBVJaCuPjkjQTZe3t6yoHmtUYomF9DNT6" --datadir "${path.resolve(storePath, 'data/node-1')}"`, (error, stdout, stderr) => {
    if (error) {
      runChain();
    }
  });
}

function createWindow() {
  win = new BrowserWindow({
    fullscreen: false,
    icon: path.join(__dirname, 'icons/64x64.png'),
    title: 'Constant desktop wallet'
  });

  win.maximize();
  win.setSize(414, win.getBounds().height);
  win.setResizable(false);
  const { width } = electron.screen.getPrimaryDisplay().bounds;
  win.setPosition(width - 414, 0);
  win.setMenu(null);

  if (!downloaded) {
    win.loadFile(path.resolve(__dirname, 'downloading.html'));
    download(win, downloadLink, {
      directory: storePath,
    })
      .then(dl => {
        downloadFinished = true;
        fs.chmodSync(dl.getSavePath(), '0755');
        runChain();
        win.loadFile(path.resolve(__dirname, 'build/index.html'));
        console.log(dl.getSavePath());
        win.show();
      })
      .catch(console.error);
  } else {
    downloadFinished = true;
    runChain();
    win.loadFile(path.resolve(__dirname, 'build/index.html'));
    win.show();
  }
}


app.on('window-all-closed', function () {
  if (!downloadFinished) {
    fs.unlinkSync(path.resolve(storePath, 'constant'));
  }
  app.quit();
});

app.commandLine.appendSwitch('disable-pinch');
app.setName('Constant desktop wallet');
app.dock.setIcon(path.relative(__dirname, 'icons/512x512.png'));
app.on('ready', createWindow);
