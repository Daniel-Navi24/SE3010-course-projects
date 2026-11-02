# RetroVault

RetroVault is a React Native app built with Expo that lets users browse video games by genre using the RAWG Video Games API. Users can explore 6 curated genres (Action, RPG, Adventure, Shooter, Strategy, Puzzle), view a collection of games per genre, and tap into a detailed view showing cover art, descriptions, and screenshots.

## API Usage

This app uses two distinct calls to the [RAWG Video Games API](https://rawg.io/apidocs):

1. **`GET /games?genres={id}`** — Returns a collection of games filtered by genre.
2. **`GET /games/{id}`** — Returns full details (description, screenshots, platforms) for a single game.

Both calls use `fetch` from React Native, return JSON, and include loading states via `<ActivityIndicator>`.

## Human Interface Guidelines Implementation

RetroVault was designed with Apple's Human Interface Guidelines in mind, focusing heavily on seamless navigation and visual clarity. Because the app is entirely built around API data retrieval, providing clear feedback during loading states was a priority. Instead of leaving the screen blank while the RAWG API fetches data, I used native `ActivityIndicator` spinners (styled white on a dark background) to ensure the user knows the app is working. Furthermore, the custom `ScreenHeader` component utilizes `react-native-safe-area-context` to ensure that the back arrow and title never conflict with the iPhone's notch or dynamic island, keeping touch targets exactly where users expect them.

The layout and hierarchy of the app mimic native iOS list-to-detail navigation. The dark theme (black background, dark gray cards) provides high contrast against the game cover art, making the images pop without straining the user's eyes. The transition from the genre grid to the vertical game list, and finally to a rich, scrollable detail screen, follows standard mobile architecture. Large, easily tappable areas (the genre cards and game rows) ensure users don't miss the small touch targets of a mobile screen. Finally, horizontal scrolling for screenshots was implemented to avoid disrupting the vertical flow of text and to give the user an intuitive "swipe to see more" interaction.

Loading indicators, screen transitions, and touch target sizing all reflect common HIG patterns, and the app's dark theme respects the reduced eye strain that iOS users often expect from media-focused apps.
