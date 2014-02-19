(function () {
  "use strict";

  var timer;
  var callbacks = [];

  var periods = [
    {name : "morning", start : 6, end : 13},
    {name : "afternoon", start : 13, end : 21},
    {name : "night", start : 21, end : 6}
  ];

  function currentPeriod () {
    var hours = new Date().getHours();
    for (var i = 0; i < periods.length; i++) {
      var period = periods[i];

      if (period.start <= period.end) {
        if (hours >= period.start && hours < period.end) {
          return period.name;
        }
      }
      if (period.start > period.end) {
        if (hours >= period.start || hours < period.end) {
          return period.name;
        }
      }
    }
  }

  function addCallback (cb) {
    callbacks.push(cb);
  }

  function callbackIndex (cb) {
    for (var i = 0; i < callbacks.length; i++) {
      if (callbacks[i] === cb) {
        return i;
      }
    }
    return -1;
  }

  function trigger (newMoment) {
    for (var i = 0; i < callbacks.length; i++) {
      callbacks[i](newMoment);
    }
  }

  function startTimer () {
    var currentDate = new Date();
    var millisecondsToNextHour = (1 * 3600 * 1000) - (currentDate.getMilliseconds() + (currentDate.getSeconds() * 1000) + (currentDate.getMinutes() * 60 * 1000));
    var oldPeriod = currentPeriod();
    timer = setTimeout(function () {
      var period = currentPeriod();
      if (oldPeriod !== period) {
        trigger(period);
      }
      startTimer();
    }, millisecondsToNextHour);
  }

  function onPeriodChange (cb) {
    if (!timer) {
      startTimer();
    }
    addCallback(cb);
    cb(currentPeriod());
  }

  function offPeriodChange (cb) {
    var index = callbackIndex(cb);
    if (index !== -1) {
      callbacks.splice(index, 1);
      if (timer && callbacks.length === 0) {
        clearTimeout(timer);
        timer = null;
      }
    }
  }

  var periodsOfTime = {
    onPeriodChange : onPeriodChange,
    offPeriodChange : offPeriodChange,
    currentPeriod : currentPeriod
  };

  // Export module
  var root = this;
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = periodsOfTime;
    }
    exports.periodOfTime = periodOfTime;
  } else {
    root.periodOfTime = periodOfTime;
  }

}());