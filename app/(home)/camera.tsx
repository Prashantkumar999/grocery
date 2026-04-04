import { CameraType, CameraView, useCameraPermissions, type CameraViewRef } from 'expo-camera'
import { useRouter } from 'expo-router'
import React from 'react'
import { ActivityIndicator, Image, Pressable, StyleSheet, Text, View } from 'react-native'
import { ThemedText } from '../../components/ThemedText'
import { ThemedView } from '../../components/ThemedView'

export default function CameraScreen() {
  const router = useRouter()
  const cameraRef = React.useRef<CameraViewRef | null>(null)
  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = React.useState<CameraType>('back')
  const [isReady, setIsReady] = React.useState(false)
  const [isCapturing, setIsCapturing] = React.useState(false)
  const [photoUri, setPhotoUri] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!photoUri) {
      setIsReady(false)
    }
  }, [photoUri])

  const toggleFacing = () => {
    setFacing((currentFacing) => (currentFacing === 'back' ? 'front' : 'back'))
  }

  const handleCapture = async () => {
    if (!cameraRef.current || !isReady || isCapturing) {
      return
    }

    setIsCapturing(true)
    try {
      const picture = await cameraRef.current.takePictureAsync({ quality: 0.8 })
      setPhotoUri(picture.uri)
    } catch (error) {
      console.error('Failed to capture photo:', error)
    } finally {
      setIsCapturing(false)
    }
  }

  if (!permission) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <ThemedText style={styles.helperText}>Loading camera permissions...</ThemedText>
      </ThemedView>
    )
  }

  if (!permission.granted) {
    return (
      <ThemedView style={styles.centeredContainer}>
        <ThemedText type="title" style={styles.title}>
          Camera access required
        </ThemedText>
        <ThemedText style={styles.helperText}>
          Allow camera access to take a photo in the app.
        </ThemedText>
        <Pressable style={styles.primaryButton} onPress={requestPermission}>
          <Text style={styles.primaryButtonText}>Grant permission</Text>
        </Pressable>
        <Pressable style={styles.secondaryButton} onPress={() => router.back()}>
          <Text style={styles.secondaryButtonText}>Go back</Text>
        </Pressable>
      </ThemedView>
    )
  }

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <Pressable style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Back</Text>
        </Pressable>
        <ThemedText type="title" style={styles.title}>
          Camera
        </ThemedText>
        <Pressable style={styles.backButton} onPress={toggleFacing}>
          <Text style={styles.backButtonText}>Flip</Text>
        </Pressable>
      </View>

      <View style={styles.cameraFrame}>
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.previewImage} />
        ) : (
          <CameraView
            ref={cameraRef}
            style={styles.camera}
            facing={facing}
            onCameraReady={() => setIsReady(true)}
          />
        )}
      </View>

      <Text style={styles.helperText}>
        {photoUri ? 'Photo captured. Retake or go back.' : 'Position your shot and tap capture.'}
      </Text>

      <View style={styles.actions}>
        <Pressable
          style={({ pressed }) => [
            styles.primaryButton,
            (!isReady || isCapturing) && styles.buttonDisabled,
            pressed && styles.buttonPressed,
          ]}
          onPress={handleCapture}
          disabled={!isReady || isCapturing}
        >
          <Text style={styles.primaryButtonText}>{isCapturing ? 'Capturing...' : 'Capture'}</Text>
        </Pressable>
        {photoUri ? (
          <Pressable
            style={({ pressed }) => [styles.secondaryButton, pressed && styles.buttonPressed]}
            onPress={() => {
              setPhotoUri(null)
            }}
          >
            <Text style={styles.secondaryButtonText}>Retake</Text>
          </Pressable>
        ) : null}
      </View>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  centeredContainer: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  title: {
    flex: 1,
    textAlign: 'center',
  },
  cameraFrame: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 24,
    backgroundColor: '#111827',
  },
  camera: {
    flex: 1,
  },
  previewImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  helperText: {
    textAlign: 'center',
    color: '#4b5563',
  },
  primaryButton: {
    backgroundColor: '#0a7ea4',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    minWidth: 120,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '700',
  },
  secondaryButton: {
    backgroundColor: '#e5e7eb',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 999,
    alignItems: 'center',
    minWidth: 120,
  },
  secondaryButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 999,
    backgroundColor: '#e5e7eb',
  },
  backButtonText: {
    color: '#111827',
    fontWeight: '700',
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
})