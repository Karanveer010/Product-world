import React, { useEffect } from "react";
import { StyleSheet, Text, View, ImageBackground } from "react-native";
import { useDispatch } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import ScreenWrapper from "../components/ScreenWrapper";
import { completeOnboarding } from "../redux/slices/furnitureSlice";
import Button from "../components/Button";
import COLORS from "../constants/colors";
import IMAGE_MAP from "../constants/images";
import { wp, hp } from "../utils/responsive";

export const IntroScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation<any>();

  const handleGetStarted = () => {
    dispatch(completeOnboarding());
    navigation.replace("MainApp");
  };

  return (
    <ImageBackground
      source={IMAGE_MAP.intro_bg}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <ScreenWrapper backgroundColor="transparent">
        <View style={styles.container}>
          <View style={styles.textContainer}>
            <Text style={styles.title}>
              Feel your personal{"\n"}
              expression by choosing{"\n"}
              the latest design of{"\n"}
              furniture
            </Text>
          </View>

          <View style={styles.buttonContainer}>
            <Button
              title="Get Started"
              onPress={handleGetStarted}
              style={styles.button}
              textStyle={styles.buttonText}
            />
          </View>
        </View>
      </ScreenWrapper>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "space-between",
    paddingHorizontal: wp(7),
  },
  textContainer: {
    marginTop: hp(9),
  },
  title: {
    fontSize: 27,
    fontWeight: "500",
    color: COLORS.black,
  },
  buttonContainer: {
    marginBottom: hp(9),
    alignItems: "center",
    width: "100%",
  },
  button: {
    backgroundColor: COLORS.olive,
    width: wp(42),
    height: hp(5.8),
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "400",
    color: COLORS.black,
  },
});

export default IntroScreen;
