import React, {ReactElement, useContext, useEffect, useState} from "react";
import {View} from "react-native";
import {Button, Subheading, TextInput, Title, withTheme} from "react-native-paper";
import axios from "axios";
import {Rating} from "react-native-ratings";
import {RouteProp, useRoute} from "@react-navigation/core";
import {MainNavigationParamsList} from "../navigation/AppLinking";
import {RatingContext} from "../context/ReviewContext";
import {Space} from "../data/Space";
import LoadingScreen from "./LoadingScreen";

function CreateRatingScreen(): ReactElement {
  const spaceId  = useRoute<RouteProp<MainNavigationParamsList, 'Space'>>().params.spaceId;
  const [comment, setComment] = useState('');
  const [cosiness, setCoziness] = useState(5);
  const [cleanness, setCleanness] = useState(5);
  const [accessibility, setAccessibility] = useState(5);

  const { addRating } = useContext(RatingContext);

  const createReview = () => {
    axios.post('/ratings', {
      data: {
        space: Number(spaceId),
        cleanness: cleanness,
        cosiness: cosiness,
        accessibility: accessibility,
        comment: comment
      }
    })
      .then(response => {
        addRating(response.data.data.id);
      });
  }
  const [space, setSpace] = useState<Space>();
  useEffect(() => {
    axios.get<Space>('/spaces/' + spaceId + '?populate=%2A' )
      .then(response => setSpace(response.data))
  }, [spaceId]);

  if(space == null) {
    return <LoadingScreen />
  } else {
    return (
      <View style={{height: '100%'}}>
        <Title>Review Space {space.name} </Title>
        <Subheading>Accessibility: </Subheading>
        <Rating startingValue={accessibility} jumpValue={0.5} onFinishRating={(rating: number) => {
          setAccessibility(rating)
        }}/>
        <Subheading>Cleanness: </Subheading>
        <Rating startingValue={cleanness} jumpValue={0.5} onFinishRating={(rating: number) => {
          setCleanness(rating)
        }}/>
        <Subheading>Coziness: </Subheading>
        <Rating startingValue={cosiness} jumpValue={0.5} onFinishRating={(rating: number) => {
          setCoziness(rating)
        }}/>

        <Subheading>Comment: </Subheading>
        <TextInput mode={'flat'} value={comment} onChangeText={setComment}/>
        <Button mode='contained' onPress={createReview}>Rate</Button>
      </View>
    )
  }
}

export default withTheme(CreateRatingScreen)