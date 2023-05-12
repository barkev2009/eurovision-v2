import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';

const HeartLogo = ({ className, fill }) => {
  return (
    <View style={className}>
      <Svg viewBox="0 0 2950 3100">
        <Path fill={fill ? fill : 'gray'}
          d="M8060 2840 m-5816 -2835l0 0c-315,0 -688,233 -913,619 -61,-140 -278,-292 -536,-292 -207,0 -792,259 -792,1098 0,1080 1094,1304 1316,1641 12,21 40,29 61,16 12,-7 19,-17 21,-31 176,-520 1546,-1110 1546,-2170 2,-593 -387,-880 -702,-880zm-1941 1376l0 0c7,-669 356,-880 546,-880 265,0 375,202 392,292 17,90 118,161 150,14 33,-147 344,-595 728,-595 351,0 472,361 462,671 -29,838 -1108,1508 -1250,1929 -128,-256 -1037,-626 -1029,-1431z" />
      </Svg>
    </View>
  )
}

export default HeartLogo