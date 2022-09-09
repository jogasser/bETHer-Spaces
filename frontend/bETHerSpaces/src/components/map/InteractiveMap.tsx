import React, { ReactElement } from 'react';
import { withTheme } from 'react-native-paper';
import { LatLngBounds } from 'leaflet';
import { StyleProp, ViewStyle } from 'react-native';
import SpaceMarker from "./SpaceMarker";
import { Space } from "../../data/Space";
import CustomMapContainer from "./CustomMapContainer";

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
  // Needs to be of type React.CSSProperties since Leaflet map is a React type and not React Native
  const mapStyle: React.CSSProperties = {
    height: '100%',
    zIndex: -1
  };

  const bounds = new LatLngBounds(
    [lat - 0.001, lon - 0.001],
    [lat + 0.001, lon + 0.001],
  );

  return (
    <CustomMapContainer
      style={style}
      mapStyle={mapStyle}
      bounds={bounds}
      lat={lat}
      lon={lon}
    >
      {data.map(value => <SpaceMarker key={value.id} space={value} open={selectedSpaceId === value.id} callback={setSelectedSpaceId} />
      )}
    </CustomMapContainer>
  );
}

export default withTheme(InteractiveMap);
