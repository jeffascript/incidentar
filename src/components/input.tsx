import React, { FC } from "react";
import { View, Dimensions, TextInput } from "react-native";
// import { TextInput } from 'react-native-gesture-handler';
import styled from "styled-components/native";

const { height, width } = Dimensions.get("screen");

const StyledViewContainer = styled(View)`
  width: ${width / 1.1 + "px"};
  align-self: center;
  background-color: #e3e3e3;
  border-radius: 5px;
  margin-bottom: 10px;
  margin-top: 10px;
`;

const StyledInput = styled(TextInput)`
  padding: 15px;
`;

export interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
}

const Input: FC<InputProps> = (props) => {
  return (
    <StyledViewContainer>
      <StyledInput
        placeholder={props.placeholder}
        onChangeText={props.onChangeText}
        secureTextEntry={props.secureTextEntry || false}
      />
    </StyledViewContainer>
  );
};

export default Input;
