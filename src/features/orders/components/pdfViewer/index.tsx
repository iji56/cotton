import { Modal, View } from 'react-native'
import React, { useContext } from 'react'
import Pdf from 'react-native-pdf';
import SPDFV from './pdfViewer.styles';
import H2 from '@/components/elements/H2';
import { NotificationContext } from '@/features/Listeners/listeners';
import SOL from '../OrdersList/OrderList.styles';
import IconButton from '@/components/elements/Button/IconButton';
import { palette } from '@/components/styles/theme';

const PdfViewer = () => {
    const { filePath, modalVisible, setModalVisible } = useContext(NotificationContext);
    const source = { uri: filePath, cache: true }
    return (
        <Modal visible={modalVisible} transparent onDismiss={() => setModalVisible(false)}>
            <View style={SPDFV.modalBody}>
                <IconButton icon={'close'} onPress={() => setModalVisible(false)} size={25} iconColor={palette.black} style={SPDFV.closeIcon} />
                <View style={{ flex: 1 }}>
                    {filePath ?
                        <Pdf
                            source={source}
                            onLoadComplete={(numberOfPages, filePath) => {
                                console.log(`Number of pages: ${numberOfPages}`);
                            }}
                            onPageChanged={(page, numberOfPages) => {
                                console.log(`Current page: ${page}`);
                            }}
                            onError={(error) => {
                                console.log(error);
                            }}
                            onPressLink={(uri) => {
                                console.log(`Link pressed: ${uri}`);
                            }}
                            style={SPDFV.pdf}
                        />
                        :
                        <H2 style={{ textAlign: 'center' }} text="File does not exist" />
                    }
                </View>
            </View>
        </Modal>

    )
}

export default PdfViewer