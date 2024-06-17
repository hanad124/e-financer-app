import React from "react";
import { Image, View, Text } from "react-native";
import Onboarding from "react-native-onboarding-swiper";

import image1 from "../assets/onboarding-img-1.svg";
import image2 from "../assets/onboarding-img-2.svg";
import image3 from "../assets/onboarding-img-3.svg";

const OnboardingScreens = ({ navigation }) => {
  return (
    <Onboarding
      onSkip={() => navigation.replace("home")}
      onDone={() => navigation.replace("home")}
      pages={[
        {
          backgroundColor: "#fff",
          image: <Image source={image1} />,
          title: "Welcome to App",
          subtitle: "This is the first onboarding screen",
        },
        {
          backgroundColor: "#fe6e58",
          image: <Image source={image2} />,
          title: "Track your Goals",
          subtitle: "This is the second onboarding screen",
        },
        {
          backgroundColor: "#999",
          image: <Image source={image3} />,
          title: "Achieve Success",
          subtitle: "This is the third onboarding screen",
        },
      ]}
    />
  );
};

export default OnboardingScreens;
