import * as React from 'react';
import { Dimensions } from 'react-native';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import STab from './Tab.styles';
import { TabBarProps } from 'react-native-tab-view';

type Route = {
  key: string;
  title: string;
};

interface TabProps {
  routes: Route[];
  scenes: { [key: string]: React.FC };
}

export const renderTabBar = (props: TabBarProps<Route>) => (
  <TabBar
    {...props}
    style={STab.tabBar}
    labelStyle={STab.labelStyle}
    indicatorStyle={STab.indicatorStyle}
  />
);

export default function Tab({ routes, scenes }: TabProps) {
  const [index, setIndex] = React.useState(0);
  const renderScene = SceneMap(scenes);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: Dimensions.get('window').width }}
      renderTabBar={renderTabBar}
    />
  );
}
