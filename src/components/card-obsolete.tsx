// import React from "react";
// import { ListItem, Avatar } from "react-native-elements";
// import { TouchableHighlight, Text } from "react-native";

// export default (props: any) => {
//   return (
//     <ListItem
//       Component={TouchableHighlight}
//       containerStyle={{ backgroundColor: "green" , }}
//       disabledStyle={{ opacity: 0.5 }}
//       onLongPress={() => console.log("onLongPress()")}
//       onPress={() => console.log("onPress()")}
//       pad={20}
//     >
//       <ListItem.Content>
//         <ListItem.Title>
//           <Text>{props.title}</Text>
//         </ListItem.Title>
//       </ListItem.Content>
//     </ListItem>
//   );
// };

import React from "react";
import {
  Text,
  View,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
} from "react-native";
import styled from "styled-components/native";

const ScreenWidth = Dimensions.get("window").width;

export interface ButtonProps {
  title: string;
  onPress: () => void;
}

const StyledView = styled(View)`
  width: ${(ScreenWidth - 40) / 2 - 10 + "px"};
  background-color: "#106904";
  padding: 10;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const StyledText = styled(Text)`
  font-size: 32;
  color: "#fff";
  align-self: "center";
`;

const Card: React.FC<ButtonProps> = (props) => {
  return (
    <StyledView>
      <TouchableHighlight onPress={props.onPress}>
        <StyledText> {props.title}</StyledText>
      </TouchableHighlight>
    </StyledView>

    /* const renderItems = ({ item }) => (
        <View style={styles.item}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      ); */

    // <View
    //   // style={styles.button}
    //   style={tailwind(
    //     "border-purple-800 bg-green-200 border-solid border-2  px-5 py-1.5 rounded-none my-1.5 flex mx-1  self-center h-1/4"
    //   )}
    // >
    //   <TouchableHighlight
    //     //   title="Login"
    //     onPress={props.onPress}
    //     // style={tailwind("")}
    //   >
    //     <Text style={tailwind("text-purple-800 font-semibold text-lg ")}>
    //       {props.title}
    //     </Text>
    //   </TouchableHighlight>
    // </View>
  );
};

export default Card;
