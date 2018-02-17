const { Command } = require('discord-akairo');
const IKEA = require('ikea-availability-checker/source/lib/scraper');

class IKEACommand extends Command {
  constructor () {
    super('ikea', {
      aliases: ['ikea'],
      cooldown: 10000,
      ratelimit: 2,
      args: [{
        id: 'product',
        type: 'string'
      }]
    });

    // Use US/English IKEA website for everything
    this.IKEA = new IKEA('us', 'en');
  }

  exec (message, { product }) {
    const failure = this.client.util.embed()
      .setColor('#FF4136')
      .setAuthor('IKEA® USA', 'https://upload.wikimedia.org/wikipedia/commons/1/1b/Ikea-logo.png')
      .addField('IKEA Command Failure', 'Perhaps that product doesn’t exist...');

    // IKEA products are all uppercase
    product = product.toUpperCase().trim();
    // Subtract 10 because it's stored by letter of the english alphabet
    const firstLetterCode = parseInt(product[0].toLowerCase(), 36) - 10;

    return this.IKEA.getProductCollections(firstLetterCode)
      .catch(err => {
        this.client.logger.error('IKEACommand', err);
        return message.channel.send(failure);
      })
      .then((collections) => {
        const collection = collections.find(collection => {
          return collection.name.startsWith(product);
        });

        if (!collection) return message.channel.send(failure);
        this.IKEA.getProductsFromCollectionUrl(collection.url)
          .catch(err => {
            this.client.logger.error('IKEACommand', err);
            return message.channel.send(failure);
          })
          .then(products => {
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
