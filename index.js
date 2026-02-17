import { Client, GatewayIntentBits, Collection } from 'discord.js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });
const prefix = process.env.PREFIX || '!';

// Colección de comandos
client.commands = new Collection();

// Crear carpeta commands si no existe
const commandsPath = path.resolve('./commands');
if (!fs.existsSync(commandsPath)) fs.mkdirSync(commandsPath);

// Cargar comandos
const commandFiles = fs.readdirSync(commandsPath).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.once('ready', () => {
  console.log(`${client.user.tag} está listo!`);
});

client.on('messageCreate', message => {
  if (message.author.bot) return;
  if (!message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);
  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.channel.send('Ocurrió un error ejecutando el comando!');
  }
});

client.login(process.env.TOKEN);
