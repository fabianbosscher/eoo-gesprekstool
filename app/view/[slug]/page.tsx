import { Metadata } from 'next'
import { ReportViewClient } from './ReportViewClient'

export const metadata: Metadata = {
  title: 'Gespreksverslag — Easy Office Online',
}

export default function ViewPage({ params }: { params: { slug: string } }) {
  return <ReportViewClient slug={params.slug} />
}
