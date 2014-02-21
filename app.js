var HelloApp = module.exports = function() {
  this.name = 'helloxbee';
};

HelloApp.prototype.init = function(elroy, cb) {

  elroy.find("device:light:*",function(err,lights){
    lights.forEach(function(light){
      elroy.expose(light);
      light.call('turn-on',function(){});
    });
    cb();
  });

  elroy.on('device:light:deviceready',function(light){
    elroy.expose(light);
    light.call('turn-on',function(){});
  });
};
