import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Web3ProviderWrapper } from '../utils/providers';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <Web3ProviderWrapper>
                <Component {...pageProps} />
    </Web3ProviderWrapper>
  )
  
}

export default MyApp
