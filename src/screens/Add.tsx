// import React from "react";
// import { StackNavigationProp } from "@react-navigation/stack";
// import { Text, View, Dimensions } from "react-native";
// import tailwind from "tailwind-rn";

// import Card from "../components/card-obsolete";
// import { NavigatorParamList } from "../navigation/Main";

// const { height, width } = Dimensions.get("screen");

// type AddNavProp = StackNavigationProp<NavigatorParamList, "Add">;

// interface IAddRouter {
//   navigation: AddNavProp;
// }

// interface AddProps extends IAddRouter {}

// const Add: React.FC<AddProps> = (props) => {
//   return (
//     <View style={{ flex: 1, width: width / 1.1 }}>
//       <Text style={tailwind(" justify-center")}>
//         Pick One of the Incidents to report
//       </Text>
//       <View style={tailwind("flex-row flex-wrap justify-center")}>
//         {DATA.map(({ id, title }) => (
//           <Card
//             title={title}
//             onPress={() => console.log("pressed", title)}
//             key={id}
//           />
//         ))}
//       </View>
//     </View>
//   );
// };

// export default Add;

import React, { FC, useState } from "react";
import {
  View,
  FlatList,
  Text,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { State } from "react-native-gesture-handler";
import styled from "styled-components/native";
import Input from "../components/input";

const ScreenWidth = Dimensions.get("window").width;

const StyledContainer = styled(View)`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const StyledView = styled(View)`
  width: ${(ScreenWidth - 40) / 2 - 10 + "px"};
  background-color: #129712;
  padding: 10px;
  margin: 10px;
`;

const StyledText = styled(Text)`
  font-size: 30px;
  color: ${(props) => (props.normal ? "indigo" : "#fff")};
  align-self: center;
`;

type data = {
  id: number;
  title: string;
};

interface AddState {
  title: string;
  comments?: string;
}

const DATA = [
  { id: 1, title: "Broken Coffee Machine" },
  { id: 2, title: "Toilet Malfunction" },
  { id: 3, title: "Markers running out" },
  { id: 4, title: "Broken Lights" },
  { id: 5, title: "Other not mentioned" },
] as data[];

const Add: FC = (props: any) => {
  const initialState = {
    title: "",
    comments: "",
  };

  const [selectedData, setSelectedData] = useState<AddState>(initialState);

  const renderItems = ({ item }) => (
    <>
      <StyledView>
        <TouchableOpacity
          onPress={
            () => setSelectedData({ ...selectedData, title: item.title })

            //   () => props.navigation.jumpTo("Profile", { uid: item.id }) //https://reactnavigation.org/docs/navigation-prop : since it is a tab navigator prop
          }
        >
          <StyledText> {item.title}</StyledText>
        </TouchableOpacity>
      </StyledView>
    </>
  );

  return (
    <>
      <StyledContainer>
        <StyledText normal> Select one</StyledText>
        <FlatList
          data={DATA}
          renderItem={renderItems}
          keyExtractor={(item) => item.id}
          numColumns={2}
        />

        {selectedData.title === "Other not mentioned" ? (
          <Input
            placeholder="Add comments here...."
            onChangeText={(text) =>
              setSelectedData({ ...selectedData, comments: text })
            }
            textarea={true}
          />
        ) : null}
      </StyledContainer>
    </>
  );
};

export default Add;
