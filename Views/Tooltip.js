import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, Text} from 'react-native';

const getText = (level) => {
    let text = '';
    switch (level) {
        case 0:
            text = 'Press the blinking circle and drag';
            break;
        case 1:
            text = 'Arrows indicate linked circles. Linked rotate linked circle';
            break;
        case 2:
            text = 'Rotates every circle with matching symbol';
            break;
        case 3:
            text = '';
            break;
        case 4:
            text = 'Locks all linked circles in place';
            break;
        case 5:
            text = 'Changes direction of rotation';
            break;

    }
}
export default function Tooltip({ level }) {
    return <View style={styles.tooltip}>
        <Text>
            {getText(level)}
        </Text>

    </View>
}
const styles = StyleSheet.create({
    tooltip: {
        position: 'absolute',
        left: 5
    }
});