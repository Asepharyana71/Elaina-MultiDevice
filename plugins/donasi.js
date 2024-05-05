let handler = async (m, { conn, usedPrefix: _p, __dirname, args }) => {
    let donasi = `
︵‿︵‿︵‿︵ *DONASI BOT* ︵‿︵‿︵‿︵
┌─「 Donasi • Pulsa 」
│ • *Telkomsel:* ${global.ppulsa}
❏────

┌─「 Donasi • Non Pulsa 」
│ • *Dana:* ${global.pdana}
│ • *Saweria:* ${global.psaweria}
❏────

*ʙᴀᴄᴋ ᴛᴏ ᴀʟʟ ᴍᴇɴᴜ*: .?
*ᴘɪɴɢ*: .ping
*ᴄʀᴇᴀᴛᴏʀ*: .creator
︵‿︵‿︵‿︵︵‿︵‿︵‿︵︵‿︵‿︵‿
Created by ${global.namebot}
`;

    let you = flaaa.getRandom();

    await conn.reply(m.quoted ? m.quoted : m.chat, donasi, m); // Reply with donation information

};

handler.help = ['donasi'];
handler.tags = ['info'];
handler.command = /^dona(te|si)$/i;

export default handler;
