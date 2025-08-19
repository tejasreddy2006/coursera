(function (window) {
  var goodbyeSpeaker = {};
  var speakWord = "Goodbye";

  goodbyeSpeaker.speak = function (name) {
    console.log(speakWord + " " + name);
  };

  window.goodbyeSpeaker = goodbyeSpeaker;
})(window);

