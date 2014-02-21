var HelloApp = module.exports = function() {
  this.name = 'hello';
};

HelloApp.prototype.init = function(elroy) {

  elroy.find("device:light:*",function(err,lights){
    lights.forEach(function(light){
      elroy.expose(light);
      light.call('turn-on',function(){});
    });
  });

  elroy.on('deviceready',function(device){
    if(device.type !== 'light')
      return;

    elroy.expose(device);
    device.call('turn-on',function(){});

  });
};
