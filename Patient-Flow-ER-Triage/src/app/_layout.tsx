import { Stack } from 'expo-router';
import "../../global.css";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'ER Patient Flow Dashboard',
          headerStyle: { backgroundColor: '#0f172a' },
          headerTintColor: '#fff',
        }} 
      />
    </Stack>
  );
}