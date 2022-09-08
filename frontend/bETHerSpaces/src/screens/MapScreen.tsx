import {ReactElement, useEffect, useState} from "react";
import {StyleSheet, useWindowDimensions, View} from "react-native";
import InteractiveMap from "../components/map/InteractiveMap";
import {theme} from "../config/theme";
import {RouteProp, useRoute} from "@react-navigation/core";
import {MainNavigationParamsList} from "../navigation/AppLinking";
import axios from "axios";
import {Space} from "../data/Space";
import LoadingScreen from "./LoadingScreen";
import StaticMenu from "../components/menu/StaticMenu";
import AnimatedMenu from "../components/menu/AnimatedMenu";

export default function MapScreen(): ReactElement {
  const { params } = useRoute<RouteProp<MainNavigationParamsList, 'Map'>>();
  const [data, setData] = useState<Space[]>();
  const [selectedSpaceId, setSelectedSpaceId] = useState<number>();
  const { height, width } = useWindowDimensions();

  useEffect(() => {
    axios.get<Space[]>('/spaces')
      .then(response => {
        if(response.data != null && response.data.length > 0) {
          response.data.forEach(s => {
            if(s.rating == null) {
              s.rating = Math.random() * (5 - 2 + 1) + 2;
            }
          })

          setData(response.data);
        }
      })
      .catch(() => {
        console.error("Api Connection Failed")
      })
  }, [])

  useEffect(() => {
    setSelectedSpaceId(params?.spaceId);
  }, [params]);

  const styles = StyleSheet.create({
    wrapper: {
      width: '100%',
      flexDirection: 'row',
    },
    map: {
      height: height - 64,
      flexBasis: width > 1200 ? 900 : width,
      flexGrow: 1
    },
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

  if(data == null) {
    return <LoadingScreen />
  }

  const spaceMenu = width < 1200
    ? <AnimatedMenu selectedSpaceId={selectedSpaceId} data={data} setSelectedSpaceId={setSelectedSpaceId} />
    : <StaticMenu selectedSpaceId={selectedSpaceId} data={data} setSelectedSpaceId={setSelectedSpaceId} />

  return (
      <View style={styles.wrapper}>
        <InteractiveMap lon={8.548276} lat={47.376623}
                        data={data}
                        style={styles.map}
                        selectedSpaceId={selectedSpaceId}
                        setSelectedSpaceId={setSelectedSpaceId}
        />
        { spaceMenu }
      </View>
    )
}