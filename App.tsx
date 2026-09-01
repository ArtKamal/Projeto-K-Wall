//Arquivo que contém as rotas do aplicativo, ou seja, as telas que o usuário pode acessar
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

//importar todas as telas do aplicativo
import LoginScreen from './src/screens/login_screen';
import RegisterScreen from './src/screens/register_screen';
import SplashScreen from './src/screens/splash_screen';

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();
export default function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Splash"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Register" component={RegisterScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}