const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const Message = mongoose.model('Message');
const MessageBox = mongoose.model('MessageBox');

module.exports = app => {
  // Get MessageBox
  app.get('/api/message/box', requireAuth, async (req, res) => {
    try {
      const messageBox = await MessageBox.findOne({_owner: req.user.id});
      res.status(200).send(messageBox);  
    } catch (e) {
      console.log(e);
    }
  })

  // Send a new message
  app.post(`/api/message/new/:to`, requireAuth, async (req, res) => {
    try {
      const { message } = req.body;
      const createdAt = Date.now();
      const newMessage = await new Message({
        _from: req.user.id,
        _to: message.to,
        createdAt,
        title: message.title,
        messages: [{ _owner: req.user.id, createdAt, body: message.body }]
      }).save();

      await MessageBox.findOneAndUpdate(
        { _owner: message.to },
        {
          _unread: { $push: newMessage._id },
          _messages: { $push: newMessage._id }
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
};
