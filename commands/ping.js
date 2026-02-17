export const name = 'ping';

export function execute(message, args) {
  message.channel.send('Pong!');
}
