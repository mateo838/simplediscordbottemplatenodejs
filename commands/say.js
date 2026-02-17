export const name = 'say';

export function execute(message, args) {
  if (!args.length) return message.channel.send('Debes escribir un mensaje para decir!');
  const text = args.join(' ');
  message.channel.send(text);
}
