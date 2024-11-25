import { ReactNode } from 'react';
import { View } from 'react-native';
import SW from './Wrapper';

type WrapperProps = {
  children: ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {
  return <View style={SW.view}>{children}</View>;
};

export default Wrapper;
