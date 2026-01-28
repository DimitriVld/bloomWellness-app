import AnimatedDot from "@/components/AnimatedDot";
import { ONBOARDING_KEY } from "@/constants/global";
import { colors } from "@/style/colors";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import onboardingStyles from "./styles";

const { width } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    image: require("@/assets/images/Bw-icon.png"),
    title: "Bienvenue sur",
    highlight: "Bloom Wellness",
    description: "Votre compagnon pour une vie plus saine et équilibrée",
  },
  {
    id: "2",
    icon: "🔥",
    title: "Suivez vos",
    highlight: "Calories",
    description:
      "Atteignez vos objectifs grâce à un suivi simple et précis de votre alimentation",
  },
  {
    id: "3",
    icon: "🍳",
    title: "Découvrez des",
    highlight: "Recettes",
    description:
      "Des idées de repas sains et délicieux adaptés à vos besoins",
  },
  {
    id: "4",
    icon: "✨",
    title: "Conseils",
    highlight: "Personnalisés",
    description:
      "Une IA bienveillante pour vous accompagner dans votre parcours bien-être",
  },
];

type SlideItem = (typeof slides)[number];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const isLastSlide = currentIndex === slides.length - 1;

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / width);
    setCurrentIndex(slideIndex);
  };

  const goToNextSlide = () => {
    if (isLastSlide) {
      completeOnboarding();
    } else {
      flatListRef.current?.scrollToIndex({
        index: currentIndex + 1,
        animated: true,
      });
    }
  };

  const skipOnboarding = () => {
    completeOnboarding();
  };

  const completeOnboarding = async () => {
    try {
      await AsyncStorage.setItem(ONBOARDING_KEY, "true");
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Erreur sauvegarde onboarding:", error);
      router.replace("/(auth)/login");
    }
  };

  const renderSlide = ({ item }: { item: SlideItem }) => (
    <View style={onboardingStyles.slide}>
      <View style={onboardingStyles.imageContainer}>
        {item.image ? (
          <View style={onboardingStyles.iconContainer}>
            <Image source={item.image} style={onboardingStyles.logo} resizeMode="contain" />
          </View>
        ) : (
          <View style={onboardingStyles.iconContainer}>
            <Text style={onboardingStyles.icon}>{item.icon}</Text>
          </View>
        )}
      </View>
      <View style={onboardingStyles.textContainer}>
        <Text style={onboardingStyles.title}>{item.title}</Text>
        <Text style={onboardingStyles.highlight}>{item.highlight}</Text>
        <Text style={onboardingStyles.description}>{item.description}</Text>
      </View>
    </View>
  );

  return (
    <View style={onboardingStyles.container}>
      {!isLastSlide && (
        <TouchableOpacity style={onboardingStyles.skipButton} onPress={skipOnboarding}>
          <Text style={onboardingStyles.skipText}>Passer</Text>
        </TouchableOpacity>
      )}

      <FlatList
        ref={flatListRef}
        data={slides}
        renderItem={renderSlide}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />

      <View style={onboardingStyles.bottomContainer}>
        <View style={onboardingStyles.dotsContainer}>
          {slides.map((_, index) => (
            <AnimatedDot
              key={index}
              isActive={currentIndex === index}
              activeColor={colors.primary}
              inactiveColor="rgba(255, 255, 255, 0.3)"
            />
          ))}
        </View>

        <TouchableOpacity
          style={[onboardingStyles.button, isLastSlide && onboardingStyles.buttonLast]}
          onPress={goToNextSlide}
          activeOpacity={0.8}
        >
          <Text style={onboardingStyles.buttonText}>
            {isLastSlide ? "🚀 Commencer" : "Suivant"}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;