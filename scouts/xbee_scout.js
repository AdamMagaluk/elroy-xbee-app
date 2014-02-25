var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , XbeeHardwareDriver = require('fake-xbee-module')
  , XbeeLightMachine = require('../drivers/light');

var XbeeScout = module.exports = function() {
  EventEmitter.call(this);
  this.driver = null;
  this.options = {port : '/dev/tty.usbmodem1411'};
  this.drivers = ['light'];
};
util.inherits(XbeeScout, EventEmitter);

XbeeScout.prototype.init = function(next){
  this.driver = new XbeeHardwareDriver(this.options);
  this.driver.on('packet',this.packet.bind(this));
  this.driver.open(next);
};

// provision registry device
XbeeScout.prototype.provision = function(device){
  if(device.type === 'light')
    return [XbeeLightMachine, device.data, this.driver];
};

XbeeScout.prototype._assocation = function(packet){
  var type = 'light';
  if(packet.services[0] !== type)
    return;

  var data = {
    name : packet.deviceId,
    id :packet.remote16,
    services : packet.services,
    remote16 : packet.remote16,
  };

  this.emit('discover', XbeeLightMachine, data, this.driver);
};

XbeeScout.prototype.compare = function(a,b){
  return a.data.remote16 === b.data.remote16;
};

XbeeScout.prototype.packet = function(packet){
  //assocation packet
  if(packet.type === 0x03){
    return this._assocation(packet);
  }
};


