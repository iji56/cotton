import { Mixpanel } from 'mixpanel-react-native';
import React, { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { MIXPANEL_TOKEN } from '@env';

interface MixpanelProviderProps {
  children: ReactNode;
}

const mixpanelToken: string = MIXPANEL_TOKEN;

export const MixpanelContext = createContext<Mixpanel | null>(null);

export const MixpanelProvider: React.FC<MixpanelProviderProps> = ({
  children,
}) => {
  const [mixpanel, setMixpanel] = useState<Mixpanel | null>(null);
  const trackAutomaticEvents = false;
  useEffect(() => {
    const initMixpanel = async () => {
      const initializedMixpanel: Mixpanel = await Mixpanel.init(
        MIXPANEL_TOKEN,
        trackAutomaticEvents,
      );
      setMixpanel(initializedMixpanel);
    };

    initMixpanel();
  }, []);

  return (
    <MixpanelContext.Provider value={mixpanel}>
      {children}
    </MixpanelContext.Provider>
  );
};

export const useMixpanel = () => useContext(MixpanelContext);
