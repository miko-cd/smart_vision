import React, { useEffect } from "react";
import { Text, View, Button, StyleSheet } from "react-native";
import { useRouter } from "expo-router";


export default function Index() {
  const router = useRouter();

  {/* 
  const express = require('express');
  const path = require('path');
  const app = express();

  app.get('/audio', (req, res) => {
    const audioPath = path.join(__dirname, 'audio.mp3');
    res.setHeader('Content-Type', 'audio/mpeg');
    res.sendFile(audioPath);
    });

    app.listen(http://34.21.40.54:5000/detect, () => {
        console.log('Server running on port 5000');
    });
  */}


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to the App</Text>

      <View style={styles.buttonContainer}>
        <Button
          title="Go to Detection"
          onPress={() => router.push("/Detection")}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    marginBottom: 20,
    fontWeight: "bold",
  },
  buttonContainer: {
    marginTop: 10,
    width: "80%",
  },
});
