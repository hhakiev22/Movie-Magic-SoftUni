const mongoose = require("mongoose");

const castSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    match: /^[a-zA-Z0-9 ]+$/,
  },
  age: {
    type: Number,
    required: true,
    min: 1,
    max: 120,
  },
  born: {
    type: String,
    required: true,
    minLength: 10,
    match: /^[a-zA-Z0-9 ]+$/,
  },
  nameInMovie: {
    type: String,
    required: true,
    minLength: 5,
    match: /^[a-zA-Z0-9 ]+$/,
  },
  castImage: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return /^https?:\/\//.test(value);
      },
      message: (props) => `${props.value} is invalid url for castImage!`,
    },
  },
  // movies: [{
  //   type: mongoose.Types.ObjectId,
  //   ref: 'Movie'
  // }]
});

const Cast = mongoose.model("Cast", castSchema);

module.exports = Cast;
