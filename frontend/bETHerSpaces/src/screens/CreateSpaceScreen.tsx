import React, {ReactElement, useState} from "react";
import {StyleSheet, TouchableOpacity, View} from "react-native";
import {Button, Subheading, Text, TextInput, Title, withTheme} from "react-native-paper";
import {LatLngBounds, LatLngTuple, LeafletMouseEvent} from "leaflet";
import {MapContainer, Polygon, TileLayer, useMapEvent} from "react-leaflet";
import {ReactNativePaperProps} from "../props/ReactNativePaperProps";
import axios from "axios";
import {Ionicons} from "@expo/vector-icons";

interface ClickHandlerProps {
  callback: (e: LeafletMouseEvent) => void
}

function ClickHandler({ callback } : ClickHandlerProps): ReactElement {
  useMapEvent('click', callback);
  return <View />;
}

function CreateSpaceScreen({ theme }: ReactNativePaperProps): ReactElement {
  const [name, setName] = useState('');
  const [seats, setSeats] = useState('');
  const [polygon, setPolygon] = useState<LatLngTuple[]>([]);

  const lat = 47.376623;
  const lon = 8.548276
  const mapBounds = new LatLngBounds(
    [lat - 0.0005, lon - 0.0005],
    [lat + 0.0005, lon + 0.0005],
  );

  const reset = () => setPolygon([]);
  const revert = () => setPolygon(p => p.splice(0, p.length - 1));

  const createSpace = () => {
    if(name.match(/^\s*$/) != null) {
      return
    }

    if(seats.match(/^\s*$/) != null || seats.match(/\D/) != null) {
      return
    }

    if(polygon.length < 3) {
      return
    }

    const polygons = polygon.map(
      (value) => {
        return {lat: value[0], lon: value[1]}
      })
    axios.post('/spaces', {name: name, seats: seats, polygons: polygons})
      .then(response => {console.log(response.data)});
  }

  return (
    <View style={{padding: 20, paddingBottom: 0, height: '100%'}}>
      <Title>Create a new Space</Title>
        <Subheading>Name: </Subheading>
        <TextInput style={{height: 30}} mode={'flat'} value={name} onChangeText={setName}/>
        <Subheading>Seats: </Subheading>
        <TextInput style={{height: 30}} mode={'flat'} value={seats} onChangeText={(val) => setSeats(val.replace(/\D/g, ''))}/>
        <Subheading>Location: </Subheading>

        <View style={{flexDirection: 'row'}}>
          <Button onPress={reset} mode={'outlined'} style={{marginBottom: 20, marginRight: 20}}>
            <Ionicons name={'refresh-outline'} color={theme.colors.text} size={25} />
            <Text>Reset</Text>
          </Button>
          <Button onPress={revert} mode={'outlined'} style={{marginBottom: 20, marginRight: 20}}>
            <Ionicons name={'arrow-undo-outline'} color={theme.colors.text} size={25} />
            <Text>Undo</Text>
          </Button>
        </View>

        <MapContainer
          style={{flex: 1}}
          center={{ lat: lat, lng:  lon}}
          bounds={mapBounds}
          scrollWheelZoom
          dragging
        >
          <TileLayer
            attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
            url={`https://osm.ideal-sharing.ch/tile/{z}/{x}/{y}.png`}
          />
          <ClickHandler callback={(e) => setPolygon(polygon.concat([[e.latlng.lat, e.latlng.lng]]))} />
          <Polygon
            positions={polygon}
            color={theme.colors.primary}
            fill>

          </Polygon>
        </MapContainer>
    </View>
  )
}

export default withTheme(CreateSpaceScreen)