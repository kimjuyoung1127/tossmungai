// src/_app.tsx (FINAL CORRECTED VERSION)

import { TDSProvider } from '@toss/tds-react-native';
// [1] Import AppsInToss and the newly discovered context
import { AppsInToss } from '@apps-in-toss/framework';
import { context } from '../require.context';

import { useEffect, useState } from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import { loginWithToss } from '@/supabase/auth';
import { supabase } from '@/supabase/supabase';

// [2] Use a robust method to get the props type for the App component.
// This extracts the type of the SECOND argument of registerApp, which is the props object.
type AppProps = Parameters<typeof AppsInToss.registerApp>[1];

// [3] The main application component, which receives props injected by the framework
function App({ context, analytics }: AppProps) {
  
  const [authStatus, setAuthStatus] = useState('Initializing...');
  const [tossKey, setTossKey] = useState<string | null>(null);
  const [supabaseUser, setSupabaseUser] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
      // Ensure context is available before proceeding
      if (!context?.userKey) {
          setAuthStatus('Waiting for Toss Context...');
          return; 
      }
        
      try {
        setAuthStatus('1. 토스 유저 키 확인 중...');
        const tossUserKey = context.userKey;
        setTossKey(tossUserKey); 
        
        setAuthStatus('2. Supabase 로그인 시도 중...');
        const user = await loginWithToss(tossUserKey);
        
        setAuthStatus('3. Supabase 세션 확인 중...');
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user.id === user.id) {
          setSupabaseUser(session.user.id); 
          setAuthStatus('✅ 인증 성공!');
        } else {
          throw new Error('Supabase 세션 획득 실패');
        }
        
      } catch (error: any) {
        console.error(error);
        setAuthStatus(`❌ 인증 실패: ${error.message}`);
      }
    };

    initializeAuth();
    
  }, [context]); 

  return (
    <TDSProvider>
      {authStatus !== '✅ 인증 성공!' ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0070F3" />
          <Text style={styles.loadingText}>{authStatus}</Text>
          {tossKey && (
            <Text style={styles.infoText}>Toss Key: {tossKey}</Text>
          )}
          {supabaseUser && (
            <Text style={styles.infoText}>Supabase ID: {supabaseUser}</Text>
          )}
        </View>
      ) : (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>🎉 인증 성공!</Text>
          <Text style={styles.infoText}>Supabase User ID:</Text>
          <Text style={styles.infoText}>{supabaseUser}</Text>
        </View>
      )}
    </TDSProvider>
  );
}

// [4] (CRITICAL FIX) Call registerApp with the component AND the context object
export default AppsInToss.registerApp(App, { context }); 

// Styles remain the same
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#181E29', 
    padding: 20,
  },
  loadingText: {
    marginTop: 20,
    color: 'white',
    fontSize: 16,
    textAlign: 'center',
  },
  infoText: {
    color: 'gray',
    marginTop: 10,
    fontSize: 12,
  },
});