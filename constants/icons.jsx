import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import AntDesign from "@expo/vector-icons/AntDesign";

export const icon = {
  home: (props) => <AntDesign name="calculator" {...props} />,
  energy_distribution: (props) => (
    <MaterialCommunityIcons name="home-lightning-bolt-outline" {...props} />
  ),
  devices: (props) => <MaterialIcons name="devices-other" {...props} />,
  profile: (props) => <FontAwesome5 name="user" {...props} />,
};
