/*

   The Node.js API module that communicates with the devices

   * Forked from Marco Schwartz [https://github.com/marcoschwartz]
   * Modified and remixed by Amir Off [https://github.com/amiroffme] on Sep, 2018
   *
   * This library is licensed under the GNU General Public License v3.0

*/


// Importing dependencies
const router = require('express').Router();
const request = require('request');
const userCtrl = require('../controllers/user.controller');

/* Registered devices are non-persistent and
   live as long as the Node.js process is running */
const database = {
  devices: [],
  getDevice: function (device) {
    for (let i = 0; i < this.devices.length; i++) {
      if (this.devices[i].id === device || this.devices[i].name === device) {
        return this.devices[i];
      }
    }
  }
};

class Device {
  constructor() {
    this.type = "";
    this.address = "";
    this.name = "";
    this.id = "";
  }

  getDevice(callback) {

    request({
      uri: 'http://' + this.address,
      json: true,
      timeout: 1000
    }, callback);

  };

  getVariable(variable, callback) {

    request({
      uri: 'http://' + this.address + '/' + variable,
      json: true,
      timeout: 1000
    }, callback);

  };

  callFunction(function_name, parameters, callback) {

    request({
      uri: 'http://' + this.address + '/' + function_name + "?params=" + parameters,
      json: true,
      timeout: 1000
    }, callback);

  };

  analogRead(pin, callback) {

    request({
      uri: 'http://' + this.address + '/analog/' + pin,
      json: true,
      timeout: 1000
    }, callback);

  };

  analogWrite(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/analog/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };

  digitalRead(pin, callback) {

    request({
      uri: 'http://' + this.address + '/digital/' + pin,
      json: true,
      timeout: 1000
    }, callback);

  };

  digitalWrite(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/digital/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };

  takeSnapshot(callback) {

    request({
      uri: 'http://' + this.address + '/camera/snapshot/',
      json: true,
      timeout: 1000
    }, callback);

  };

  pinMode(pin, value, callback) {

    request({
      uri: 'http://' + this.address + '/mode/' + pin + '/' + value,
      json: true,
      timeout: 1000
    }, callback);

  };
}

router.post('/signin', userCtrl.signin);
router.post('/signup', userCtrl.verifyJWT, userCtrl.signup);
router.get('/user', userCtrl.verifyJWT, userCtrl.getUser);

router.post('/add', userCtrl.verifyJWT, function (req, res) {
  let new_device = new Device();
  new_device.type = req.body.type;
  new_device.address = req.body.address;

  setTimeout(function () {
    new_device.getVariable('id', function (error, response, body) {
      if (error || typeof(body) === 'undefined') {
        console.log('The device is offline and cannot be added!');
        res.status(404).json({'error': 'The device is offline and cannot be added!'});
      }
      else {
        new_device.id = body.id;
        new_device.name = body.name;
        new_device.hardware = body.hardware;
        database.devices.push(new_device);
        // Send response headers back to client
        res.status(200).json({
          'id': body.id
        });
        console.log("Device added with ID: " + body.id);
      }
    });
  }, 2000);

});

// Return all devices
router.get('/devices', userCtrl.verifyJWT, function (req, res) {
  let simple_devices = [];
  for (let i = 0; i < database.devices.length; i++) {
    let simple_device = {};
    simple_device.id = database.devices[i].id;
    simple_device.name = database.devices[i].name;
    simple_device.hardware = database.devices[i].hardware;
    simple_device.type = database.devices[i].type;
    simple_device.address = database.devices[i].address;
    simple_devices.push(simple_device);
  }
  res.json(simple_devices);
});

// Return a specific device
router.get('/:device', userCtrl.verifyJWT, function (req, res) {
  console.log('Sync request sent to device: ' + req.params.device);
  let device = database.getDevice(req.params.device);
  if (typeof(device) !== 'undefined') {
    // Get status
    device.getDevice(function (error, response, body) {
      res.json(body);
    });
  } else {
    res.json({message: 'Device not found'});
  }
});

// Execute a function
router.get('/:device/:command', userCtrl.verifyJWT, function (req, res) {
  // Get device
  let device = database.getDevice(req.params.device);
  if (typeof(device) !== 'undefined') {
    if (req.query.params) {
      console.log('Function execution request sent to device: ' + req.params.device);
      // Execute function
      device.callFunction(req.params.command, req.query.params, function (error, response, body) {
        res.json(body);
      });
    } else {
      console.log('Variable read request sent to device: ' + req.params.device);
      // Get variable
      device.getVariable(req.params.command, function (error, response, body) {
        res.json(body);
      });
    }
  } else {
    res.json({message: 'Device not found'});
  }
});

// Digital write
router.get('/:device/digital/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Digital write request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  if (typeof(device) !== 'undefined') {
    // Send command
    device.digitalWrite(req.params.pin, req.params.value, function (error, response, body) {
      res.json(body);
    });
  }
  else {
    res.json({message: 'Device not found'});
  }
});

// Analog read
router.get('/:device/analog/:pin/', userCtrl.verifyJWT, function (req, res) {
  console.log('Analog read request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.analogRead(req.params.pin, function (error, response, body) {
    res.json(body);
  });
});

// Analog write
router.get('/:device/analog/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Analog write request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.analogWrite(req.params.pin, req.params.value, function (error, response, body) {
    res.json(body);
  });
});

// Digital read
router.get('/:device/digital/:pin/', userCtrl.verifyJWT, function (req, res) {
  console.log('Digital read request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.digitalRead(req.params.pin, function (error, response, body) {
    res.json(body);
  });
});

// Pin mode
router.get('/:device/mode/:pin/:value', userCtrl.verifyJWT, function (req, res) {
  console.log('Pin mode request sent to device: ' + req.params.device);
  // Get device
  let device = database.getDevice(req.params.device);
  // Get variable
  device.pinMode(req.params.pin, req.params.value, function (error, response, body) {
    res.json(body);
  });
});

// Exporting routs to to Node.js
module.exports = router;
