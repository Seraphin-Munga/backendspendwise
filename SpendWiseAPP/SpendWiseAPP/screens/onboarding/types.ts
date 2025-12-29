import { ImageSourcePropType } from 'react-native';

export interface OnboardingSlide {
  id: number;
  title: string;
  description: string;
  image: ImageSourcePropType;
}

export interface OnboardingScreenProps {
  onComplete: () => void;
}

