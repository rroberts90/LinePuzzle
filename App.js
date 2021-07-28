import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useRef, useState } from "react";
import { Animated, View, StyleSheet, PanResponder, Text, TextPropTypes, TouchableOpacity } from "react-native";
import { Svg, Path, Line, Rect, Circle, G } from 'react-native-svg';

const Node_Width = 75;

const distance = (dx, dy) => {
  return Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2))
}

const centerOnNode = (pos, flipped) => {
  if (flipped) {
    return { x: pos.x - Node_Width / 16, y: pos.y - Node_Width / 16 };
  }
  else {
    return { x: pos.x + Node_Width / 2, y: pos.y + Node_Width / 2 };
  }
}

const convertToLayout = (pos) => {
  return { left: pos.x, top: pos.y };
}

const borderStyles = (colors) => {
  return {
    borderTopColor: colors[0],
    borderLeftColor: colors[1],
    borderBottomColor: colors[2],
    borderRightColor: colors[3],
  }
}
const rotate = (colors, rot) => {
  return colors.map((val, i) => {
    if (i + rot < 0) {
      return colors[colors.length - 1];
    }
    else {
      return colors[(i + rot) % 4]
    }
  })
}
const Pulse = (props) => {
  console.log(`props: ${props.GOGOGO}`);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const sizeAnim = useRef(new Animated.Value(Node_Width)).current;
  const moverAnim = useRef(new Animated.Value(0)).current;
  const colorStyles = borderStyles(props.colors);
  const duration = 1000;
  useEffect(() => {

    fadeAnim.setValue(1);
    sizeAnim.setValue(Node_Width);
    moverAnim.setValue(0);

    Animated.parallel([
      Animated.timing(sizeAnim, {
        toValue: Node_Width * 1.5,
        duration: duration,
        useNativeDriver: false,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: false,

      }),
      Animated.timing(moverAnim, {
        toValue: Node_Width * -.25,
        duration: duration,
        useNativeDriver: false,
      })
    ]).start(finished => {
      if (!finished) {
        // make sure that the pulse's opacity is 0 at end, so it will disapear
        fadeAnim.setValue(0);

      }
    });
  }, [props.GOGOGO]);
  return <Animated.View
    style={[
      styles.nodeSize,
      styles.pulse,
      colorStyles,
      convertToLayout(props.pos),
      {
        opacity: fadeAnim,
        width: sizeAnim, //Bind animated values
        height: sizeAnim,
        borderRadius: sizeAnim,
        transform: [{ translateX: moverAnim }, { translateY: moverAnim }]
      }]}

  />

}

const Segment = (props) => {
  return <Line
    x1={props.x1}
    x2={props.x2}
    y1={props.y1}
    y2={props.y2}
    fill="none"
    stroke={props.color}
    strokeWidth="3"
  />;
}
const UserPath = (props) => {
  return (
    <G>
      {props.segments}
    </G>
  );
}

const Node = (props) => {
  const colorStyles = borderStyles(props.colors);
  return (
    <View style={[convertToLayout(props.pos),
    styles.nodeSize,
    styles.nodeBorder,
      colorStyles
    ]} >
      {props.children}
    </View>
  );
}
const nodeObj = (row, col, x, y, colors) => {
  return {
    gridPos: { row: row, col: col },
    pos: { x: x, y: y },
    colors: colors || [colorScheme1.one, colorScheme1.two, colorScheme1.three, colorScheme1.four]
  };
}

const App = () => {

  const testNode = nodeObj(0, 0, 150, 300);
  const [endPoint, setEndPoint] = useState(centerOnNode(testNode.pos));
  const [visitedNodes, setVisitedNodes] = useState([testNode]);
  const lineSegments = useRef([]).current;

  const pan = useRef(new Animated.ValueXY()).current;
  const pulseFlag = useRef(0);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => {
        console.log("granting");
        pulseFlag.current = pulseFlag.current + 1;
        return true;
      },
      onMoveShouldSetPanResponder: () => true,

      onPanResponderGrant: (evt, gestureState) => {

        pan.setOffset({
          x: pan.x._value,
          y: pan.y._value
        });
      },
      onPanResponderMove: (evt, gestureState) => {
        setEndPoint({ x: gestureState.moveX, y: gestureState.moveY });

        return Animated.event(
          [
            null,
            { dx: pan.x, dy: pan.y }
          ],
          { useNativeDriver: false }
        )(evt, gestureState);
      },
      onPanResponderRelease: (evt, gestureState) => {
        console.log("RELEASED");
        setEndPoint(centerOnNode(visitedNodes[visitedNodes.length - 1].pos));

        pan.setValue({ x: 0, y: 0 });

      }
    })
  ).current;

  const p1 = visitedNodes[visitedNodes.length - 1].pos;
  return (
    <View style={styles.container}>
      <Node pos={p1} colors={testNode.colors} />
      <Pulse pos={p1} colors={testNode.colors} GOGOGO={pulseFlag.current} />

      <Svg height="100%" width="100%">
        <UserPath segments={lineSegments} />
        <Segment x1={p1.x + styles.nodeSize.width / 2} y1={p1.y + styles.nodeSize.width / 2} x2={endPoint.x} y2={endPoint.y} color="red" />
      </Svg>

      <Animated.View
        style={[{
          transform: [{ translateX: pan.x }, { translateY: pan.y }],
          position: "absolute",
          top: p1.y,
          left: p1.x,
        }, styles.nodeSize, styles.cursor]}
        {...panResponder.panHandlers}
      >

      </Animated.View>

    </View>
  );
}

const colorScheme1 =
{
  one: "rgba(231, 48, 110,1)", // magenta
  two: "rgba(47, 127, 183,1)", // blue
  three: "rgba(255, 167, 53,1)", // orange
  four: "rgba(46.3, 91.8, 3.1,1)" // lime green
}

const styles = StyleSheet.create({
  nodeSize: {
    position: "absolute",
    width: Node_Width,
    height: Node_Width,
    borderRadius: Node_Width / 2,
    borderWidth: Node_Width / 6,
    backgroundColor: "lightgrey",

    zIndex: 10
  },
  nodeBorder: {
  },
  pulse: {
    backgroundColor: "grey",
    zIndex: 0
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(240,234,214,1)"
  },
  titleText: {
    fontSize: 14,
    lineHeight: 24,
    fontWeight: "bold"
  },
  cursor: {
    backgroundColor: "rgba(0,0,0,.1)",
    borderColor: "rgba(255,255,255,.1)"
  },
  origin: {
    position: "absolute",
    top: 100,
    left: 100
  },
  rect: {
    left: 10,
    width: 50,
    height: 50,
    backgroundColor: "blue",
    borderRadius: 1
  }

});

export default App;