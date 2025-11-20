import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import TextLink from '@/components/textLink';

export default function PricingScreen() {
  const router = useRouter();

  return (
    <ScrollView 
      style={{ flex: 1, backgroundColor: '#fff' }}
      contentContainerStyle={{ padding: 20 }}
    >
      {/* Header */}
      <Text style={{ fontSize: 26, fontWeight: '700', marginBottom: 6 }}>
        Pro Plan
      </Text>
      <Text style={{ color: '#6b6b6b', marginBottom: 20 }}>
        Get more access to our most popular features
      </Text>

      {/* Toggle Tabs */}
      <View style={{ flexDirection: 'row', marginBottom: 20 }}>
        <TouchableOpacity 
          style={{
            paddingVertical: 8,
            paddingHorizontal: 20,
            backgroundColor: '#e6e6e6',
            borderRadius: 20,
            marginRight: 10
          }}
        >
          <Text style={{ fontWeight: '600' }}>Monthly</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={{
            paddingVertical: 8,
            paddingHorizontal: 20,
            backgroundColor: '#fff',
            borderRadius: 20,
            borderWidth: 1,
            borderColor: '#ddd',
          }}
        >
          <Text style={{ color: '#333' }}>
            Yearly (Save 24%)
          </Text>
        </TouchableOpacity>
      </View>

      {/* PREMIUM CARD */}
      <View 
        style={{
          borderWidth: 1,
          borderColor: '#e6e6e6',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          backgroundColor: '#fff'
        }}
      >
        {/* Tag */}
        <View 
          style={{ 
            alignSelf: 'flex-start',
            backgroundColor: '#f4e2c4',
            paddingHorizontal: 10,
            paddingVertical: 4,
            borderRadius: 6,
            marginBottom: 10
          }}
        >
          <Text style={{ fontSize: 12, fontWeight: '700' }}>Most Popular</Text>
        </View>

        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 4 }}>
          Premium
        </Text>
        <Text style={{ color: '#777' }}>
          Unlock Unlimited Deep Study
        </Text>

        <Text style={{ fontSize: 34, fontWeight: '800', marginTop: 10 }}>
          $9.99 <Text style={{ fontSize: 16 }}>/month</Text>
        </Text>

        <Text style={{ marginTop: 14, fontWeight: '600' }}>Includes</Text>

        {/* Features */}
        {[
          'Unlimited AI Chat',
          'Full Reflection Suite (Unlimited Access)',
          'Reflections & Q/A Finder',
          'Multi-Language Translations',
        ].map((item, idx) => (
          <Text key={idx} style={{ marginTop: 4 }}>
            ✓ {item}
          </Text>
        ))}

        <TouchableOpacity 
          style={{
            backgroundColor: '#c98a2d',
            paddingVertical: 12,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text 
            style={{ 
              textAlign: 'center', 
              fontWeight: '700',
              color: '#fff' 
            }}
          >
            Upgrade to premium
          </Text>
        </TouchableOpacity>
      </View>

      {/* PARTNERSHIP CARD */}
      <View 
        style={{
          borderWidth: 1,
          borderColor: '#e6e6e6',
          borderRadius: 14,
          padding: 16,
          marginBottom: 20,
          backgroundColor: '#fff'
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 4 }}>
          Partnerships
        </Text>
        <Text style={{ color: '#777' }}>
          Community & Content Collaboration
        </Text>

        <Text style={{ fontSize: 30, fontWeight: '800', marginTop: 10 }}>
          Custom<Text style={{ fontSize: 16 }}>/month</Text>
        </Text>

        <Text style={{ marginTop: 14, fontWeight: '600' }}>Includes</Text>

        {[
          'Target Audience',
          'Content Distribution',
          'Community Access',
          'Revenue Share Model',
        ].map((item, idx) => (
          <Text key={idx} style={{ marginTop: 4 }}>
            ✓ {item}
          </Text>
        ))}

        <TouchableOpacity 
          style={{
            backgroundColor: '#e6e6e6',
            paddingVertical: 12,
            borderRadius: 10,
            marginTop: 16,
          }}
        >
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>
            Talk to us
          </Text>
        </TouchableOpacity>
      </View>

      {/* FREE PLAN */}
      <View 
        style={{
          borderWidth: 1,
          borderColor: '#e6e6e6',
          borderRadius: 14,
          padding: 16,
          marginBottom: 40,
          backgroundColor: '#fff'
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: '700', marginBottom: 4 }}>
          Free Plan
        </Text>
        <Text style={{ color: '#777' }}>
          Explore how Deen AI can help get closer to Allah
        </Text>

        <Text style={{ fontSize: 30, fontWeight: '800', marginTop: 10 }}>
          $0<Text style={{ fontSize: 16 }}>/month</Text>
        </Text>

        <Text style={{ marginTop: 14, fontWeight: '600' }}>Includes</Text>

        {[
          'Quran Access',
          'Essential Daily Tools',
          'Limited Reflections Access',
          'Limited AI Chat/Ask',
        ].map((item, idx) => (
          <Text key={idx} style={{ marginTop: 4 }}>
            ✓ {item}
          </Text>
        ))}

        <TouchableOpacity 
          style={{
            backgroundColor: '#f2f2f2',
            paddingVertical: 12,
            borderRadius: 10,
            marginTop: 16,
          }}
          onPress={() => console.log('Continue with free')}
        >
          <Text style={{ textAlign: 'center', fontWeight: '700' }}>
            Continue with free plan
          </Text>
        </TouchableOpacity>
      </View>

      {/* Existing TextLink */}
      <View style={{ marginBottom: 60 }}>
        <TextLink
          label="Subscription"
          linkText="Pricing"
          onPress={() => router.push('/')}
        />
      </View>
    </ScrollView>
  );
}
