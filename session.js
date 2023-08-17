/*
const fs = require('fs-extra');
const axios = require("axios");

var sessionName = 'Anya;;;GuineasMines'
 let cc = sessionName.replace(/Anya;;;/g, "");
async function MakeSession(){
if (!fs.existsSync(__dirname + '/auth_info_baileys/creds.json')) {
console.log('SESSFILE FOUND')
fs.rm(__dirname + '/auth_info_baileys/creds.json')
console.log('DONE SESSION FILE DELETED')
    if(cc.length<30){
    let { data } = await axios.get('https://paste.c-net.org/'+cc)
    await fs.writeFileSync(__dirname + '/auth_info_baileys/creds.json', atob(data), "utf8")    
    } else {
	 var c = atob(cc)
         await fs.writeFileSync(__dirname + '/auth_info_baileys/creds.json', c, "utf8")    
    }
}
}
MakeSession()
console.log('DONE SESSION SAVED INTO JSON FILE')
*/


const makeWASocket = require("@adiwajshing/baileys").default;
const {
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  delay,
} = require("@adiwajshing/baileys");
const fs = require("fs-extra");
const axios = require("axios");
const pino = require('pino');

const sessionName = "Anya;;;GuineasMines";
const cc = sessionName.replace(/Anya;;;/g, "");

const fldernme = "qr/creds.json";

async function MakeSession() {
  if (fs.existsSync(fldernme)) {
    console.log("SESSFILE FOUND");
    fs.rmSync(fldernme);
    console.log("DONE SESSION FILE DELETED");

    await delay(1000 * 2);
    console.log("DELAYED FOR 2 SECONDS");

    if (cc.length < 30) {
      const { data } = await axios.get("https://paste.c-net.org/" + cc);
      await fs.writeFileSync(fldernme, Buffer.from(data, "base64").toString("utf-8"));
    } else {
      const c = Buffer.from(cc, "base64").toString("utf-8");
      await fs.writeFileSync(fldernme, c);
    }
  }

  console.log("DONE SESSION SAVED INTO JSON FILE");
}

async function olduser() {
  const { version } = await fetchLatestBaileysVersion();
  const { saveCreds, state } = await useMultiFileAuthState("qr");

  const session = makeWASocket({
  logger: pino({ level: 'silent' }),
    printQRInTerminal: true,
    browser: ["📶 Ｑｕｅｅｎ Ａｎｙａ", "safari", "1.0.0"],
    fireInitQueries: false,
    shouldSyncHistoryMessage: false,
    downloadHistory: false,
    syncFullHistory: false,
    auth: state,
    version,
  });

  session.ev.on("connection.update", async (s) => {
    const { connection, lastDisconnect } = s;

    if (connection === "open") {
      const waitmsg = session.sendMessage("918602239106@s.whatsapp.net", {
        text: "Connected ✅",
      });
    }
    if (
      connection === "close" &&
      lastDisconnect &&
      lastDisconnect.error &&
      lastDisconnect.error.output.statusCode !== 401
    ) {
      await olduser();
    }
  });

  session.ev.on("creds.update", saveCreds);
  session.ev.on("messages.upsert", () => {});
}

olduser()
