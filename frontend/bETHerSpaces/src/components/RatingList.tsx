import React, {ReactElement, useEffect, useState} from "react";
import {View} from "react-native";
import axios from "axios";
import {Rating as RatingData} from "../data/Rating";
import Accordion from "./Accordion";
import {Rating} from "react-native-ratings";
import {Text} from "react-native-paper";

interface RatingListProps {
  spaceId: number
}

export default function RatingList({ spaceId }: RatingListProps): ReactElement {
  const [ratings, setRatings] = useState<RatingData[]>();

  useEffect(() => {
    axios.get<RatingData[]>('https://bether.tenderribs.cc/api/ratings')
      .then(response => {
        setRatings(response.data.filter(r => r.space?.id == spaceId))
      })
  }, [spaceId])

  return (
    <View>
      { ratings?.map(rating =>
        <Accordion key={rating.id.toString()}
                   style={{width: '100%', justifyContent: 'space-between'}}

                   title={
          <View style={{flexDirection: 'row', width: '100%', justifyContent: 'space-between'}}>
            <Rating readonly
                    showReadOnlyText={false}
                    imageSize={30}
                    startingValue={(rating.cosiness + rating.accessibility + rating.cleanness) / 3}/>
            <Text>{rating.comment}</Text>
          </View>
                     }>
          <View style={{flexDirection: 'row'}}>
            <Text>Cleanness: </Text>
            <Rating readonly
                    showRating={false}
                    showReadOnlyText={false}
                    imageSize={20}
                    startingValue={rating.cleanness}/>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>Cosiness: </Text>
            <Rating readonly
                    showRating={false}
                    showReadOnlyText={false}
                    imageSize={20}
                    startingValue={rating.cosiness}/>
          </View>
          <View style={{flexDirection: 'row'}}>
            <Text>Accessibility: </Text>
            <Rating readonly
                    showRating={false}
                    showReadOnlyText={false}
                    imageSize={20}
                    startingValue={rating.accessibility}/>
          </View>

        </Accordion>
      )}
    </View>
  )
}