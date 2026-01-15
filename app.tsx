import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddMealScreen from './screens/addMeal/addMeal';
import CreateAccountScreen from './screens/createAccount/createAccount';
import ForgotPasswordScreen from './screens/forgotPassword/forgotPassword';
import HomeScreen from './screens/home/home';
import LoginScreen from './screens/login/login';
import SurveyScreen from './screens/survey/survey';
import { RootStackParamList } from './types/navigation';

const Tab = createBottomTabNavigator<RootStackParamList>();

export default function App() {

  return (
    <Tab.Navigator>
      <BottomSheetModalProvider>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="AddMeal" component={AddMealScreen} />
        <Tab.Screen name="CreateAccount" component={CreateAccountScreen} />
        <Tab.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Tab.Screen name="Login" component={LoginScreen} />
        <Tab.Screen name="Survey" component={SurveyScreen} />
      </BottomSheetModalProvider>
    </Tab.Navigator>
  );
}
