import {ReactElement, useContext, useEffect, useState} from "react";
import {View} from "react-native";
import {Text, Title} from "react-native-paper";
import {RatingContext} from "../context/ReviewContext";
import axios from "axios";
import LoadingScreen from "./LoadingScreen";
import {Rating} from "react-native-ratings";
import {Rating as RatingData} from "../data/Rating";

export default function ReviewScreens(): ReactElement {
  const { ratings } = useContext(RatingContext);
  const [ ratingData, setRatingData] = useState<RatingData[]>();

  useEffect(() => {
    axios.get<RatingData[]>('/ratings')
      .then(response => setRatingData(response.data.filter(r => ratings.find(id => id === r.id) != null)));
  }, [ratings])

  if(ratingData == null) {
    return <LoadingScreen />
  } else {
    return (
      <View>
        <Title>Your Reviews</Title>
        {ratingData.map(rating => {
          const overallRating = rating.accessibility + rating.cleanness + rating.cosiness / 3;
          return (
            <View key={rating.id.toString()} style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Title>{rating.space?.name}</Title>
              <Rating showRating={false} showReadOnlyText={false} readonly={true} startingValue={overallRating} />
              <Text>{ rating.comment }</Text>
            </View>
          )
        })}
      </View>
    )
  }
}