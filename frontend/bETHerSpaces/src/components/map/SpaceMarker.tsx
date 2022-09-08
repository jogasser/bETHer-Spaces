import React, {ReactElement, useEffect, useMemo, useRef} from 'react';
import {Polygon, Popup} from 'react-leaflet';
import {Text, Title, withTheme} from 'react-native-paper';
import {useWindowDimensions, View} from 'react-native';
import {Space} from "../../data/Space";
import {Rating} from "react-native-ratings";
import {LatLngTuple} from "leaflet";
import {useLinkProps} from "@react-navigation/native";

export interface SpaceMarkerProps {
  space: Space
  theme: ReactNativePaper.Theme
  open: boolean
  callback: (id: number) => void
}

function SpaceMarker({space, theme, open, callback}: SpaceMarkerProps): ReactElement {
  const ref = useRef(null);
  const { width, height } = useWindowDimensions();

  const linkingProps = useLinkProps({to: {screen: 'Space', params: {spaceId: space.id}}})

  const measurement = space.measurements != null && space.measurements.length > 0
    ? space.measurements[0]
    : {temperature: 20, pressure: 690, humidity: 53, light: 350, oxidised: 2.3, reduced: 0.1, nh3: 0.1, pm1: 3.2, pm10: 3.4, pm25: 3.5}

  const environmentalData =
    <View>
      <Text>Temperature: {measurement.temperature} °C</Text>
      <Text>Humidity: {measurement.humidity} %</Text>
      <Text>NH3 Level: {measurement.nh3} ppm</Text>
    </View>;

  useEffect(() => {
    if(open && ref != null && ref.current != null) {
      // @ts-expect-error Don't want to type the ref :)
      ref.current.openPopup();
    }
  }, [ref, open])

  const padding = useMemo((): LatLngTuple => [width / 2 - 50, height / 2 - 50], [width, height])

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
          <Popup autoPanPadding={padding} minWidth={150}>
            <Title {...linkingProps}>{space.name}</Title>
            <Rating
              style={{marginVertical: 5}}
              type='star'
              ratingCount={5}
              readonly={true}
              showReadOnlyText={false}
              startingValue={space.rating}
              imageSize={20}
              showRating={false}
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
