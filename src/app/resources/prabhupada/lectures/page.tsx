import { Metadata } from 'next';
import LecturesClient from './LecturesClient';

// Metadata for the page
export const metadata: Metadata = {
  title: 'Srila Prabhupada Lectures | ISKCON',
  description: 'Listen to enlightening lectures by His Divine Grace A.C. Bhaktivedanta Swami Prabhupada',
};

export default function LecturesPage() {
  return <LecturesClient />;
}