import TextLink from '@/components/textLink';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
    const router = useRouter();
    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Profile Screen</Text>
              <View >
                <TextLink
                    label="Subscription"
                    linkText="Pricing"
                    onPress={() => router.push('./subscription/pricing')}
                />
                </View>
        </View>
    );
}