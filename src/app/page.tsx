'use client';

import dynamic from 'next/dynamic';
import 'bootstrap/dist/css/bootstrap.min.css';

const PdfFormApp = dynamic(() => import('@/components/PdfFormApp'), { ssr: false });

export default function Home() {
  return <PdfFormApp />;
}
