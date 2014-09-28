module.exports = {
  // function to clone an object
  clone: function(obj) {
    var newobj = {};
    for(var keys = Object.keys(obj), l = keys.length; l; --l) {
       newobj[keys[l-1]] = obj[keys[l-1]];
    }
    
    return newobj;
  },
  extend: function(a, b) {
    var newvar = this.clone(a);
    for(var x in b) {
      newvar[x] = b[x];
    }
    
    return newvar;
  }
}