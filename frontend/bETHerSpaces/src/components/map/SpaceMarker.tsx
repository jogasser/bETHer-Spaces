import React, {ReactElement, useEffect, useRef} from 'react';
import {Polygon, Popup, useMapEvent} from 'react-leaflet';
import {Text, Title, withTheme} from 'react-native-paper';
import {View} from 'react-native';
import {Space} from "../../data/MockSpaces";
import {Rating} from "react-native-ratings";

export interface SpaceMarkerProps {
  space: Space
  theme: ReactNativePaper.Theme
  open: boolean
  callback: (id: number) => void
}

function SpaceMarker({space, theme, open, callback}: SpaceMarkerProps): ReactElement {
  const ref = useRef(null);

  const environmentalData = space.environmentalData &&
    <View>
        <Text> Temperatur: {space.environmentalData?.temperature }</Text>
        <Text> Noise: {space.environmentalData?.noise }</Text>
    </View>;

  useEffect(() => {
    if(open && ref != null && ref.current != null) {
      // @ts-expect-error Don't want to type the ref :)
      ref.current.openPopup();
    }
  }, [ref, open])

  return (
    <View>
      <Polygon
        positions={space.polygon}
        color={theme.colors.primary}
        eventHandlers={{
          click: () => callback(space.id),
        }}
        ref={ref}
        fill
      >
        <Popup>
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
