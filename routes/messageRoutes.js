const mongoose = require("mongoose");

const requireRegistration = require("../middlewares/requireRegistration");
const Message = mongoose.model("Message");
const MessageBox = mongoose.model("MessageBox");

module.exports = app => {
  // Aggregation pipeline takes in list type: _unread, _all, _sent.
  const setListAggrPipeline = (list, userId, page) => [
    { $match: { _owner: mongoose.Types.ObjectId(userId) } },
    {
      $lookup: {
        from: "messages",
        localField: `${list}`,
        foreignField: "_id",
        as: `${list}`
      }
    },
    { $unwind: `$${list}` },
    {
      $lookup: {
        from: "users",
        localField: `${list}._from`,
        foreignField: "_id",
        as: `${list}._from`
      }
    },
    { $unwind: `$${list}._from` },
    {
      $project: {
        _owner: 1,
        [`${list}`]: {
          _id: 1,
          title: 1,
          body: 1,
          lastReplied: 1,
          _from: { displayName: 1, profilePhoto: 1 }
        }
      }
    },
    { $sort: { [`${list}.lastReplied`]: -1 } },
    { $skip: 5 * page },
    { $limit: 5 },
    // Roll back list items into array
    {
      $group: {
        _id: "$_id",
        [`${list}`]: { $push: `$${list}` },
        _owner: { $first: "$_owner" }
      }
    }
  ];

  // Get MessageBox unreads
  app.get(
    "/api/message/unread/:page",
    requireRegistration,
    async (req, res) => {
      try {
        const messageBox = await MessageBox.aggregate(
          setListAggrPipeline("_unread", req.user.id, req.params.page)
        );

        res.status(200).send(messageBox[0]);
      } catch (e) {
        console.log(e);
      }
    }
  );

  // Get MessageBox unreads count only (For NavBar message box notification)
  app.get("/api/message/count", requireRegistration, async (req, res) => {
    try {
      const unreadCount = await MessageBox.aggregate([
        { $match: { _owner: mongoose.Types.ObjectId(req.user.id) } },
        {
          $project: {
            size: { $size: "$_unread" }
          }
        },
        { $limit: 1 }
      ]);

      res.status(200).send(unreadCount[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get MessageBox all
  app.get("/api/message/all/:page", requireRegistration, async (req, res) => {
    try {
      const messageBox = await MessageBox.aggregate(
        setListAggrPipeline("_all", req.user.id, req.params.page)
      );

      res.status(200).send(messageBox[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get MessageBox sent
  app.get("/api/message/sent/:page", requireRegistration, async (req, res) => {
    try {
      const messageBox = await MessageBox.aggregate(
        setListAggrPipeline("_sent", req.user.id, req.params.page)
      );

      res.status(200).send(messageBox[0]);
    } catch (e) {
      console.log(e);
    }
  });

  // Get single message and replies
  app.get(
    "/api/message/get/:id/:page",
    requireRegistration,
    async (req, res) => {
      try {
        const message = await Message.aggregate([
          { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
          { $unwind: "$replies" },
          { $sort: { "replies.createdAt": -1 } },
          { $skip: 5 * req.params.page },
          { $limit: 5 },
          { $sort: { "replies.createdAt": 1 } },
          {
            $lookup: {
              from: "users",
              localField: "replies._owner",
              foreignField: "_id",
              as: "replies._owner"
            }
          },
          { $unwind: "$replies._owner" },
          {
            $project: {
              title: 1,
              createdAt: 1,
              _to: 1,
              _from: 1,
              replies: {
                _id: 1,
                body: 1,
                createdAt: 1,
                _owner: { _id: 1, displayName: 1, profilePhoto: 1 }
              }
            }
          },
          {
            $group: {
              _id: "$_id",
              _to: { $first: "$_to" },
              _from: { $first: "$_from" },
              title: { $first: "$title" },
              createdAt: { $first: "$createdAt" },
              replies: { $push: "$replies" }
            }
          }
        ]);

        if (!message[0]) {
          return res.send(null);
        }

        // If req.user is not the recipient or the sender = 401
        // Additional layer of security but most likely unnecessary
        const owners = [message[0]._to.toString(), message[0]._from.toString()];
        if (!owners.includes(req.user.id)) {
          return res
            .status(401)
            .send({ error: "You are not authorized to view this message" });
        }

        // Remove from recipient's unread list
        await MessageBox.findOneAndUpdate(
          { _owner: req.user.id },
          { $pull: { _unread: req.params.id } }
        );

        res.status(200).send(message[0]);
      } catch (e) {
        console.log(e);
      }

      // const message = await Message.findById({ _id: req.params.id }).populate({
      //   path: '_from _to',
      //   select: 'displayName profilePhoto'
      // });
      // // Populate
      // await Message.populate(message, {
      //   path: 'replies._owner',
      //   select: 'displayName profilePhoto'
      // });

      // res.status(200).send(message);
    }
  );

  // Send a new message
  app.post(`/api/message/new/:to`, requireRegistration, async (req, res) => {
    try {
      const { title, body } = req.body;
      const { to } = req.params;
      const createdAt = Date.now();
      const newMessage = await new Message({
        _from: req.user.id,
        _to: to,
        createdAt,
        title,
        lastReplied: createdAt,
        replies: [{ _owner: req.user.id, body, createdAt }]
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

      res.status(200).send({ success: "Message sent!" });
    } catch (e) {
      console.log(e);
    }
  });

  // Reply to an existing message
  app.post(
    `/api/message/reply/:msgId`,
    requireRegistration,
    async (req, res) => {
      try {
        const { body } = req.body;
        const dateNow = Date.now();
        const reply = {
          _owner: req.user.id,
          createdAt: dateNow,
          body
        };
        const message = await Message.findOneAndUpdate(
          { _id: req.params.msgId },
          {
            $push: { replies: reply },
            $set: { lastReplied: dateNow, read: false }
          }
        );

        // Find the recipient
        const recipient = [
          message._from.toString(),
          message._to.toString()
        ].filter(owner => owner !== req.user.id)[0];
        // Update recipient's unread messages
        await MessageBox.findOneAndUpdate(
          { _owner: recipient },
          { $addToSet: { _unread: message._id, _all: message._id } }
        );
        res.status(200).send(reply);
      } catch (e) {
        console.log(e);
      }
    }
  );

  // Delete a single or multiple message from a user's MessageBox
  app.delete("/api/message/delete", requireRegistration, async (req, res) => {
    try {
      const { deletions } = req.body;
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

      res.status(200).send({ success: "Message(s) deleted." });
    } catch (e) {
      console.log(e);
    }
  });
};
