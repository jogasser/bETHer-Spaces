import React, {createContext, ReactElement, useEffect, useState} from 'react';
import LoadingScreen from "../screens/LoadingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = 'bETHerSpacesReviewStorage';

export const RatingContext = createContext({
  ratings: [] as number[],
  addRating: (ratingId: number) => {}
});

type RatingContextProps = {
  children: React.ReactNode;
};

export default function RatingContextProvider(
  { children }: RatingContextProps,
): ReactElement {
  const [ratings, setRatings] = useState<number[]>();

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then(async value => {
        if(value != null) {
          setRatings(JSON.parse(value))
        } else {
          setRatings([]);
        }
      })
  }, [STORAGE_KEY])

  const addRating = async (r: number) => {
    const newReviews = ratings?.concat([r]) || [r]
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newReviews));
    setRatings(newReviews);
  }

  if(ratings == null) {
    return <LoadingScreen />
  } else {
    return (
      <RatingContext.Provider value={{ ratings: ratings, addRating: addRating }}>
        {children}
      </RatingContext.Provider>
    );
  }
}
