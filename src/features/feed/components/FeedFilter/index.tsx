import { View, ScrollView } from 'react-native';
import { SFF } from './FeedFilter.styles';
import FeedChip from '../FeedChip';
import { useContext, useEffect, useState } from 'react';
import { occasionFilters } from '../../utils/filters';
import { FeedMainContext } from '../../context/FeedMainContext';

const FeedFilter = () => {
  const { selectedFilters, setSelectedFilters } = useContext(FeedMainContext);

  const toggleFilter = (filter: string) => {
    const index = selectedFilters.indexOf(filter);
    let newSelectedFilters = [...selectedFilters.flat()];

    if (index === -1) {
      newSelectedFilters.push(filter);
    } else {
      newSelectedFilters.splice(index, 1);
    }
    setSelectedFilters(newSelectedFilters);
  };

  return (
    <View style={SFF.container}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {selectedFilters.flat().filter(filter => filter !== '').map((item, index) => (
          <FeedChip
            key={index}
            label={item}
            selected={selectedFilters.flat().includes(item)}
            onPress={() => toggleFilter(item)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

export default FeedFilter;