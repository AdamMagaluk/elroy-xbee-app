var path = require('path')
  , fs = require('fs')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , XbeeHardwareDriver = require('fake-xbee-module');

var XbeeScout = module.exports = function() {
  EventEmitter.call(this);
  this.driver = null;
  this.options = {port : '/dev/tty.usbserial-A601EM9Z'};
};
util.inherits(XbeeScout, EventEmitter);


XbeeScout.prototype.init = function(registry,cb){
  var self = this;
  this.driver = new XbeeHardwareDriver(this.options);
  this.driver.on('packet',this.packet.bind(this));
  this.driver.open(function(err){
    if(err)
      return cb(err);

    registry.json_devices.map(function(device){
      if(device.type !== 'light')
        return;

      var data = device.data;
      var obj = require(path.join('../drivers/light'));
      registry.setupDevice(obj,data,self.driver);
    });

    cb();
  });
};


/*
// Devices in Fog 
[
  {
    class : 'led',
    name : 'friendly name in sys',
    id : 'unique_id_within_a_class', this would be an ip/mac/16bit zigbee. Address id for implementation protocol
    ... data class specific data that is persisted.
    ... state machine data
  }
]

 */
XbeeScout.prototype._assocation = function(packet){
  var type = 'light';
  if(packet.services[0] !== type)
    return;

  var obj = require(path.join('../drivers',type));

  var data = {
    name : packet.deviceId,
    id :packet.remote16,
    services : packet.services,
    remote16 : packet.remote16,
  };

  this.emit('discover', obj,data,this.driver);
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


