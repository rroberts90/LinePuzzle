

import  React, { useEffect, useState } from 'react';
import { View,Text, StyleSheet, SafeAreaView, Animated } from 'react-native';

import { BackButton } from './NavigationButtons';

const defaultBackground = 'rgba(248,248,255,1)';

export default function AboutScreen({navigation}) {
    return (<View>
      <BackButton onPress={() => navigation.navigate('colormaze')} />

    </View>);
}