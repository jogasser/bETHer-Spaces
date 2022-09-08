import React, {ReactElement, useEffect, useRef} from 'react';
import {Polygon, Popup} from 'react-leaflet';
import {Text, Title, withTheme} from 'react-native-paper';
import {useWindowDimensions, View} from 'react-native';
import {Space} from "../../data/Space";
import {Rating} from "react-native-ratings";

export interface SpaceMarkerProps {
  space: Space
  theme: ReactNativePaper.Theme
  open: boolean
  callback: (id: number) => void
}

function SpaceMarker({space, theme, open, callback}: SpaceMarkerProps): ReactElement {
  const ref = useRef(null);
  const { width, height } = useWindowDimensions();
  const environmentalData = space.measurements &&
    <View>
        <Text> Temperatur: {space.measurements?.temperature }</Text>
    </View>;

  useEffect(() => {
    if(open && ref != null && ref.current != null) {
      // @ts-expect-error Don't want to type the ref :)
      ref.current.openPopup();
    }
  }, [ref, open])

  if(space.polygons != null) {
    return (
      <View>
        <Polygon
          positions={space.polygons.map(p => [p.lat, p.lon])}
          color={theme.colors.primary}
          eventHandlers={{
            click: () => callback(space.id),
          }}
          ref={ref}
          fill
        >
          <Popup autoPanPadding={[width / 2 - 50, height / 2 - 50]}>
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
            {environmentalData}
          </Popup>
        </Polygon>

      </View>
    );
  } else {
    return <View />
  }
}

export default withTheme(SpaceMarker);
