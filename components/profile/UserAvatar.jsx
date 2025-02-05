import * as React from "react";
import { Avatar } from "react-native-paper";

function UserAvatar({ size }) {
  return (
    <Avatar.Image
      source={require("../../assets/img/user.png")}
      size={size}
      rounded
      color="grey"
      style={{ margin: 5 }}
    />
  );
}

export default UserAvatar;
