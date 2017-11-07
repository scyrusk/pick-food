// location-model.js - A mongoose model
//
// See http://mongoosejs.com/docs/models.html
// for more of what you can do here.

module.exports = function (app) {
  const mongooseClient = app.get('mongooseClient');
  const location = new mongooseClient.Schema({
    title: {
      type: String,
      required: [true, 'Title is required']
    },
    loc: {
      type: [Number],
      index: '2dsphere',
      required: [true, 'Location is required']
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    user_id: {
      type: mongooseClient.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required']
    }
  });

  return mongooseClient.model('location', location);
};