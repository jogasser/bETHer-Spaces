import {ReactElement, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import InteractiveMap from "../components/map/InteractiveMap";
import MockSpaces from "../data/MockSpaces";
import {Title} from "react-native-paper";
import {theme} from "../config/theme";

export default function MapScreen(): ReactElement {
  const [data] = useState(MockSpaces);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number>();

  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      flexDirection: 'row',
    },
    map: {
      flexBasis: 900,
      flexGrow: 1
    },
    placesWrapper: {
      flexBasis: 350,
      flexGrow: 0.1,
      borderColor: theme.colors.onSurface,
      backgroundColor: theme.colors.surface,
      borderBottomWidth: 1,
    },
    place: {
      paddingLeft: 20,
      borderColor: theme.colors.onSurface,
      backgroundColor: theme.colors.surface,
      borderTopWidth: 1,
      borderBottomWidth: 1,
      paddingVertical: 10,
    },
    selectedPlace: {
      backgroundColor: theme.colors.primary + '33'
    }
  })

  return (
    <View style={styles.wrapper}>
      <InteractiveMap lon={8.548276} lat={47.376623}
                      data={data}
                      style={styles.map}
                      selectedSpaceId={selectedSpaceId}
                      setSelectedSpaceId={setSelectedSpaceId}
      />
      <View style={styles.placesWrapper}>
        {data.map(value =>
          <TouchableOpacity style={[styles.place, selectedSpaceId === value.id && styles.selectedPlace]}
                            onPress={() => setSelectedSpaceId(value.id)}>
            <Title>{value.name}</Title>
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}