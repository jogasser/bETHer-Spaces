# Frontend

The frontend is developed in React Native. We chose this framework to reach as many platforms as possible, as it allows to publish the app as a web page as well as a mobile app.
Even tho we did not currently implemented it as a mobile app, this could easily be done by replacing all components that have no native integration (e.g the map).

## Prerequisites 

Required Node version: v16.20.0

Before the first run, run the following command in frontend/bETHerSpaces/

```
npm install
```

## Starting the project

Run: 

```
npm start
```

After expo has loaded, press 'w' to start the webserver. The webapp should now be accessible on http://localhost:19006/

Unfortunately we did not have the time to test the mobile app, why it probably won't work.

## Available Features

The main feature of the app is the interacive map. It allows users to find spaces matching their preferences.

### Interactive Map
The interactive Map is the landing page of the webapp. It features a list of available spaces on the right and a Map containing all spaces.
By pressing on a space in the list or the map, a popup opens with some information about the space.

By pressing on the name of the space in the popup, the dedicated page to the space opens. It contains more detailed informations like charts, the last measurements and reviews.

### Adding Spaces
By clicking on `Add a Space` in the menu or navigating to http://localhost:19006/spaces/new, new spaces can be created.
To do this, a user has to insert a name, the number of available seats and create a polygon in the map by clicking on it to add the corners of the polygon.
Once the data is complete, the `Save` Button can be pressed to save the space into the database. 
After a reload, it should appear in the list of available spaces.

### Reviewing Spaces
On the dedicated Space page next to the title is a link to review the space.
A user can rate the space by evaluating different metrics like accessibility, cosiness and the cleanness of the space.
Lastly a comment can be added to the review.
After rating the space, the rating should appear on the 'My Reviews' as well as the dedicated space page.

