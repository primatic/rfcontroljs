module.exports = (helper) ->
  # mapping for decoding
  pulsesToBinaryMapping = {
    '12': '1' #binary 1
    '02': '0' #binary 0
    '03': ''  #footer
    '13': ''  #footer2
  }
  # same for send
  binaryToPulse = {
    '1': '12'
    '0': '02'
  }
  return protocolInfo = {
    name: 'switch12'
    type: 'switch'
    values:
      id:
        type: "binary"
      state:
        type: "boolean"
      unit:
        type: "number"
    brands: ["Europe RS-200"]
    pulseLengths: [ 562, 1313, 3234, 34888 ]
    pulseCount: 52
    decodePulses: (pulses) ->
      # pulses is something like: '1202021212021212121212121212021202121202121212020203'
      # we first map the sequences to binary
      binary = helper.map(pulses, pulsesToBinaryMapping)
      # binary is now something like: '100110111111110101101110003'
      # now we extract the data from that string
      # | 10011011111111|0|1|01|1|0|11|1|0|0
      # | ID?           |S|1|U1|1|S|11|s|S|
      # S=State
      # s=!State
      # U1=unit-4
      return result = {
        id: helper.binaryToNumber(binary, 0, 13)
        unit: (4-helper.binaryToNumber(binary, 16, 17))
        state: helper.binaryToBoolean(binary, 19)
      }
    encodeMessage: (message) ->
      id = helper.numberToBinary(message.id, 14)
      state = (if message.state then '1' else '0')
      state_inv = (if message.state then '0' else '1')
      unit1 = helper.numberToBinary(4-message.unit, 2)
      if message.unit is 1
        rfstring = helper.map(
          "#{id}#{state_inv}1#{unit1}1#{state}11#{state}#{state}1",
          binaryToPulse)
      else
        rfstring = helper.map(
          "#{id}#{state}1#{unit1}1#{state}11#{state_inv}#{state}0",
          binaryToPulse)
      if message.unit is 2
        return "#{rfstring}13"
      else
        return "#{rfstring}03"
  }
