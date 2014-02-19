# periods-of-time

Trigger events when the period of time change

## Examples

### Node.js

````javascript
var periodsOfTime = require("periods-of-time");
periodsOfTime.currentPeriod();
periodsOfTime.onPeriodChange(function (period) {});
periodsOfTime.offPeriodChange(function () {});
````

### Browser

````javascript
periodsOfTime.currentPeriod();
periodsOfTime.onPeriodChange(function (period) {});
periodsOfTime.offPeriodChange(function () {});
````