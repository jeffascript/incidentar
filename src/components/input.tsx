import React, { FC, useEffect } from "react";
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
  padding: ${({ textarea }) => (textarea ? "10px" : "15px")};
`;

const StyledTextArea = styled(TextInput)`
  height: 150px;
  justify-content: flex-start;
  padding: 10px;
`;

export interface InputProps {
  placeholder: string;
  onChangeText: (text: string) => void;
  secureTextEntry?: boolean;
  textarea?: boolean;
  value?: string;
}

const Input: FC<InputProps> = (props) => {
  // let AddTodo = ({ dispatch }) => {
  //   const todoInput = useRef();
  //   useEffect(()=>todoInput.current.clear(),[todoText]);

  return (
    <StyledViewContainer>
      {props.textarea ? (
        <StyledTextArea
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          secureTextEntry={props.secureTextEntry || false}
          multiline={true}
          //   numberOfLines={"10"}
          textAlignVertical="top"
          value={props.value}
        />
      ) : (
        <StyledInput
          placeholder={props.placeholder}
          onChangeText={props.onChangeText}
          secureTextEntry={props.secureTextEntry || false}
        />
      )}
    </StyledViewContainer>
  );
};

export default Input;
