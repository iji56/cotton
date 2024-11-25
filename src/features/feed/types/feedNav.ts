import { NativeStackNavigationProp } from '@react-navigation/native-stack';

export type FeedParamList = {
  BorrowMain: { itemData: string };
  BorrowNav: any;
  FeedProfile: any
};

export type FeedNavigation = NativeStackNavigationProp<FeedParamList>;

export type ListViewPropType = {
  handleFilter: () => void
}
