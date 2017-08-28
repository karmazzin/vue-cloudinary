(function (exports,Vue,cloudinary) { 'use strict';

  Vue = 'default' in Vue ? Vue['default'] : Vue;
  cloudinary = 'default' in cloudinary ? cloudinary['default'] : cloudinary;

  var version = '0.1.0';
  var configuration;
  var cloudinaryInstance;

  var compatible = (/^2\./).test(Vue.version);
  if (!compatible) {
    Vue.util.warn('CloudinaryImage ' + version + ' only supports Vue 2.x, and does not support Vue ' + Vue.version);
  }

  var cloudinaryAttr = function(attr){
    if (attr.match(/cl[A-Z]/)) attr = attr.substring(2);
    return attr.replace(/([a-z])([A-Z])/g,'$1_$2').toLowerCase();
  };

  /**
   * Returns an array of attributes for cloudinary.
   * @function toCloudinaryAttributes
   * @param {Object} source - an object containing attributes
   * @param {(RegExp|string)} [filter] - copy only attributes whose name matches the filter
   * @return {Object} attributes for cloudinary functions
   */
  var toCloudinaryAttributes = function( source, filter) {
    var attributes = {};
    var isNamedNodeMap;
    if (window.NamedNodeMap) {
      isNamedNodeMap = source && (source.constructor.name === 'NamedNodeMap' || source instanceof NamedNodeMap);
    } else if (window.MozNamedAttrMap) {
      // https://developer.mozilla.org/en-US/docs/Web/API/NamedNodeMap
      // https://www.fxsitecompat.com/en-CA/docs/2013/namednodemap-has-been-renamed-to-moznamedattrmap/
      // In Firefox versions 22 - 33 the interface "NamedNodeMap" was called "MozNamedAttrMap"
      isNamedNodeMap = source && (source.constructor.name === 'MozNamedAttrMap' || source instanceof MozNamedAttrMap);
    }
    source.forEach(function(value, name){
      if( isNamedNodeMap) {
        name = value.name;
        value = value.value;
      }
      if (!filter || filter.exec(name)) {
        attributes[cloudinaryAttr(name)] = value;
      }
    });
    return attributes;
  };


  var clImage = {
    inserted: function(el, binding) {
      el.setAttribute('src', cloudinaryInstance.url(binding.value.publicId));

    },

    componentUpdated: function(el, binding) {
      el.setAttribute('src', cloudinaryInstance.url(binding.value.publicId), toCloudinaryAttributes(el.attributes));
    },
  };

  // export var mixin = {
  //   directives: {
  //     clImage: clImage,
  //   },
  // };


  function install(Vue, options) {
    configuration = new cloudinary.Configuration(options);
    // if (cloudinary.CloudinaryJQuery && jQuery) {
    //   // cloudinary is attached to the global `jQuery` object
    //   jQuery.cloudinary.config(configuration.config());
    //   cloudinaryInstance = jQuery.cloudinary;
    // } else {
    cloudinaryInstance = new cloudinary.Cloudinary(configuration.config());
    // }
    cloudinary.Util.assign(cloudinaryInstance, cloudinary); // copy namespace to the service instance
    Vue.directive('cl-image', clImage);

  }

  exports.version = version;
  exports.install = install;

})((this.VueCloudinary = {}),Vue,cloudinary);