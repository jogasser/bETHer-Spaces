import React, {ReactElement, useContext, useEffect, useMemo, useRef} from 'react';
import {Polygon, Popup} from 'react-leaflet';
import {Text, Title} from 'react-native-paper';
import {StyleSheet, useWindowDimensions, View} from 'react-native';
import {Space} from "../../data/Space";
import {Rating} from "react-native-ratings";
import {LatLngTuple} from "leaflet";
import {useLinkProps} from "@react-navigation/native";
import {OptionsContext} from "../../context/OptionsContext";
import {getOverallStatusColor} from "../../data/Measurement";

export interface SpaceMarkerProps {
  space: Space
  open: boolean
  callback: (id: number) => void
}
const styles = StyleSheet.create({
  popup: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  data_info: {
    marginTop: 10,
  },
  data_point: {
    fontWeight: 'bold',
  }
});

function SpaceMarker({space, open, callback}: SpaceMarkerProps): ReactElement {
  const ref = useRef(null);
  const { preferredEnvironment } = useContext(OptionsContext);
  const { width, height } = useWindowDimensions();

  const linkingProps = useLinkProps({ to: { screen: 'Space', params: { spaceId: space.id } } })

  const measurement = space.measurements != null && space.measurements.length > 0
    ? space.measurements[0]
    : {temperature: 20, pressure: 690, humidity: 53, light: 350, oxidised: 2.3, reduced: 0.1, nh3: 0.1, pm1: 3.2, pm10: 3.4, pm25: 3.5, timestamp: new Date()}

  function roundValue(num: number): number {
    return Math.round(num * 100) / 100
  }

  const environmentalData =
    <View>
      <Text style={styles.data_info}>Temperature: <Text style={styles.data_point}> {roundValue(measurement.temperature)} °C</Text></Text>
      <Text style={styles.data_info}>Humidity: <Text style={styles.data_point}> {roundValue(measurement.humidity)} %</Text></Text>
      <Text style={styles.data_info}>NH3 Level: <Text style={styles.data_point}> {roundValue(measurement.nh3)} ppm</Text></Text>
    </View>;

  useEffect(() => {
    if (open && ref != null && ref.current != null) {
      // @ts-expect-error Don't want to type the ref :)
      ref.current.openPopup();
    }
  }, [ref, open])

  const padding = useMemo((): LatLngTuple => [width / 2 - 50, height / 2 - 50], [width, height])

  if (space.polygons != null) {
    return (
      <View>
        <Polygon
          positions={space.polygons.map(p => [p.lat, p.lon])}
          color={getOverallStatusColor(measurement, preferredEnvironment)}
          eventHandlers={{
            click: () => callback(space.id),
          }}
          ref={ref}
          fill
        >
          <Popup autoPanPadding={padding} minWidth={150}>
            <View style={styles.popup}>
              <Title {...linkingProps}>{space.name}</Title>
              <Rating
                style={{ marginVertical: 5 }}
                type='star'
                ratingCount={5}
                readonly={true}
                showReadOnlyText={false}
                startingValue={space.rating}
                imageSize={20}
                showRating={false}
              />
              {environmentalData}</View>
          </Popup>
        </Polygon>
      </View>
    );
  } else {
    return <View />
  }
}

export default SpaceMarker;
