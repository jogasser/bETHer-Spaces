import React, {ReactElement, useState} from 'react';
import {Polygon, Popup} from 'react-leaflet';
import {Text, Title, withTheme} from 'react-native-paper';
import {StyleSheet, View} from 'react-native';
import {Space} from "../../data/MockSpaces";
import {Rating} from "react-native-ratings";

export interface SpaceMarkerProps {
  space: Space
  theme: ReactNativePaper.Theme
}

function SpaceMarker({space, theme}: SpaceMarkerProps): ReactElement {
  const [ active, setActive ] = useState(false);

  const styles = StyleSheet.create({
    infoBox: {
      backgroundColor: theme.colors.surface,
      borderRadius: theme.roundness,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      opacity: active ? 1 : 0,
    }
  })

  const environmentalData = space.environmentalData &&
    <View>
        <Text> Temperatur: {space.environmentalData?.temperature }</Text>
        <Text> Noise: {space.environmentalData?.noise }</Text>
    </View>;

  return (
    <View>
      <Polygon
        positions={space.polygon}
        color={theme.colors.primary}
        fill
      >
        <Popup >
          <Title>{space.name}</Title>
          <Rating
            type='star'
            ratingCount={5}
            readonly={true}
            showReadOnlyText={false}
            startingValue={space.rating}
            imageSize={20}
            showRating
          />
          { environmentalData }
        </Popup>
      </Polygon>

    </View>
  );
}

export default withTheme(SpaceMarker);
