import { useState } from 'react';
import { ActivityIndicator, Alert, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { GoogleSignin, GoogleSigninButton } from '@react-native-google-signin/google-signin';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { AuthRoutesType } from '../../../routes/auth.routes';

import auth from '@react-native-firebase/auth';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

import Logo from '../../../assets/logo.png';
import GoogleLogo from '../../../assets/google-logo.png';
import { LinearGradient } from 'expo-linear-gradient';

const LoginFormSchema = z.object({
  email: z.string({ message: 'Campo obrigatório' }).email('Insira um email válido'),
  password: z.string({ message: 'Campo obrigatório' }).min(0, 'Insira sua senha'),
});

type LoginForm = z.infer<typeof LoginFormSchema>;

GoogleSignin.configure({
  scopes: ['email', 'profile'],
  webClientId: '45169531522-27netf8pkv1v2b7rikr9pkitk8u2glqv.apps.googleusercontent.com'
});

export function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const { navigate } = useNavigation<NavigationProp<AuthRoutesType>>();
  const { handleSubmit, control, formState: { errors } } = useForm<LoginForm>({
    resolver: zodResolver(LoginFormSchema),
    mode: 'onChange',
  });

  async function loginWithGoogle() {
    try {
      setIsLoading(true);
      await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
      const { idToken } = await GoogleSignin.signIn();

      // Create a Google credential with the token
      const googleCredential = auth.GoogleAuthProvider.credential(idToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(googleCredential);
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro', 'Tente novamente mais tarde.');
      setIsLoading(false);
    }
  };

  async function handleLogin({ email, password }: LoginForm) {
    try {
      setIsLoading(true);
      await auth().signInWithEmailAndPassword(email, password);
    } catch (error) {
      console.log(error);
      Alert.alert('Ocorreu um erro', 'Tente novamente mais tarde.')
      setIsLoading(false);
    }
  }

  return (
    <LinearGradient style={styles.container} colors={['#1C8F09', '#177407', '#082903']}>
      <Text style={styles.title}>
        {'Pimentinhas\ndo\nSandiego'}
      </Text>

      <KeyboardAvoidingView behavior='padding' style={{ gap: 10 }}>
        <Text style={[styles.title, { color: 'black' }]}>
          Entrar
        </Text>

        <View style={styles.textfield}>
          <Text>E-mail</Text>
          <Controller
            name='email'
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoCapitalize='none'
                value={value}
                style={styles.input}
                onChangeText={onChange}
                placeholder='Digite seu email'
              />
            )} />
          {errors.email?.message && <Text style={[{ color: 'red', alignSelf: 'flex-end' }]}>{errors.email.message}</Text>}
        </View>

        <View style={styles.textfield}>
          <Text>Senha</Text>
          <Controller
            name='password'
            control={control}
            render={({ field: { onChange, value } }) => (
              <TextInput
                autoCapitalize='none'
                value={value}
                style={styles.input}
                onChangeText={onChange}
                placeholder='Digite sua senha'
                secureTextEntry
              />
            )} />
          {errors.password?.message && <Text style={[{ color: 'red', alignSelf: 'flex-end' }]}>{errors.password.message}</Text>}
        </View>
      </KeyboardAvoidingView>

      <View style={{ gap: 10 }}>
        <TouchableOpacity style={styles.button} onPress={handleSubmit(handleLogin)}>
          <Text style={{ color: 'white' }}>{isLoading ? <ActivityIndicator color='white' /> : 'Entrar'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => navigate('signup')}>
          <Text style={{ color: 'white' }}>Criar conta</Text>
        </TouchableOpacity>

        <TouchableOpacity style={{ alignSelf: 'center', gap: 1 }}>
          <Text style={{ color: 'white' }}>Esqueceu a senha?</Text>
        </TouchableOpacity>
      </View>

      <View style={{ gap: 10 }}>
        <View style={{ gap: 5, flexDirection: 'row', alignItems: 'center' }}>
          <View style={styles.hr} />
          <Text style={{ color: 'white' }}>continuar com</Text>
          <View style={styles.hr} />
        </View>
        <GoogleSigninButton style={{ width: '100%' }} onPress={loginWithGoogle} />
      </View>
    </LinearGradient>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    padding: 32,
    justifyContent: 'space-around',
  },
  logo: {
    alignSelf: 'center',
    width: '100%',
    height: 160
  },
  textfield: {
    gap: 5
  },
  title: {
    fontWeight: '600',
    fontSize: 30,
    textAlign: 'center',
    color: 'white'
  },
  input: {
    backgroundColor: '#D9D9D9',
    borderRadius: 10,
    paddingVertical: 5,
    paddingHorizontal: 10
  },
  hr: {
    height: 0.8,
    backgroundColor: 'white',
    flex: 1
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  }
})