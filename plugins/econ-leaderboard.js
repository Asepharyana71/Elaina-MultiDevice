import { areJidsSameUser } from '@adiwajshing/baileys';
import { createHash } from 'crypto';
import PhoneNumber from 'awesome-phonenumber';
import { canLevelUp, xpRange } from '../lib/levelling.js';

let handler = async (m, { conn, args, usedPrefix, participants }) => {
  let users = Object.entries(global.db.data.users).map(([key, value]) => {
    let wallet = value.credit || 0;
    let bankAmount = value.bank || 0;
    let totalgold = wallet + bankAmount;
    return { ...value, jid: key, totalgold };
  });
  let who = m.quoted ? m.quoted.sender : m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender;
  let user = global.db.data.users[who];
  if (!(who in global.db.data.users)) throw '✳️ The user is not found in my database';
  let pp = await conn.profilePictureUrl(who, 'image').catch(_ => './XLICON.jpg');
  let about = (await conn.fetchStatus(who).catch(console.error))?.status || '';
  let { name, exp, credit, lastclaim, registered, regTime, age, level, role, warn } = global.db.data.users[who];
  let { min, xp, max } = xpRange(user.level, global.multiplier);
  let username = conn.getName(who);
  let math = max - xp;
  let prem = global.prems.includes(who.split('@')[0]);
  let sn = createHash('md5').update(who).digest('hex');

  let sortedGold = users.map(toNumber('totalgold')).sort(sort('totalgold', false)); // Sort in descending order (highest gold first)

  let usersGold = sortedGold.map(user => user.jid);

  let len = args[0] && args[0].length > 0 ? Math.min(50, Math.max(parseInt(args[0]), 5)) : Math.min(10, sortedGold.length);
  let text = `
 *GLOBAL LEADERBOARD (GOLD)* 

${sortedGold.slice(0, len).map(({ jid, exp, level, credit, bank, role, totalgold }, i) => {
    let wallet = credit || 0;
    let bankAmount = bank || 0;
    if (isNaN(totalgold) || isNaN(wallet) || isNaN(bankAmount)) return ''; // Exclude users with undefined gold, credit, or bank
    let user = global.db.data.users[jid];
    let username = user.name;
    return `*#${i + 1}.*
* Username:* ${username}
* Experience:* ${exp}
* Rank:* ${role}
*✨ Level:* ${level}
* Wallet:* ${wallet}
* Bank:* ${bankAmount}
* Gold:* ${totalgold}`;
  }).filter(Boolean).join('\n\n\n')}
*You are at ${usersGold.indexOf(m.sender) + 1} out of total ${usersGold.length} members*`
    .trim();

  conn.reply(m.chat, text, m, {
    mentions: [...usersGold.slice(0, len)].filter(v => !participants.some(p => areJidsSameUser(v, p.id)))
  });
};

handler.help = ['leaderboardgold', 'lbgold'];
handler.tags = ['core'];
handler.command = ['leaderboardgold', 'lbgold'];

export default handler;

function sort(property, ascending = true) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property];
  else return (...args) => args[ascending & 1] - args[!ascending & 1];
}

function toNumber(property, _default = 0) {
  return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] };
  };
}
