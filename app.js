var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {

  elroy.on('deviceready',function(device){
    if(device.type !== 'light')
      return;

    elroy.expose(device);
    device.call('turn-on',function(){});
  });

};
