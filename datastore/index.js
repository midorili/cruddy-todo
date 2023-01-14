const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');

var items = {};

// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  var id = counter.getNextUniqueId((err, id) => {
    items[id] = text;
    var fileDirectory = exports.dataDir + '/' + id + '.txt';
    //(file, data, cb)
    fs.writeFile(fileDirectory, text, (err, data) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, { id, text });
      }
    });
  });
};

exports.readAll = (callback) => {
  //read directory
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      callback(err, null);
    } else {
      //generate list of files
      var data = _.map(files, (text, id) => {
        return { id, text };
      });
      callback(null, data);
    }
  });
};

exports.readOne = (id, callback) => {
  var fileDirectory = exports.dataDir + '/' + id + '.txt';

  fs.readFile(fileDirectory, (err, fileData) => {
    if (!fileData) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      if (err) {
        callback(err, null);
      } else {
        var text = fileData.toString();
        callback(null, { id, text });
      }
    }
  });
};

exports.update = (id, text, callback) => {
  var fileDirectory = exports.dataDir + '/' + id + '.txt';
  fs.readFile(fileDirectory, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      fs.writeFile(fileDirectory, text, (err, data) => {
        if (err) {
          callback(err, null);
        } else {
          callback(null, { id, text });
        }
      });
    }
  });
};

exports.delete = (id, callback) => {
  var fileDirectory = exports.dataDir + '/' + id + '.txt';
  fs.unlink(fileDirectory, (err, fileData) => {
    if (err) {
      callback(err, null);
    } else {
      callback(null, fileData);
    }
  });
};

// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
