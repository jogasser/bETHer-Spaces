import {ReactElement, useEffect, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import InteractiveMap from "../components/map/InteractiveMap";
import MockSpaces, {Space} from "../data/MockSpaces";
import {Divider, Title} from "react-native-paper";
import {theme} from "../config/theme";
import {RouteProp, useRoute} from "@react-navigation/core";
import {MainNavigationParamsList} from "../navigation/AppLinking";
import axios from "axios";
import {Rating} from "react-native-ratings";

export default function MapScreen(): ReactElement {
  const { params } = useRoute<RouteProp<MainNavigationParamsList, 'Map'>>();
  const [data, setData] = useState(MockSpaces);
  const [selectedSpaceId, setSelectedSpaceId] = useState<number>();

  useEffect(() => {
    axios.get<Space[]>('https://bether.tenderribs.cc/api/buildings')
      .then(response => {
        if(response.data != null && response.data.length > 0) {
          setData(response.data);
        }
      })
      .catch(() => {
        console.error("Api Connection Failed")
      })
  })

  useEffect(() => {
    setSelectedSpaceId(params.spaceId)
  }, [params]);

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
      paddingTop: 20
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
    <View style={styles.wrapper}>
      <InteractiveMap lon={8.548276} lat={47.376623}
                      data={data}
                      style={styles.map}
                      selectedSpaceId={selectedSpaceId}
                      setSelectedSpaceId={setSelectedSpaceId}
      />
      <View style={styles.placesWrapper}>
        <Divider />
        {data.map(value =>
          <View>
            <TouchableOpacity key={value.id} style={[styles.place, selectedSpaceId === value.id && styles.selectedPlace]}
                              onPress={() => setSelectedSpaceId(value.id)}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <Title>{value.name}</Title>
                <Rating readonly showRating={false} showReadOnlyText={false} startingValue={value.rating} imageSize={20} />
              </View>
            </TouchableOpacity>
            <Divider />
          </View>
        )}
      </View>
    </View>
  )
}