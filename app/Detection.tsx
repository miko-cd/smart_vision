import { useLocalSearchParams } from "expo-router";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator } from "react-native";
import { useRef, useState } from "react";
import { Audio } from "expo-av";
import axios from "axios";

const translations = {
  en: {
    advice: "Connect your headphones to use audio feedback immediately.",
    cameraPermissionButton: "Activate Camera",
  },
  mn: {
    advice: "Чихэвчээ холбоод аудио мэдээллийг шууд ашиглах боломжтой",
    cameraPermissionButton: "Камер идэвхжүүлэх",
  },
};

export default function Detection() {
  const params = useLocalSearchParams();
  const validLanguages = ["en", "mn"];
  const lang = validLanguages.includes(params.lang as string) ? (params.lang as "en" | "mn") : "mn";

  const [permission, requestPermission] = useCameraPermissions();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const cameraRef = useRef(null);
  const [sound, setSound] = useState(null);

  // Function to fetch and play audio
  const fetchAndPlayAudio = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: "http://34.21.40.54:5000/audio" },
        { shouldPlay: true }
      );
      setSound(sound);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing audio:", error);
    }
  };

  // Function to handle real-time frame processing
  const processFrame = async (frame) => {
    try {
      setLoading(true);

      const response = await axios.post("http://34.21.40.54:5000/detect", {
        image: frame.base64,
      });

      setResult(response.data);
      fetchAndPlayAudio(); // Play audio when detection is successful
    } catch (error) {
      console.error("Error detecting objects:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.back} onPress={() => {}}>
          <Text style={styles.text}>Back</Text>
        </TouchableOpacity>
        <Text style={styles.advice}>{translations[lang].advice}</Text>
        <TouchableOpacity style={styles.check} onPress={requestPermission}>
          <Text style={styles.text}>{translations[lang].cameraPermissionButton}</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.back} onPress={() => {}}>
        <Text style={styles.text}>Back</Text>
      </TouchableOpacity>
      <View style={styles.cameraSection}>
        <CameraView
          style={styles.camera}
          ref={cameraRef}
          facing="back"
          onFrame={(frame) => processFrame(frame)}
        >
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
            </View>
          )}
        </CameraView>
        <Text style={styles.advice}>{translations[lang].advice}</Text>
      </View>
      {result && (
        <View style={styles.resultContainer}>
          <Text style={styles.resultText}>{JSON.stringify(result, null, 2)}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "#FFFFFF",
  },
  back: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
  },
  cameraSection: {
    margin: 20,
    height: 450,
    justifyContent: "center",
    backgroundColor: "#F7F7F7",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  camera: {
    flex: 1,
    margin: 20,
  },
  advice: {
    color: "#9E9CA9",
    textAlign: "center",
    fontSize: 16,
    marginBottom: 20,
    paddingHorizontal: 20,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  check: {
    backgroundColor: "#C85BFC",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    margin: 20,
    padding: 20,
    borderRadius: 20,
  },
  text: {
    fontSize: 18,
    color: "#fff",
  },
  resultContainer: {
    padding: 10,
    backgroundColor: "#111",
    borderRadius: 5,
    margin: 10,
  },
  resultText: {
    color: "#fff",
    fontSize: 16,
  },
});
