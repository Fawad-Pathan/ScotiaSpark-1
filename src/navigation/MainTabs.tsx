import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, Image } from 'react-native';
import Svg, { Path, Circle as SvgCircle, Rect } from 'react-native-svg';
import { colors, typography } from '../theme';

import { SparkFeedScreen } from '../screens/tabs/SparkFeedScreen';
import { AccountScreen } from '../screens/tabs/AccountScreen';
import { LearnScreen } from '../screens/tabs/LearnScreen';
import { CirclesScreen } from '../screens/tabs/CirclesScreen';
import { ProfileScreen } from '../screens/tabs/ProfileScreen';

const Tab = createBottomTabNavigator();

function AccountIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Rect x="2" y="4" width="20" height="16" rx="3" stroke={color} strokeWidth={1.8} />
      <Path d="M2 10H22" stroke={color} strokeWidth={1.8} />
      <Path d="M6 15H10" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function LearnIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <Path d="M4 19.5C4 18.1 5.1 17 6.5 17H20" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M6.5 2H20V22H6.5C5.1 22 4 20.9 4 19.5V4.5C4 3.1 5.1 2 6.5 2Z" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" />
      <Path d="M8 7H16" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
      <Path d="M8 11H13" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function CirclesIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="9" cy="12" r="5" stroke={color} strokeWidth={1.8} />
      <SvgCircle cx="15" cy="12" r="5" stroke={color} strokeWidth={1.8} />
    </Svg>
  );
}

function ProfileIcon({ color, size = 22 }: { color: string; size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      <SvgCircle cx="12" cy="8" r="4" stroke={color} strokeWidth={1.8} />
      <Path d="M4 21C4 17.1 7.6 14 12 14C16.4 14 20 17.1 20 21" stroke={color} strokeWidth={1.8} strokeLinecap="round" />
    </Svg>
  );
}

function TabIcon({ name, focused, isCenter }: { name: string; focused: boolean; isCenter?: boolean }) {
  const color = focused ? colors.scotiaRed : colors.tertiaryText;

  if (isCenter) {
    return (
      <View style={[styles.centerIcon, focused && styles.centerIconActive]}>
        <Image
          source={require('../../assets/logos/spark-logo.jpeg')}
          style={styles.centerLogoImage}
        />
      </View>
    );
  }

  switch (name) {
    case 'AccountTab': return <AccountIcon color={color} />;
    case 'Learn': return <LearnIcon color={color} />;
    case 'Circles': return <CirclesIcon color={color} />;
    case 'Profile': return <ProfileIcon color={color} />;
    default: return null;
  }
}

export function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: colors.scotiaRed,
        tabBarInactiveTintColor: colors.tertiaryText,
        tabBarLabelStyle: styles.tabLabel,
        tabBarIcon: ({ focused }) => (
          <TabIcon
            name={route.name}
            focused={focused}
            isCenter={route.name === 'Spark'}
          />
        ),
      })}
    >
      <Tab.Screen
        name="AccountTab"
        component={AccountScreen}
        options={{ tabBarLabel: 'Account' }}
      />
      <Tab.Screen
        name="Learn"
        component={LearnScreen}
        options={{ tabBarLabel: 'Learn' }}
      />
      <Tab.Screen
        name="Spark"
        component={SparkFeedScreen}
        options={{ tabBarLabel: 'Spark' }}
      />
      <Tab.Screen
        name="Circles"
        component={CirclesScreen}
        options={{ tabBarLabel: 'Circles' }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{ tabBarLabel: 'Profile' }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: colors.cardSurface,
    borderTopWidth: 0.5,
    borderTopColor: colors.cardBorder,
    height: 88,
    paddingTop: 8,
    paddingBottom: 24,
  },
  tabLabel: {
    fontFamily: 'Inter_500Medium',
    fontSize: 11,
    marginTop: 2,
  },
  tabIcon: {
    fontSize: 20,
  },
  tabIconActive: {
    fontSize: 20,
  },
  centerIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -8,
    overflow: 'hidden',
  },
  centerIconActive: {
    backgroundColor: 'transparent',
  },
  centerLogoImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  centerIconText: {
    fontSize: 20,
    color: colors.white,
  },
  centerIconTextActive: {
    color: colors.white,
  },
});
