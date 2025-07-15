import { addNetworkStateListener } from 'expo-network';
import React, { createContext, ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, BackHandler, SafeAreaView, Text, View } from 'react-native';
import WebView from 'react-native-webview';

interface Config {
  api: string;
  lngs?: string[];
}

export const FirstValueContext = createContext(null);

function Wrapper(AppComponent: React.ComponentType<any>, config: Config, onHide?: () => void) {
  const { api } = config;

  const WrappedComponent = () => {
    const [apiData, setApiData] = useState(null);
    const [firstValue, setFirstValue] = useState<any>(null);
    const [isConnected, setIsConnected] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isWv, setIsWv] = useState(false);

    useEffect(() => {
      const { remove } = addNetworkStateListener(({ isInternetReachable }) => {
        setIsConnected(isInternetReachable ?? false);
      });

      onHide?.();

      return remove;
    }, []);

    useEffect(() => {
      if (!isConnected) {
        return;
      }

      const fetchData = async () => {
        try {
          const response = await fetch(api);
          const result = await response.json();

          setApiData(result);
        } catch (err) {
          console.log('Error load API');
        }
      };

      fetchData();
    }, [isConnected]);

    useEffect(() => {
      if (apiData) {
        const firstKey = Object.keys(apiData)[0];
        setFirstValue(apiData[firstKey]);

        if (Array.isArray(apiData[firstKey])) {
          setIsWv(false);
        } else {
          setIsWv(true);
        }
        setIsLoading(false);
      }
    }, [apiData]);

    if (!isConnected) {
      return (
        <ScreenWrapper>
          <Text style={{ color: '#000', fontSize: 32, textAlign: 'center' }}>{'NO INTERNET'}</Text>
        </ScreenWrapper>
      );
    }

    if (isLoading) {
      return (
        <ScreenWrapper>
          <Text style={{ color: '#000', fontSize: 32, textAlign: 'center' }}>{'Loading...'}</Text>
          <ActivityIndicator color={'#000'} size={'large'} />
        </ScreenWrapper>
      );
    }

    return (
      <FirstValueContext.Provider value={firstValue}>
        {isWv ? <Wv uri={firstValue} /> : <AppComponent />}
      </FirstValueContext.Provider>
    );
  };

  WrappedComponent.displayName = 'WrappedAppComponent';

  return WrappedComponent;
}

const ScreenWrapper = ({ children }: { children: ReactNode }) => {
  return (
    <View
      style={{
        alignItems: 'center',
        backgroundColor: '#0E0E2A',
        flex: 1,
        gap: 16,
        justifyContent: 'center',
      }}
    >
      {children}
    </View>
  );
};

export const Wv = ({ uri }: { uri: string }) => {
  const ref = useRef<WebView>(null);

  const handleBack = useCallback(() => {
    if (ref?.current) {
      ref.current.goBack();

      return true;
    }

    return false;
  }, []);

  useEffect(() => {
    const { remove } = BackHandler.addEventListener('hardwareBackPress', handleBack);

    return remove;
  }, [handleBack]);

  return (
    <SafeAreaView style={{ backgroundColor: '#0E0E2A', flex: 1 }}>
      <WebView
        allowFileAccess={true}
        allowFileAccessFromFileURLs={true}
        allowsInlineMediaPlayback={true}
        allowUniversalAccessFromFileURLs={true}
        androidLayerType={'none'}
        cacheEnabled={true}
        cacheMode={'LOAD_DEFAULT'}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        onError={(err) => {
          console.log('onError', err);
        }}
        onMessage={() => {}}
        onShouldStartLoadWithRequest={() => true}
        ref={ref}
        source={{ uri }}
        textZoom={100}
        thirdPartyCookiesEnabled={true}
      />
    </SafeAreaView>
  );
};

export default Wrapper;
