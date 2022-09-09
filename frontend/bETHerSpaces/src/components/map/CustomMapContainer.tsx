import React, {ReactElement, ReactNode, useState} from 'react';
import {
  TileLayer,
  MapContainer,
  useMap,
} from 'react-leaflet';
import { withTheme } from 'react-native-paper';
import { LatLng, LatLngBoundsExpression} from 'leaflet';
import {Text, TouchableOpacity, StyleProp, StyleSheet, View, ViewStyle, useWindowDimensions} from 'react-native';

export interface CustomMapViewProps {
  lon: number;
  lat: number;
  style?: StyleProp<ViewStyle>
  mapStyle?: React.CSSProperties
  children?: ReactNode
  bounds: LatLngBoundsExpression
  theme: ReactNativePaper.Theme
}

/**
 * Map implementation for web
 */
function CustomMapContainer({ lon, lat, style, children, bounds, mapStyle}: CustomMapViewProps): ReactElement {
  const { width } = useWindowDimensions();

  const styles = StyleSheet.create({
    wrapper: {
      height: '100%',
    },
    button: {
      borderRadius: 5,
      color: '#333',
      borderColor: "#ccc",
      backgroundColor: "#fff",
      boxShadow: '0px 0px 8px -4px rgba(0, 0, 0, 0.75)',

      fontSize: 16,
      padding: 8,
      marginLeft: 20
    },
    buttonGroup: {
      position: 'absolute',
      right: width > 1200 ? 20 : width / 2 - 100,
      top: 20,

      zIndex: 100,

      flex: 1,
      flexDirection: 'row'
    }
  });

  function setZentrum(): void {
    setChangedCoords({
      lat: 47.37731,
      lng: 8.54838
    });
  }

  function setHoengg(): void {
    setChangedCoords({
      lat: 47.40855,
      lng: 8.50776
    });
  }

  const [changedCoords, setChangedCoords] = useState({
    lat,
    lng: lon
  });

  interface MapCentreProps {
    mapCentre: LatLng;
  }

  function UpdateMapCentre(props: MapCentreProps) {
    const map = useMap();
    map.panTo(props.mapCentre);
    return null;
  }

  // Needs to be of type React.CSSProperties since Leaflet map is a React type and not React Native
  const joinedMapStyle: React.CSSProperties = {
    ...mapStyle,
    zIndex: -1
  };
  return (
    <View style={[styles.wrapper, style]}>
      <View style={styles.buttonGroup}>
        <TouchableOpacity onPress={setZentrum}>
          <Text style={styles.button}> Zentrum </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.button} onPress={setHoengg}> Hönggerberg </Text>
        </TouchableOpacity>
      </View>
      <MapContainer
        style={joinedMapStyle}
        center={{ lat, lng: lon }}
        bounds={bounds}
        scrollWheelZoom
        dragging
      >
        <UpdateMapCentre mapCentre={changedCoords} />
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url={`https://osm.ideal-sharing.ch/tile/{z}/{x}/{y}.png`}
        />
        { children }
      </MapContainer>
    </View>
  );
}

export default withTheme(CustomMapContainer);
