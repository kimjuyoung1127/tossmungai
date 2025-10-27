// src/_app.tsx (최종 수정 - 공식 문서 기반)

import { TDSProvider } from '@toss/tds-react-native';
// [1] ✅ appLogin 함수를 직접 import 합니다.
import { appLogin, AppsInToss, type AppsInTossProps } from '@apps-in-toss/framework';
import React, { useEffect, useState, type PropsWithChildren } from 'react';
import { Text, View, ActivityIndicator, StyleSheet, Button } from 'react-native';
import { loginWithToss } from '../supabase/auth'; // 인가 코드를 받는 함수
import { supabase } from '../supabase/supabase';
import type { InitialProps } from "@granite-js/react-native";
import { context as routerContext } from '../require.context';

// [2] AppContainer가 메인 로직을 처리하도록 단순화
function AppContainer({ context, analytics, children }: PropsWithChildren<InitialProps & AppsInTossProps>) {
    const [authStatus, setAuthStatus] = useState('Initializing...');
    const [authCode, setAuthCode] = useState<string | null>(null);
    const [supabaseUser, setSupabaseUser] = useState<string | null>(null);

    useEffect(() => {
        const initializeAuth = async () => {
            try {
                setAuthStatus('1. 토스 앱 로그인 시도 중 (appLogin)...');
                console.log('Attempting to call appLogin...');

                // [3] ✅ 공식 문서대로 appLogin() 직접 호출
                const { authorizationCode, referrer } = await appLogin();
                console.log('✅ appLogin Success!', { authorizationCode: authorizationCode?.substring(0, 10) + '...', referrer }); // 민감 정보 일부만 로깅

                if (!authorizationCode) {
                    throw new Error('토스에서 인가 코드를 받지 못했습니다.');
                }
                setAuthCode(authorizationCode);

                setAuthStatus('2. 인가 코드로 Supabase 로그인 시도 중...');
                const user = await loginWithToss(authorizationCode, referrer); // auth.ts 함수 호출

                if (!user) {
                    throw new Error('Supabase 함수에서 사용자 정보를 얻지 못했습니다.');
                }

                setAuthStatus('3. Supabase 세션 확인 중...');
                const { data: { session } } = await supabase.auth.getSession();

                if (session && session.user.id === user.id) {
                    setSupabaseUser(session.user.id);
                    setAuthStatus('✅ 인증 성공!');
                } else {
                    await supabase.auth.signOut();
                    throw new Error('Supabase 세션 검증 실패');
                }

            } catch (error: any) {
                console.error("Authentication failed:", error);
                // 오류 메시지에 따라 사용자에게 안내 (예: 토스 앱 업데이트 필요, 네트워크 오류 등)
                if (error.message?.includes('SDK') || error.message?.includes('Toss app environment')) {
                     setAuthStatus(`❌ SDK 초기화 오류: ${error.message}`);
                } else if (error.message?.includes('인가 코드')) {
                     setAuthStatus(`❌ 토스 로그인 실패: ${error.message}`);
                } else if (error.message?.includes('Supabase')) {
                     setAuthStatus(`❌ 서버 인증 실패: ${error.message}`);
                } else {
                     setAuthStatus(`❌ 알 수 없는 오류: ${error.message}`);
                }
            }
        };

        // 앱 시작 시 바로 인증 시도
        initializeAuth();

    }, []); // 앱 시작 시 1회만 실행

    // --- 인증 상태 표시 UI ---
    return (
        <TDSProvider>
            <View style={styles.container}>
                {authStatus !== '✅ 인증 성공!' && <ActivityIndicator size="large" color="#0070F3" />}
                <Text style={styles.statusText}>{authStatus}</Text>
                {authCode && (
                    <Text style={styles.infoText}>Auth Code: {authCode.substring(0, 10)}...</Text>
                )}
                {supabaseUser && (
                    <Text style={styles.infoText}>Supabase ID: {supabaseUser}</Text>
                )}
                {/* 인증 성공 시 실제 앱 라우터(children) 렌더링 (나중에 추가) */}
                {/* {authStatus === '✅ 인증 성공!' && children} */}
            </View>
        </TDSProvider>
    );
}

// [4] registerApp 호출 방식은 공식 문서 기본 구조 유지
const RegisteredApp = AppsInToss.registerApp(AppContainer, { context: routerContext });

export default RegisteredApp;

// --- Styles (변경 없음) ---
const styles = StyleSheet.create({
    container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#181E29', padding: 20 },
    text: { color: 'white', fontSize: 18, marginBottom: 10 },
    statusText: { marginTop: 20, color: 'white', fontSize: 16, textAlign: 'center' },
    infoText: { color: 'gray', marginTop: 10, fontSize: 12 },
});