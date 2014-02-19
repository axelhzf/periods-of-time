var expect = require("chai").expect;
var sinon = require("sinon");

var periodOfTime = require("../src/periodOfTime");

describe("periodOfTime", function () {
  var clock;

  beforeEach(function () {
    clock = sinon.useFakeTimers(0, "setTimeout", "clearTimeout", "setInterval", "clearInterval", "Date");
  });

  afterEach(function () {
    clock.restore();
  });

  function tickHours (time) {
    clock.tick(time * 60 * 60 * 1000);
  }

  describe("getCurrentPeriod", function () {

    function assert (hour, moment) {
      tickHours(hour);
      expect(periodOfTime.currentPeriod()).to.eql(moment);
    }

    it("should return night if 21h >= time", function () {
      assert(21, "night");
    });

    it("should return night if time < 6h", function () {
      assert(5, "night");
    });

    it("should return morning if time >= 6h", function () {
      assert(6, "morning");
    });

    it("should return afternoon if time >= 16", function () {
      assert(16, "afternoon");
    });

  });

  describe("onPeriodChange", function () {

    var callback;

    beforeEach(function () {
      callback = sinon.spy();
    });

    it("should be called at first with the current moment is in the night", function () {
      periodOfTime.onPeriodChange(callback);
      expect(callback.called).to.be.true;
      expect(callback.getCall(0).args[0]).to.eql("night");
      periodOfTime.offPeriodChange(callback);
    });

    it("should be called at first when the current moment is in the day", function () {
      tickHours(6);
      periodOfTime.onPeriodChange(callback);
      expect(callback.called).to.be.true;
      expect(callback.getCall(0).args[0]).to.eql("morning");
      periodOfTime.offPeriodChange(callback);
    });

    it("should be called when change from night to day", function () {
      periodOfTime.onPeriodChange(callback);
      expect(callback.getCall(0).args[0]).to.eql("night");
      expect(callback.getCall(1)).to.be.null;
      tickHours(6);
      expect(callback.getCall(1).args[0]).to.eql("morning");
      expect(callback.getCall(2)).to.be.null;
      tickHours(7); //13h
      expect(callback.getCall(2).args[0]).to.eql("afternoon");
      expect(callback.getCall(3)).to.be.null;
      tickHours(8); //21h
      expect(callback.getCall(3).args[0]).to.eql("night");
      periodOfTime.offPeriodChange(callback);
    });


  });

});
