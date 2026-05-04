import { Redirect } from 'expo-router';
import { RelativePathString } from 'expo-router';

export default function Index() {
  return <Redirect href={"/(tabs)" as RelativePathString} />;
}