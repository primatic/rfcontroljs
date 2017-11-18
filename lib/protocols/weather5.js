module.exports = function(helper) {
  var protocolInfo, pulsesToBinaryMapping;
  pulsesToBinaryMapping = {
    '01': '0',
    '02': '1',
    '03': ''
  };
  return protocolInfo = {
    name: 'weather5',
    type: 'weather',
    values: {
      id: {
        type: "number"
      },
      temperature: {
        type: "number"
      },
      humidity: {
        type: "number"
      },
      battery: {
        type: "number"
      },
      avgAirspeed: {
        type: "number"
      },
      windGust: {
        type: "number"
      },
      windDirection: {
        type: "number"
      },
      rain: {
        type: "number"
      },
      lowBattery: {
        type: "boolean"
      }
    },
    brands: ["Auriol", "Ventus", "Hama", "Meteoscan", "Alecto", "Balance"],
    pulseLengths: [534, 2000, 4000, 9000],
    pulseCount: 74,
    decodePulses: function(pulses) {
      var avgAirspeed, binary, h0, h1, humidity, id, lowBattery, rain, result, states, substate, temperature, windDirection, windGust;
      binary = helper.map(pulses, pulsesToBinaryMapping);
      states = helper.binaryToNumberLSBMSB(binary, 9, 10);
      id = helper.binaryToNumberLSBMSB(binary, 0, 7);
      lowBattery = helper.binaryToNumberLSBMSB(binary, 8, 8) !== 0;
      if (states === 0 || states === 1 || states === 2) {
        temperature = helper.binaryToSignedNumberLSBMSB(binary, 12, 23) / 10.0;
        h0 = helper.binaryToNumberLSBMSB(binary, 28, 31);
        h1 = helper.binaryToNumberLSBMSB(binary, 24, 27);
        humidity = h0 * 10 + h1;
        return result = {
          id: id,
          lowBattery: lowBattery,
          temperature: temperature,
          humidity: humidity
        };
      } else if (states === 3) {
        substate = helper.binaryToNumberLSBMSB(binary, 12, 14);
        if (substate === 1) {
          avgAirspeed = helper.binaryToNumberLSBMSB(binary, 24, 31) / 5.0;
          return result = {
            id: id,
            lowBattery: lowBattery,
            avgAirspeed: avgAirspeed
          };
        } else if (substate === 7) {
          windDirection = helper.binaryToNumberLSBMSB(binary, 15, 23);
          windGust = helper.binaryToNumberLSBMSB(binary, 24, 31) / 5.0;
          return result = {
            id: id,
            lowBattery: lowBattery,
            windDirection: windDirection,
            windGust: windGust
          };
        } else if (substate === 3) {
          rain = helper.binaryToNumberLSBMSB(binary, 16, 31) / 4.0;
          return result = {
            id: id,
            lowBattery: lowBattery,
            rain: rain
          };
        }
      }
      return result = {
        id: id,
        lowBattery: lowBattery
      };
    }
  };
};
