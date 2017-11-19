module.exports = function(helper) {
  var protocolInfo, pulsesToBinaryMapping;
  pulsesToBinaryMapping = {
    '01': '0',
    '02': '1',
    '03': ''
  };
  return protocolInfo = {
    name: 'weather11',
    type: 'weather',
    values: {
      temperature: {
        type: "number"
      },
      humidity: {
        type: "number"
      },
      channel: {
        type: "number"
      },
      id: {
        type: "number"
      },
      lowBattery: {
        type: "boolean"
      }
    },
    brands: ["Xiron Temperature & Humidity Sensor"],
    pulseLengths: [544, 1056, 1984, 3880],
    pulseCount: 84,
    decodePulses: function(pulses) {
      var binary, lowBattery, result;
      binary = helper.map(pulses, pulsesToBinaryMapping);
      lowBattery = !helper.binaryToBoolean(binary, 8);
      return result = {
        id: helper.binaryToNumber(binary, 0, 7),
        channel: helper.binaryToNumber(binary, 10, 11) + 1,
        temperature: helper.binaryToSignedNumber(binary, 12, 23) / 10,
        humidity: helper.binaryToNumber(binary, 28, 35),
        lowBattery: lowBattery
      };
    }
  };
};
