module.exports = function(helper) {
  var binaryToPulse, protocolInfo, pulsesToBinaryMapping;
  pulsesToBinaryMapping = {
    '10': '0',
    '01': '1',
    '02': ''
  };
  binaryToPulse = {
    '0': '10',
    '1': '01'
  };
  return protocolInfo = {
    name: 'contact2',
    type: 'contact',
    values: {
      id: {
        type: "number"
      },
      contact: {
        type: "boolean"
      }
    },
    brands: ["No brand"],
    pulseLengths: [295, 886, 9626],
    pulseCount: 50,
    decodePulses: function(pulses) {
      var binary, result;
      binary = helper.map(pulses, pulsesToBinaryMapping);
      return result = {
        id: helper.binaryToNumber(binary, 0, 19),
        contact: false
      };
    }
  };
};
