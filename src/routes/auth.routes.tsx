import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { Login } from '../screens/Auth/Login';
import { Signup } from '../screens/Auth/Signup';

export type AuthRoutesType = {
  login: undefined;
  signup: undefined;
}

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutesType>();

export function AuthRoutes() {
  return (
    <Navigator
      screenOptions={{
        headerTransparent: true,
        title: '',
        headerTintColor: 'white'
      }}
    >
      <Screen name='login' component={Login} />
      <Screen name='signup' component={Signup} />
    </Navigator>
  )
}