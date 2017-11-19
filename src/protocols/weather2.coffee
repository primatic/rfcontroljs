module.exports = (helper) ->
  pulsesToBinaryMapping = {
    '01': '0' #binary 0
    '02': '1' #binary 1
    '03': ''  #footer
  }
  return protocolInfo = {
    name: 'weather2'
    type: 'weather'
    values:
      temperature:
        type: "number"
    brands: ["Auriol", "Pollin (EWS-151)"]
    pulseLengths: [492, 969, 1948, 4004]
    pulseCount: 74
    decodePulses: (pulses) ->
      # pulses is something like: '01010102020202010201010101010101020202010201020102020202010101010101010103'
      # we first map: 01 => 0, 02 => 1, 03 => nothing
      binary = helper.map(pulses, pulsesToBinaryMapping)
      # binary is now something like: '000111101000000011101010111100000000'
      # now we extract the temperature from that string
      # | 000111101000| 000011101010 | 111100000000 |
      # | ?           | Temp.        | ?            |
      return result = {
        temperature: helper.binaryToSignedNumber(binary, 12, 23) / 10
      }
  }
