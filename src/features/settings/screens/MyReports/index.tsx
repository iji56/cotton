import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import SettingsHeader from '../../components/SettingsHeader';
import Button from '@/components/elements/Button/Button';
import { SMR } from './MyReports.styles';
import { dummyData, keywords } from '../../utils/keywords';

const MyReports = () => {
    const insets = useSafeAreaInsets();

    const handleRestrction = (id: string) => {
        // handle restrict 
        console.log(id)
    }

    const renderUser = ({ item }: any) => (
        <View style={SMR.item}>
            <Image
                source={{ uri: item.image }}
                style={SMR.image}
            />
            <Text style={SMR.text}>
                {item.name}{'\n'}
                <Text style={SMR.detailText}>
                    {item.location}{'\n'}
                    {item?.size}  {item?.price}
                </Text>
            </Text>
            <View style={SMR.button}>
                <Button text={keywords.unrestricts} onPress={() => handleRestrction(item.id)} variant='main' fontSize={14} />
            </View>
        </View>
    );

    return (
        <View style={{
            flex: 1,
            paddingTop: insets.top,
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            paddingRight: insets.right,
            backgroundColor: palette.white
        }}>
            <SettingsHeader headerTitle={keywords.myReports} headerType={'main'} />
            <FlatList
                data={dummyData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderUser}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default MyReports