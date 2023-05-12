import { StyleSheet, Text, View, useColorScheme } from 'react-native';
import HeartLogo from './../icons/HeartLogo'
import React from 'react'

const Main = () => {
    const theme = useColorScheme();
    return (
        <View style={styles.background}>
            <Text style={styles.text}>{theme}</Text>
            <HeartLogo fill={'gray'} className={styles.heart} />
        </View>
    )
}

export default Main

const styles = StyleSheet.create({
    background: {
        backgroundColor: '#17173c'
    },
    text: {
        color: 'white'
    },
    heart : {
        width: '50%',
        alignItems: 'center'
    }
})