import { Metadata } from 'next'
import { ReportViewClient } from './ReportViewClient'

export const metadata: Metadata = {
  title: 'Gespreksverslag — Easy Office Online',
}

export default async function ViewPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  return <ReportViewClient slug={slug} />
}
