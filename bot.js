const { makeWASocket, useMultiFileAuthState } = require("@whiskeysockets/baileys");
const axios = require("axios");

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState("auth_info");
    const sock = makeWASocket({ auth: state });

    sock.ev.on("creds.update", saveCreds);
    sock.ev.on("messages.upsert", async ({ messages }) => {
        const msg = messages[0];
        if (!msg.message) return;
        
        const text = msg.message.conversation || msg.message.extendedTextMessage?.text;
        const sender = msg.key.remoteJid;
        
        if (text === "!truth") {
            try {
                const response = await axios.get("TON_API_URL"); // Remplace par ton API
                if (response.data.success) {
                    const question = response.data.question;
                    await sock.sendMessage(sender, { text: `🔹 *Vérité* : ${question}` });
                } else {
                    await sock.sendMessage(sender, { text: "🚨 Erreur : Impossible de récupérer une question." });
                }
            } catch (error) {
                console.error("Erreur API :", error);
                await sock.sendMessage(sender, { text: "⚠️ Erreur lors de l'accès à l'API." });
            }
        }
    });

    console.log("✅ Bot WhatsApp en ligne !");
}

startBot();
