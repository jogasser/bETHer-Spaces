import {ReactElement} from "react";
import {ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View} from "react-native";
import {Divider, Text, Title} from "react-native-paper";
import {Rating} from "react-native-ratings";
import {Space} from "../../data/Space";
import {theme} from "../../config/theme";

interface StaticMenuProps {
  selectedSpaceId?: number;
  data: Space[];
  setSelectedSpaceId: (v: number) => void;
}

export default function StaticMenu({data, selectedSpaceId, setSelectedSpaceId}: StaticMenuProps): ReactElement {
  const { height } = useWindowDimensions();
  const styles = StyleSheet.create({
    placesWrapper: {
      height: height - 64,
      overflow: 'hidden',
      flexBasis: 350,
      flexGrow: 0.1,
    },
    place: {
      paddingHorizontal: 20,
      paddingVertical: 10,
      backgroundColor: theme.colors.surface
    },
    selectedPlace: {
      backgroundColor: theme.colors.primary + '33'
    }
  })

  return (
    <ScrollView style={styles.placesWrapper}>
      <Divider />
      {data.map(value =>
        <View key={value.id}>
          <TouchableOpacity style={[styles.place, selectedSpaceId === value.id && styles.selectedPlace]}
                            onPress={() => setSelectedSpaceId(value.id)}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <Title>{value.name}</Title>
              {value.rating != null ?
                <Rating readonly
                        showRating={false}
                        showReadOnlyText={false}
                        style={{}}
                        startingValue={value.rating}
                        imageSize={20} /> :
                <Text>Noch keine Bewertungen</Text> }
            </View>
          </TouchableOpacity>
          <Divider />
        </View>
      )}
    </ScrollView>
  );
}