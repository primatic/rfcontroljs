module.exports = (helper) ->
  pulsesToBinaryMapping = {
    '1000': '0'
    '1110': '1'
    '2': ''
  }
  # generic 2272-L4 decoder based schema
  # F = '01' = 1000 1110
  # H = '11' = 1110 1110
  # L = '00' = 1000 1000
  # unit = A0..A7; FFFFFFFH = 0101010101010111 = 21847
  # id = D3..D0; FFFF = 01010101 = 85
  # datasheet http://www.princeton.com.tw/Portals/0/Product/PT2272.pdf
  # timing protokoll1 https://www.sweetpi.de/blog/329/ein-ueberblick-ueber-433mhz-funksteckdosen-und-deren-protokolle
  # bit order https://dzrmo.wordpress.com/2012/07/08/remote-control-pt2272-for-android/
  # 375 us = 1 bit = 1/4 osc => fosc = 375us/4 = 94 us ~ 10 kHz ~ 3.3 MOhm / 680 kOhm oscilator resistor values
  # ELMA 6898-81: https://www.ceneo.pl/8719617
  binaryToPulse = {
    '0': '1000'
    '1': '1110'
  }
  return protocolInfo = {
    name: 'doorbell4'
    type: 'switch'
    values:
      id:
        type: "number"
      unit:
        type: "number"
    brands: ["2272-L4","ELMA 6898-81"]
    pulseLengths: [375, 1125, 12020]
    pulseCount: 96
    decodePulses: (pulses) ->
      src = pulses.substring(1)
      binary = helper.map(src, pulsesToBinaryMapping)
      return result = {
        id: helper.binaryToNumber(binary, 0, 7),
        unit: helper.binaryToNumber(binary, 8, 11),
      }
    encodeMessage: (message) ->
      id = helper.map(helper.numberToBinary(message.id, 8), binaryToPulse)
      unit = helper.map(helper.numberToBinary(message.unit, 4), binaryToPulse)
      return "0#{id}#{unit}2"
  }

