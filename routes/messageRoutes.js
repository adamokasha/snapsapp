const mongoose = require('mongoose');

const requireAuth = require('../middlewares/requireAuth');
const Message = mongoose.model('Message');
const MessageBox = mongoose.model('MessageBox');

module.exports = app => {
  // Get MessageBox unreads
  app.get('/api/message/unread', requireAuth, async (req, res) => {
    try {
      const messageBox = await MessageBox.aggregate([
        { $match: { _owner: mongoose.Types.ObjectId(req.user.id) } },
        {
          $lookup: {
            from: 'messages',
            localField: '_unread',
            foreignField: '_id',
            as: '_unread'
          }
        },
        { $unwind: '$_unread' },
        {
          $lookup: {
            from: 'users',
            localField: '_unread._from',
            foreignField: '_id',
            as: '_unread._from'
          }
        },
        { $unwind: '$_unread._from' },
        {
          $project: {
            _owner: 1,
            _unread: {
              _id: 1,
              title: 1,
              body: 1,
              replied: 1,
              // replies: 1,
              _from: { displayName: 1, profilePhoto: 1 }
            }
          }
        },
        // Roll back _unread's into array
        {
          $group: {
            _id: '$_id',
            _unread: { $push: '$_unread' },
            _owner: { $first: '$_owner' }
            // '_messages': {$first: '$_messages'}
          }
        }
      ]);

      // The easy way
      // const messageBox = await MessageBox.findOne({
      //   _owner: req.user.id
      // })
      //   .populate({ path: '_unread', select: 'title body _from' })
      //   .exec();

      // await MessageBox.populate(messageBox, {path: '_unread._from', select: 'displayName profilePhoto'});

      res.status(200).send(messageBox[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get MessageBox all
  app.get('/api/message/all', requireAuth, async (req, res) => {
    try {
      const messageBox = await MessageBox.aggregate([
        { $match: { _owner: mongoose.Types.ObjectId(req.user.id) } },
        {
          $lookup: {
            from: 'messages',
            localField: '_all',
            foreignField: '_id',
            as: '_all'
          }
        },
        { $unwind: '$_all' },
        {
          $lookup: {
            from: 'users',
            localField: '_all._from',
            foreignField: '_id',
            as: '_all._from'
          }
        },
        { $unwind: '$_all._from' },
        {
          $project: {
            _owner: 1,
            _all: {
              _id: 1,
              title: 1,
              body: 1,
              replied: 1,
              // replies: 1,
              _from: { displayName: 1, profilePhoto: 1 }
            }
          }
        },
        // Roll back _all's into array
        {
          $group: {
            _id: '$_id',
            _all: { $push: '$_all' },
            _owner: { $first: '$_owner' }
            // '_messages': {$first: '$_messages'}
          }
        }
      ]);

      res.status(200).send(messageBox[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get MessageBox sent
  app.get('/api/message/sent', requireAuth, async (req, res) => {
    try {
      const messageBox = await MessageBox.aggregate([
        { $match: { _owner: mongoose.Types.ObjectId(req.user.id) } },
        {
          $lookup: {
            from: 'messages',
            localField: '_sent',
            foreignField: '_id',
            as: '_sent'
          }
        },
        { $unwind: '$_sent' },
        {
          $lookup: {
            from: 'users',
            localField: '_sent._from',
            foreignField: '_id',
            as: '_sent._from'
          }
        },
        { $unwind: '$_sent._from' },
        {
          $project: {
            _owner: 1,
            _sent: {
              _id: 1,
              title: 1,
              body: 1,
              replied: 1,
              // replies: 1,
              _from: { displayName: 1, profilePhoto: 1 }
            }
          }
        },
        // Roll back _sent's into array
        {
          $group: {
            _id: '$_id',
            _sent: { $push: '$_sent' },
            _owner: { $first: '$_owner' }
            // '_messages': {$first: '$_messages'}
          }
        }
      ]);
      console.log(messageBox);

      res.status(200).send(messageBox[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get single message
  app.get('/api/message/get/:id', requireAuth, async (req, res) => {
    const message = await Message.findById({ _id: req.params.id }).populate({
      path: '_from _to',
      select: 'displayName profilePhoto'
    });
    // Populate
    await Message.populate(message, {
      path: 'replies._owner',
      select: 'displayName profilePhoto'
    });
    // If req.user is not the recipient or the sender = 401
    // Additional layer of security but most likely unnecessary
    const owners = [message._to._id.toString(), message._from._id.toString()];
    if (!owners.includes(req.user.id)) {
      return res
        .status(401)
        .send({ error: 'You are not authorized to view this message' });
    }

    // Remove from recipient's unread list
    await MessageBox.findOneAndUpdate(
      { _owner: req.user.id },
      { $pull: { _unread: req.params.id } }
    );

    res.status(200).send(message);
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
        title,
        body
      }).save();

      // Add message to recipient's MessageBox
      await MessageBox.findOneAndUpdate(
        { _owner: to },
        {
          $push: { _unread: newMessage._id, _all: newMessage._id }
        }
      );

      // Add Message to own MessageBox's sent list
      await MessageBox.findOneAndUpdate(
        { _owner: req.user.id },
        {
          $push: { _sent: newMessage._id }
        }
      );

      res.status(200).send({ success: 'Message sent!' });
    } catch (e) {
      console.log(e);
    }
  });

  // Reply to an existing message
  app.post(`/api/message/reply/:msgId`, requireAuth, async (req, res) => {
    try {
      const { body } = req.body;
      const reply = {
        _owner: req.user.id,
        createdAt: Date.now(),
        body
      };
      const message = await Message.findOneAndUpdate(
        { _id: req.params.msgId },
        { $push: { replies: reply } }
      );

      // Find the recipient
      const recipient = [
        message._from.toString(),
        message._to.toString()
      ].filter(owner => owner !== req.user.id)[0];
      console.log(req.user.id, recipient);
      // Update recipient's unread messages
      await MessageBox.findOneAndUpdate(
        { _owner: recipient },
        { $addToSet: { _unread: message._id, _all: message._id } }
      );
      res.status(200).send({ success: 'Reply sent' });
    } catch (e) {
      console.log(e);
    }
  });

  // Delete a single or multiple message from a user's MessageBox
  app.delete('/api/message/delete', requireAuth, async (req, res) => {
    try {
      const { deletions } = req.body;
      console.log(deletions);
      await MessageBox.findOneAndUpdate(
        { _owner: req.user.id },
        {
          $pull: {
            _unread: { $in: deletions },
            _all: { $in: deletions },
            _sent: { $in: deletions }
          }
        }
      );

      res.status(200).send({success: 'Message(s) deleted.'})
    } catch (e) {
      console.log(e);
    }
  });
};
