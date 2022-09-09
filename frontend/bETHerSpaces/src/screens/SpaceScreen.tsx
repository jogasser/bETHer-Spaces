import React, { ReactElement, useEffect, useMemo, useState } from "react";
import { StyleSheet, useWindowDimensions, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/core";
import { MainNavigationParamsList } from "../navigation/AppLinking";
import LoadingScreen from "./LoadingScreen";
import { Subheading, Text, Title } from "react-native-paper";
import { MapContainer, Marker, Polygon, TileLayer } from "react-leaflet";
import { LatLngBounds, LatLngTuple } from "leaflet";
import { LineChart } from "react-native-chart-kit";
import { useLinkProps } from "@react-navigation/native";
import axios from "axios";
import { Space } from '../data/Space';

function formatDate(date: Date) {
  const copy = new Date(date);

  return copy.getHours() + ':' + copy.getMinutes();
}

export default function SpaceScreen(): ReactElement {
  const { height } = useWindowDimensions();
  const spaceId = useRoute<RouteProp<MainNavigationParamsList, 'Space'>>().params.spaceId;

  const [space, setSpace] = useState<Space>();
  useEffect(() => {
    axios.get<Space>('/spaces/' + spaceId + '?populate=%2A')
      .then(response => setSpace(response.data))
  }, [spaceId]);

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    column: {
      flexBasis: 400,
      paddingLeft: 20,
      paddingRight: 20,
      minHeight: height > 800 ? height / 2 : 400,
      flex: 1,
    },
    title: {
      fontSize: 32,
      marginBottom: 20
    },
    measurements: {
      flex: 1,
      flexDirection: 'column',
    },
    measurement: {
      flex: 1,
      flexDirection: 'row',
      fontSize: 18
    },
    heading: {
      fontSize: 20,
      fontWeight: 'bold',

      marginBottom: 20
    }
  })

  const location: LatLngTuple = useMemo(() => {
    if (space != null && space.polygons != null && space.polygons.length > 0) {
      let lat = 0;
      let lon = 0;
      space.polygons.forEach(val => {
        lat += val.lat;
        lon += val.lon;
      })
      return [lat / space.polygons.length, lon / space.polygons.length]
    } else {
      return [47.376623, 8.548276];
    }
  }, [space]);


  const linkingProps = useLinkProps({ to: { screen: 'CreateRating', params: { spaceId: spaceId } } })

  function roundValue(num: number): number {
    return Math.round(num * 100) / 100
  }

  if (space == null) {
    return <LoadingScreen />
  } else {
    const lastMeasurement = space.measurements != null && space.measurements.length > 0 ?
      <View style={styles.measurements}>
        <View style={styles.measurement}>
          <Text>Temperature: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].temperature)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>Pressure: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].pressure)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>Light level: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].light)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>Humidity: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].humidity)}</Text>
        </View>
        <Subheading style={styles.heading}>Air Quality: </Subheading>
        <View style={styles.measurement}>
          <Text>Oxidation: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].oxidised)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>NH3 Level: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].nh3)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>PM1 Level: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].pm1)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>PM10 Level: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].pm10)}</Text>
        </View>
        <View style={styles.measurement}>
          <Text>PM 25 Level: </Text>
          <Text>{roundValue(space.measurements[space.measurements.length - 1].pm25)}</Text>
        </View>
      </View> :
      <Text>There are no measurements for this Space</Text>

    const bounds = new LatLngBounds(
      [location[0] - 0.0005, location[1] - 0.0005],
      [location[0] + 0.0005, location[1] + 0.0005],
    );

    const measurements = space.measurements?.splice(space.measurements?.length - 11, 10) || [];

    return (
      <View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingLeft: 20, paddingTop: 20 }}>
          <Title style={styles.title}>{space.name}</Title>
          <Text {...linkingProps} style={{ marginRight: 40 }}> Rate this space </Text>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.column}>
            <MapContainer
              style={{ height: 300, flex: 1 }}
              center={location}
              bounds={bounds}
              scrollWheelZoom
              dragging
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url={`https://osm.ideal-sharing.ch/tile/{z}/{x}/{y}.png`}
              />
              <Marker position={location} />
              <Polygon positions={space.polygons.map(value => [value.lat, value.lon])} />
            </MapContainer>
          </View>
          <View style={styles.column}>
            <Subheading style={styles.heading}>Last Measurements: </Subheading>
            {lastMeasurement}
          </View>
          <View style={styles.column}>
            <LineChart
              data={{
                labels: measurements.map(v => formatDate(v.createdAt)),
                datasets: [{ data: measurements.map(v => v.temperature) }]
              }}
              width={400}
              height={400}
              yAxisSuffix="°C"
              chartConfig={{
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16
                },
                propsForDots: {
                  r: "6",
                  strokeWidth: "2",
                  stroke: "#ffa726"
                }
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16
              }}
            />
          </View>
        </View>
      </View>
    )
  }
}