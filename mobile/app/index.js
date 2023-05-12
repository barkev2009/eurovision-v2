import { StyleSheet, Text, View, SafeAreaView } from 'react-native'
import React from 'react'
import Main from '../components/forms/Main'
import { Stack } from 'expo-router'

const App = () => {
  return (
    <SafeAreaView>
      <Stack.Screen
        options={
          {
            headerTitle: '',
          }
        }
      />
      <Main />
    </SafeAreaView>
  )
}

export default App

const styles = StyleSheet.create(
  {

  }
)