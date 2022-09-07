import {ReactElement, useState} from "react";
import {StyleSheet, View} from "react-native";
import InteractiveMap from "../components/map/InteractiveMap";
import MockSpaces from "../data/MockSpaces";
import {Title} from "react-native-paper";

export default function MapScreen(): ReactElement {
  const [data] = useState(MockSpaces);
  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      flexDirection: 'row',
    }
  })

  return (
    <View>
      <InteractiveMap lon={8.548276} lat={47.376623} data={data} />
      <View>
        {data.map(value =>
          <View>
            <Title>{value.name}</Title>
          </View>
        )}
      </View>
    </View>
  )
}