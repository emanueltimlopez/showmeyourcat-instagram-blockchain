const chai = require('chai');
const expect = chai.expect;
const chaiAsPromised = require("chai-as-promised");
chai.use(chaiAsPromised);

const ShowMeYourCat = artifacts.require('./ShowMeYourCat')

contract('ShowMeYourCat', ([deployer, author, tipper]) => {
  let showMeYourCat

  describe('deploy', async () => {
    before(async () => {
      showMeYourCat = await ShowMeYourCat.deployed()
    })

    it('should deploy successfully', async () => {
      const address = await showMeYourCat.address
      expect(address).to.not.equal(0x0)
      expect(address).to.not.equal('')
      expect(address).to.not.equal(null)
      expect(address).to.not.equal(undefined)
    })

    it('should has name', async () => {
      const name = await showMeYourCat.name()
      expect(name).to.equal('ShowMeYourCat')
    })
  })

  describe('images', async () => {
    let result, imageCount
    const hash = 'bidqibdqid3udnueinwxe'

    before(async () => {
      result = await showMeYourCat.uploadImage(hash, 'description', { from: author })
      imageCount = await showMeYourCat.imageCount()
    })

    it ('should create image', async () => {
      const image = await showMeYourCat.images(1)
      const event = result.logs[0].args
      expect(event.id.toNumber()).to.equal(imageCount.toNumber())
      expect(event.hash).to.equal(hash)
      expect(event.description).to.equal('description')
      expect(event.tipAmount.toNumber()).to.equal(0)
      expect(event.author).to.equal(author)
    })

    /*it ('should not create the image', async () => {
      await showMeYourCat.uploadImage('', 'description', {from: author}).should.be.rejected
      await showMeYourCat.uploadImage(hash, '', {from: author}).should.be.rejected
      await showMeYourCat.uploadImage(hash, 'description').should.be.rejected
    })*/

    it ('should list images', async () => {
      const image = await showMeYourCat.images(imageCount)
      expect(image.id.toNumber()).to.equal(imageCount.toNumber())
      expect(image.hash).to.equal(hash)
      expect(image.description).to.equal('description')
      expect(image.tipAmount.toNumber()).to.equal(0)
      expect(image.author).to.equal(author)
    })

    it ('should allow to tip images', async () => {
      let oldBalance = await web3.eth.getBalance(author)
      oldBalance = new web3.utils.BN(oldBalance)

      const result = await showMeYourCat.tipOwner(imageCount, {from: tipper, value: web3.utils.toWei('1', 'Ether')})

      const event = result.logs[0].args
      expect(event.id.toNumber()).to.equal(imageCount.toNumber())
      expect(event.hash).to.equal(hash)
      expect(event.description).to.equal('description')
      //expect(event.tipAmount).to.equal(new web3.utils.BN(100000000000000000))
      expect(event.author).to.equal(author)

      let newBalance = await web3.eth.getBalance(author)
      newBalance = new web3.utils.BN(newBalance)

      let tipOwner = web3.utils.toWei('1', 'Ether')
      tipOwner = new web3.utils.BN(tipOwner)

      const expectedBalance = oldBalance.add(tipOwner)
      expect(newBalance.toString()).to.equal(expectedBalance.toString())

      //await showMeYourCat.tipOwner(99, {from: tipper, value: web3.utils.toWei('1', 'Ether')})
    })
  })
})