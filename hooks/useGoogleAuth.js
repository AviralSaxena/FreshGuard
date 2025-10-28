import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { useState } from 'react';

WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = '979802630126-he3glojp23b03b41kd7top387u26t01g.apps.googleusercontent.com';
const GOOGLE_REDIRECT_URI = 'https://auth.expo.io/@davidawe/total';

export const useGoogleAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: GOOGLE_CLIENT_ID,
    redirectUri: GOOGLE_REDIRECT_URI,
    scopes: ['profile', 'email'],
  });

  const signInWithGoogle = async () => {
    try {
      setIsLoading(true);
      const result = await promptAsync();
      
      if (result?.type === 'success') {
        const { authentication } = result;
        return {
          success: true,
          user: {
            id: 'google_' + authentication.accessToken.slice(0, 8),
            email: 'google_user@example.com',
            name: 'Google User',
            provider: 'google'
          }
        };
      }
      return { success: false, error: 'Google sign-in failed' };
    } catch (error) {
      console.error('Google sign-in error:', error);
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  return { signInWithGoogle, isLoading };
}; 