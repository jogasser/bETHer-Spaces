import React, {ReactElement, useContext, useEffect, useMemo, useState} from "react";
import {StyleSheet, useWindowDimensions, View} from "react-native";
import {RouteProp, useRoute} from "@react-navigation/core";
import {MainNavigationParamsList} from "../navigation/AppLinking";
import LoadingScreen from "./LoadingScreen";
import {Text, Title} from "react-native-paper";
import {MapContainer, Marker, Polygon, TileLayer} from "react-leaflet";
import {LatLngBounds, LatLngTuple} from "leaflet";
import {useLinkProps} from "@react-navigation/native";
import axios from "axios";
import {Space} from '../data/Space';
import TemperatureChart from "../components/charts/TemperatureChart";
import {OptionsContext} from "../context/OptionsContext";
import {
  getOverallStatusColor,
  getStatus,
  getStatusColor,
  Measurements,
  MeasurementTitles,
  RelevantMeasurements
} from "../data/Measurement";
import {sortMeasurement} from "../props/ChartProps";
import PMChart from "../components/charts/PMChart";
import HumidityChart from "../components/charts/HumidityChart";
import AirQualityChart from "../components/charts/AirQualityChart";
import RatingList from "../components/RatingList";
import NoiseChart from "../components/charts/NoiseChart";

export default function SpaceScreen(): ReactElement {
  const { height } = useWindowDimensions();
  const { preferredEnvironment } = useContext(OptionsContext);
  const spaceId  = useRoute<RouteProp<MainNavigationParamsList, 'Space'>>().params.spaceId;
  const [space, setSpace] = useState<Space>();
  useEffect(() => {
    axios.get<Space>('/spaces/' + spaceId + '?populate=%2A' )
      .then(response => setSpace(response.data))
  }, [spaceId]);

  const styles = StyleSheet.create({
    wrapper: {
      flexDirection: 'row',
      flexWrap: 'wrap'
    },
    column: {
      flexBasis: 400,
      padding: 20,
      minHeight: height > 800 ? height / 2 : 400,
      flex: 1,
    },
    measurement: {
      flexDirection: 'row',
      marginTop: 10,
    },
    dataPoint: {
      fontWeight: 'bold',
    }
  })

  const location: LatLngTuple = useMemo(() => {
    if(space != null && space.polygons != null && space.polygons.length > 0) {
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


  function roundValue(num: number): string {
    return (Math.round(num * 100) / 100).toFixed(2);
  }


  const linkingProps = useLinkProps({to: {screen: 'CreateRating', params: {spaceId: spaceId}}})

  if(space == null) {
    return <LoadingScreen />
  } else {
    const lastMeasurement = space.measurements != null && space.measurements.length > 0 ? space.measurements[space.measurements.length - 1] : null;
    const measurementView = lastMeasurement != null ?
      <View>
        {RelevantMeasurements.map(m =>
          <View style={[styles.measurement, {width: 200, justifyContent: 'space-between'}]}>
            <Text>{MeasurementTitles[m]}: </Text>
            <Text style={[styles.dataPoint, {color: getStatusColor(getStatus(lastMeasurement, preferredEnvironment, m))}]}>
              {roundValue(lastMeasurement[m])}
            </Text>
          </View>
        )}
      </View> :
      <Text>There are no measurements for this Space</Text>

    const bounds = new LatLngBounds(
      [location[0] - 0.0005, location[1] - 0.0005],
      [location[0] + 0.0005, location[1] + 0.0005],
    );

    let measurements: Measurements[];
    if(space.measurements == null) {
      measurements = [];
    } else {
      if(space.measurements.length > 10) {
        measurements = sortMeasurement(space.measurements.slice(space.measurements?.length - 11, space.measurements?.length))
      } else {
        measurements = sortMeasurement(space.measurements)
      }
    }

    return (
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center', paddingLeft: 20, paddingTop: 20}}>
          <Title>{space.name}</Title>
          <Text {...linkingProps} style={{marginLeft: 20}}> Rate this space </Text>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.column}>
            <MapContainer
              style={{height: 300, flex: 1}}
              center={location}
              bounds={bounds}
              scrollWheelZoom
              dragging
            >
              <TileLayer
                attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
                url={`https://osm.ideal-sharing.ch/tile/{z}/{x}/{y}.png`}
              />
              <Marker position={location}/>
              <Polygon positions={space.polygons.map(value => [value.lat, value.lon])}
                       color={lastMeasurement ? getOverallStatusColor(lastMeasurement, preferredEnvironment) : 'blue'} />
            </MapContainer>
          </View>
          <View style={styles.column}>
            <Title>Last Measurements: </Title>
            {measurementView}
          </View>
          <View style={styles.column}>
            <Title>Ratings </Title>
            <RatingList spaceId={spaceId} />
          </View>
        </View>
        <View style={styles.wrapper}>
          <View style={styles.column}>
            <Title>Temperature</Title>
            <TemperatureChart measurements={measurements} />
          </View>
          <View style={styles.column}>
            <Title>Humidity</Title>
            <HumidityChart measurements={measurements} />
          </View>
          <View style={styles.column}>
            <Title>Air Quality</Title>
            <AirQualityChart measurements={measurements} />
          </View>
          <View style={styles.column}>
            <Title>Particulate Matter</Title>
            <PMChart measurements={measurements} />
          </View>
          <View style={styles.column}>
            <Title>Noise Level</Title>
            <NoiseChart measurements={measurements} />
          </View>
        </View>
      </View>
    )
  }
}