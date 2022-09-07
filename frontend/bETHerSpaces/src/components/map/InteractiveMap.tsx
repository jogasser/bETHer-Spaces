import React, { ReactElement } from 'react';
import { TileLayer, MapContainer } from 'react-leaflet';
import { withTheme } from 'react-native-paper';
import { LatLngBounds } from 'leaflet';
import {StyleProp, StyleSheet, View, ViewStyle} from 'react-native';
import {Space} from "../../data/MockSpaces";
import SpaceMarker from "./SpaceMarker";

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
function InteractiveMap({lon, lat, data, selectedSpaceId, style, setSelectedSpaceId}: CustomMapViewProps): ReactElement {
  const styles = StyleSheet.create({
    wrapper: {
      height: 900,
      paddingBottom: 20,
      paddingTop: 20,
    }
  });

  // Needs to be of type React.CSSProperties since Leaflet map is a React type and not React Native
  const mapStyle : React.CSSProperties = {
    height: 800,
    minHeight: 800, // Needed since otherwise the map doesn't render correctly when hidden
  };

  const bounds : LatLngBounds = new LatLngBounds(
    [lat - 0.001, lon - 0.001],
    [lat + 0.001, lon + 0.001],
  );

  return (
    <View style={[styles.wrapper, style]}>
      <MapContainer
        style={mapStyle}
        center={{ lat, lng: lon }}
        bounds={bounds}
        scrollWheelZoom
        dragging
      >
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url={`https://osm.ideal-sharing.ch/tile/{z}/{x}/{y}.png`}
        />
        { data.map(value =>
          <SpaceMarker key={value.id} space={value} open={selectedSpaceId === value.id} callback={setSelectedSpaceId}/>
        )}
      </MapContainer>
    </View>
  );
}

export default withTheme(InteractiveMap);
