import { ReactElement } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions, View, Image } from "react-native";
import { Divider, Text } from "react-native-paper";
import { Rating } from "react-native-ratings";
import { Space } from "../../data/Space";
import { theme } from "../../config/theme"

interface StaticMenuProps {
  selectedSpaceId?: number;
  data: Space[];
  setSelectedSpaceId: (v: number) => void;
}

export default function StaticMenu({ data, selectedSpaceId, setSelectedSpaceId }: StaticMenuProps): ReactElement {
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
    },
    spaceBox: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    details: {
      flex: 1,
      flexDirection: 'column',
      alignItems: 'flex-start',
      justifyContent: 'center',

      marginLeft: '30'
    },
    img: { height: 80, aspectRatio: 16 / 9, marginRight: 20 },
    name: {
      fontSize: 16,
      color: '#333',
      marginBottom: '8px'
    },
    readouts: {
      flex: 1,
      marginTop: '20px',
      width: '100%',
      flexDirection: 'row',
      justifyContent: 'flex-start'
    },
    readout: {
      fontSize: 14,
      marginRight: '20px',
      color: '#777'
    }
  })

  function roundValue(num: number): number {
    return Math.round(num * 100) / 100
  }

  return (
    <ScrollView style={styles.placesWrapper}>
      <Divider />
      {data.map(value =>
        <View key={value.id}>
          <TouchableOpacity style={[styles.place, selectedSpaceId === value.id && styles.selectedPlace]}
            onPress={() => setSelectedSpaceId(value.id)}>
            <View style={styles.spaceBox}>

              <Image source={{ uri: value.img?.url ? 'https://bether.tenderribs.cc' + value.img.url : 'https://bether.tenderribs.cc/uploads/HCI_J_8_2ae613ed23.jpg' }}
                style={styles.img} />
              <View style={styles.details}>

                <Text style={styles.name}>{value.name}</Text>

                {value.rating != null ?
                  <Rating readonly
                    showRating={false}
                    showReadOnlyText={false}
                    style={{}}
                    startingValue={value.rating}
                    imageSize={20} /> :
                  <Text>Noch keine Bewertungen</Text>}
                {value.measurements != null && value.measurements[value.measurements.length - 1] != null ?
                  <View style={styles.readouts}>
                    <Text style={styles.readout}>{value?.measurements ? roundValue(value.measurements[value.measurements.length - 1].temperature) : 24} °C</Text>
                    <Text style={styles.readout}>{value?.measurements ? roundValue(value.measurements[value.measurements.length - 1].light) : 24} Lux</Text>
                  </View> :
                  <View style={styles.readouts}>
                    <Text style={styles.readout}>No data available</Text>
                  </View>
                }
              </View>
            </View>
          </TouchableOpacity>
          <Divider />
        </View>
      )}
    </ScrollView>
  );
}