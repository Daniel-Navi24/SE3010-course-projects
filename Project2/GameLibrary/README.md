# GameLibrary

## Description
GameLibrary is a mobile application built with React Native and Expo that allows users to catalog their physical and digital video game collection. Users can add games by photographing their physical covers, set their current playing status (Owned, Wishlist, Playing, Completed), rate them out of 5 stars, and store personal notes. The app features local persistence and a dynamic theming system.

## Wireframes
*(Note to self: Take pictures of my hand-drawn wireframes and put them in an `assets/wireframes/` folder, then link them here)*
- [Wireframe 1: Collection View]
- [Wireframe 2: Add/Edit Game]
- [Wireframe 3: Settings]

## Human Interface Guidelines (HIG) & Material Design Implementation

In developing GameLibrary, I prioritized the Apple Human Interface Guidelines (HIG) and Material Design principles to ensure a familiar, accessible, and professional user experience. One of the primary ways I achieved this was through the implementation of a robust, dynamic theming system using React Context. By providing six distinct themes (three light, three dark), the app respects system-wide accessibility preferences while maintaining high contrast ratios for text and essential UI elements, adhering to both HIG and Material Design color accessibility standards. This context-driven approach ensures that when a user changes a theme, every component—from the custom headers to the filter chips—updates instantly without the need for prop drilling.

Navigation and layout were designed to feel native on both iOS and Android. Instead of relying on default native navigation headers (which varied significantly between platforms and iOS versions), I built a custom `ScreenHeader` component. This component utilizes `react-native-safe-area-context` to respect the device's notch and status bar, guaranteeing that touch targets (like the back arrow and settings cog) are always easily reachable and visually consistent. Furthermore, standard touch targets were kept to a minimum of 44x44 points, as recommended by the HIG.

Finally, tactile and visual feedback were implemented to create a responsive, premium feel. The app utilizes the device's haptic engine (`expo-haptics`) to provide a subtle physical vibration when a user taps a star to rate a game or successfully saves a game entry. Visually, elements like the star rating and filter chips utilize immediate state changes, while images are handled gracefully with placeholder fallbacks (using MaterialCommunityIcons) if a user chooses not to photograph a game cover. This combination of haptic and visual cues makes the application feel responsive and deeply integrated with the mobile operating system.
