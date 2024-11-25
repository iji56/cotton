import React from 'react';
import { Text, ScrollView } from 'react-native';
import SEditListing from './EditListing.styles';
import Layout from '../../../sections/Layout';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../../styles/theme';

const EditListing = () => {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{
        flex: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
        backgroundColor: theme.colors.background,
      }}>
      <Layout>
        <Text>Edit Listing</Text>
      </Layout>
    </ScrollView>
  );
};

export default EditListing;
