import React, { ReactElement, useState } from 'react';
import {
  TileLayer,
  MapContainer,
  useMap,
  useMapEvents
} from 'react-leaflet';
import { withTheme } from 'react-native-paper';
import { LatLngBounds, LatLng } from 'leaflet';
import { Text, TouchableOpacity, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import SpaceMarker from "./SpaceMarker";
import { Space } from "../../data/Space";

export interface CustomMapViewProps {
  lon: number;
  lat: number;
  data: Space[];
  style?: StyleProp<ViewStyle>
  selectedSpaceId?: number;
  setSelectedSpaceId: (id: number) => void
  theme: ReactNativePaper.Theme
}

/**
 * Map implementation for web
 */
function InteractiveMap({ lon, lat, data, selectedSpaceId, style, setSelectedSpaceId }: CustomMapViewProps): ReactElement {
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
      right: 20,
      top: 20,

      zIndex: 100,

      flex: 1,
      flexDirection: 'row'
    }
  });

  // Needs to be of type React.CSSProperties since Leaflet map is a React type and not React Native
  const mapStyle: React.CSSProperties = {
    height: '100%',
    zIndex: -1
  };

  const bounds = new LatLngBounds(
    [lat - 0.001, lon - 0.001],
    [lat + 0.001, lon + 0.001],
  );

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
        style={mapStyle}
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
        {data.map(value =>
          <SpaceMarker key={value.id} space={value} open={selectedSpaceId === value.id} callback={setSelectedSpaceId} />
        )}
      </MapContainer>
    </View>
  );
}

export default withTheme(InteractiveMap);
