import { View, Text, FlatList, Image } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { palette } from '@/components/styles/theme';
import SettingsHeader from '../../components/SettingsHeader';
import Button from '@/components/elements/Button/Button';
import { SBA } from './BlockedAccounts.styles';
import { dummyData, keywords } from '../../utils/keywords';

const BlockedAccounts = () => {
    const insets = useSafeAreaInsets();

    const handleUnblockUser = (id: string) => {
        // handle unblock user
        console.log(id)
    }

    const renderUser = ({ item }: any) => (
        <View style={SBA.item}>
            <Image
                source={{ uri: item.image }}
                style={SBA.image}
            />
            <Text style={SBA.text}>
                {item.name}{'\n'}
                <Text style={SBA.detailText}>
                    {item.location}{'\n'}
                    {item?.listings} item
                </Text>
            </Text>
            <View style={SBA.button}>
                <Button text={keywords.unblock} onPress={() => handleUnblockUser(item.id)} variant='main' fontSize={14}/>
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
            <SettingsHeader headerTitle={keywords.blockedAccounts} headerType={'main'} />
            <FlatList
                data={dummyData}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderUser}
                showsVerticalScrollIndicator={false}
            />
        </View>
    )
}

export default BlockedAccounts