const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const Message = mongoose.model('Message');
const MessageBox = mongoose.model('MessageBox');

module.exports = app => {
  // Get MessageBox
  app.get('/api/message/box', requireAuth, async (req, res) => {
    try {
      const messageBox = await MessageBox.findOne({ _owner: req.user.id });
      res.status(200).send(messageBox);
    } catch (e) {
      console.log(e);
    }
  });

  // Send a new message
  app.post(`/api/message/new/:to`, requireAuth, async (req, res) => {
    try {
      const { title, body } = req.body;
      const { to } = req.params;
      const createdAt = Date.now();
      const newMessage = await new Message({
        _from: req.user.id,
        _to: to,
        createdAt,
        title: title,
        messages: [{ _owner: req.user.id, createdAt, body: body }]
      }).save();

      await MessageBox.findOneAndUpdate(
        { _owner: to },
        {
          $push: { _unread: newMessage._id, _messages: newMessage._id }
        }
      );
    } catch (e) {
      console.log(e);
    }
  });
};
