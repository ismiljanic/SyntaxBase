import React from 'react';
import './App.css';
import { Router } from './Router';
import { useAuth0 } from '@auth0/auth0-react';
import { useTokenExpiryChecker } from "../src/hooks/useTokenExpiryChecker";
import { useRefreshToken } from "./hooks/useRefreshToken";
import LoadingScreen from './components/LoadingScreen';

export function App() {
  const { isLoading, error } = useAuth0();

  useTokenExpiryChecker();
  useRefreshToken();

  React.useEffect(() => {
    document.title = "SyntaxBase";
  }, []);

  if (isLoading) {
    return <LoadingScreen />;
  }
  
  if (error) {
    return <div>Authentication error: {error.message}</div>;
  }

  return (
    <div className='app_container'>
      <Router />
    </div>
  );
}