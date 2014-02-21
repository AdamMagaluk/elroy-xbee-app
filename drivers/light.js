var LEDDriver = module.exports = function(data,driver) {
  // device driver type
  this.type = 'light';
  this.name = data.name;
  this.data = data;

  this.state = 'off';
  this.percent = 0;
  this.driver = driver;

};

LEDDriver.prototype.init = function(config) {
  config
    .when('on', { allow: ['turn-off', 'toggle', 'dim'] })
    .when('off', { allow: ['turn-on', 'toggle', 'dim'] })
    .map('turn-on', this.turnOn)
    .map('turn-off', this.turnOff)
    .map('dim', this.dim)
    .map('toggle', this.toggle)
};

LEDDriver.prototype.turnOn = function(cb) {
  this.state = 'on';
  this.driver.write(this.data.remote16,{msg : 1,val : true},cb);
};

LEDDriver.prototype.turnOff = function(cb) {
  this.state = 'off';
  this.driver.write(this.data.remote16,{msg : 1,val : false},cb);
};

LEDDriver.prototype.dim = function(value,cb) {
  this.percent = value;
  this.driver.write(this.data.remote16,{msg : 2,val : value},cb);
};

LEDDriver.prototype.toggle = function(cb) {
  if (this.state === 'off') {
    this.call('turn-on');
    cb();
  } else if (this.state === 'on') {
    this.call('turn-off');
    cb();
  } else {
    cb(new Error('Invalid state - Valid states are "on" and "off".'));
  }
};
