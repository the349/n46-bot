const {
  Command
} = require('discord-akairo');
const IKEA = require('ikea-availability-checker/source/lib/scraper');
const logger = require('../logger');

class IKEACommand extends Command {
  constructor () {
    super('ikea', {
      aliases: ['ikea'],
      cooldown: 10000,
      ratelimit: 2,
      args: [{
        id: 'PRODUKT',
        type: 'string'
      }]
    });
    this.IKEA = new IKEA('us', 'en');
  }

  exec (message, args) {
    const failure = this.client.util.embed()
      .setColor('#FF4136')
      .setAuthor('IKEA® USA', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ikea-logo.png')
      .addField('IKEA Command Failure', 'Perhaps that product doesn’t exist...');

    args.PRODUKT = args.PRODUKT.toUpperCase().trim();
    const firstLetterCode = parseInt(args.PRODUKT[0].toLowerCase(), 36) - 10;
    return this.IKEA.getProductCollections(firstLetterCode).catch(err => {
      logger.error('IKEACommand', err);
      return message.channel.send(failure);
    }).then((collections) => {
      const collection = collections.find(product => {
        return product.name.startsWith(args.PRODUKT);
      });
      if (!collection) return message.channel.send(failure);
      this.IKEA.getProductsFromCollectionUrl(collection.url).catch(err => {
        logger.error('IKEACommand', err);
        return message.channel.send(failure);
      }).then(products => {
        const product = products[Math.floor(Math.random() * products.length)];
        message.channel.send(this.client.util.embed()
          .setColor('#003399') // This is the official IKEA blue so don't change it
          .setAuthor('IKEA® USA', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ikea-logo.png')
          .setThumbnail(`https://www.ikea.com${product.imageUri}`)
          .setURL(`https://www.ikea.com${product.uri}`)
          .addField(`${product.name}`, `Buy it now for only ${product.price}`)
        );
      });
    });
  }
}

module.exports = IKEACommand;
