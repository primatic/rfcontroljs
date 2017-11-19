module.exports = function(helper) {
  var binaryToPulse, protocolInfo, pulsesToBinaryMapping;
  pulsesToBinaryMapping = {
    '1000': '0'
    '1110': '1'
    '2': ''
  };
  // generic 2272-L4 decoder based schema
  // F = '01' = 1000 1110
  // H = '11' = 1110 1110
  // L = '00' = 1000 1000
  // unit = A0..A7; FFFFFFFH = 0101010101010111 = 21847
  // id = D3..D0; FFFF = 01010101 = 85
  binaryToPulse = {
    '0': '1000',
    '1': '1110'
  }
  return protocolInfo = {
    name: 'doorbell4',
    type: 'switch',
    values: {
      id: {
        type: "number"
      },
      unit: {
        type: "number"
      }
    },
    brands: ["2272-L4","ELMA 6898-81"],
    pulseLengths: [375, 1125, 12020],
    pulseCount: 96,
    decodePulses: function(pulses) {
      var binary, result, src;
      src = pulses.substring(1);
      binary = helper.map(src, pulsesToBinaryMapping);
      return result = {
        id: helper.binaryToNumber(binary, 0, 7),
        unit: helper.binaryToNumber(binary, 8, 11),
      };
    },
    encodeMessage: function(message) {
      var id, unit;
      id = helper.map(helper.numberToBinary(message.id, 8), binaryToPulse);
      unit = helper.map(helper.numberToBinary(message.unit, 4), binaryToPulse);
      return "0" + id + unit + "2";
    }
  };
};
