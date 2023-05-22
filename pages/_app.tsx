import '../styles/globals.css';
import type { AppProps } from 'next/app';
import Layout from '../components/Layout';
import { UUIDProvider } from '../context/UUID';
import { ConnectProvider } from '../context/connected';
import { useState } from 'react';

function MyApp({ Component, pageProps }: AppProps) {
  const [authSig, setAuthSig] = useState('');
  
  return (
    <UUIDProvider>
      <ConnectProvider>
        <Layout>
          <Component
            authSig={authSig}
            setAuthSig={setAuthSig}
            {...pageProps} />
        </Layout>
      </ConnectProvider>
    </UUIDProvider>
  )
}

export default MyApp