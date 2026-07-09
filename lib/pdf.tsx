import { Document, Page, Text, View, StyleSheet, Svg, Path, renderToBuffer } from '@react-pdf/renderer'
import type { ReportContent } from './types'
import { formatDateNL } from './dates'

// EOO brand palette
const COLORS = {
  marine: '#03173D',
  blue: '#208AD0',
  green: '#53D4A7',
  violet: '#8B5CF6',
  yellow: '#FBBF24',
  orange: '#FB923C',
  cyan: '#22D3EE',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  white: '#FFFFFF',
  redSoft: '#FEE2E2',
}

const ACCENTS = [COLORS.blue, COLORS.green, COLORS.violet, COLORS.yellow, COLORS.orange, COLORS.cyan]

const styles = StyleSheet.create({
  page: {
    backgroundColor: COLORS.white,
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: COLORS.gray700,
    paddingTop: 50,
    paddingBottom: 60,
    paddingHorizontal: 50,
    lineHeight: 1.5,
  },
  // Cover page
  coverPage: {
    backgroundColor: COLORS.marine,
    color: COLORS.white,
    padding: 0,
    fontFamily: 'Helvetica',
  },
  coverInner: {
    flex: 1,
    padding: 60,
    justifyContent: 'space-between',
  },
  coverTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  coverBrand: {
    fontSize: 20,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
  },
  coverBrandAccent: {
    color: COLORS.blue,
  },
  coverTag: {
    fontSize: 10,
    color: COLORS.green,
    marginTop: 4,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
  },
  coverTitleBlock: {
    marginTop: 40,
  },
  coverLabel: {
    fontSize: 11,
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: 12,
  },
  coverTitle: {
    fontSize: 34,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.white,
    lineHeight: 1.15,
  },
  coverSubtitle: {
    fontSize: 14,
    color: COLORS.blue,
    marginTop: 18,
    fontFamily: 'Helvetica-Bold',
  },
  coverMetaBox: {
    borderTop: `1pt solid ${COLORS.blue}`,
    paddingTop: 22,
    flexDirection: 'row',
    gap: 40,
  },
  coverMetaCol: {
    flex: 1,
  },
  coverMetaLabel: {
    fontSize: 8,
    color: COLORS.green,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 4,
  },
  coverMetaValue: {
    fontSize: 12,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
  },
  coverFooter: {
    fontSize: 8,
    color: COLORS.gray400,
    textAlign: 'center',
  },

  // Content pages
  header: {
    position: 'absolute',
    top: 20,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottom: `1pt solid ${COLORS.gray200}`,
    paddingBottom: 8,
  },
  headerBrand: {
    fontSize: 10,
    color: COLORS.marine,
    fontFamily: 'Helvetica-Bold',
  },
  headerBrandAccent: {
    color: COLORS.blue,
  },
  headerMeta: {
    fontSize: 9,
    color: COLORS.gray400,
  },
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 50,
    right: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    fontSize: 8,
    color: COLORS.gray400,
    borderTop: `0.5pt solid ${COLORS.gray200}`,
    paddingTop: 8,
  },
  sectionEyebrow: {
    fontSize: 8,
    color: COLORS.blue,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 20,
    color: COLORS.marine,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 14,
  },
  sectionBlock: {
    marginBottom: 22,
  },
  paragraph: {
    fontSize: 10,
    color: COLORS.gray700,
    lineHeight: 1.55,
  },
  bulletRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  bulletMark: {
    color: COLORS.green,
    fontFamily: 'Helvetica-Bold',
    marginRight: 8,
    width: 10,
  },
  bulletText: {
    flex: 1,
    fontSize: 10,
    color: COLORS.gray700,
    lineHeight: 1.5,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: COLORS.gray50,
    borderRadius: 6,
    padding: 12,
    textAlign: 'center',
  },
  statValue: {
    fontSize: 16,
    color: COLORS.marine,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
  },
  statLabel: {
    fontSize: 8,
    color: COLORS.gray400,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 3,
  },
  card: {
    borderLeft: `3pt solid ${COLORS.blue}`,
    backgroundColor: COLORS.gray50,
    padding: 12,
    marginBottom: 8,
    borderRadius: 4,
  },
  cardTitle: {
    fontSize: 11,
    color: COLORS.marine,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 4,
  },
  cardBody: {
    fontSize: 10,
    color: COLORS.gray600,
    lineHeight: 1.5,
  },
  participantRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 10,
    backgroundColor: COLORS.gray50,
    borderRadius: 4,
    marginBottom: 6,
    gap: 10,
  },
  avatar: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.blue,
    color: COLORS.white,
    textAlign: 'center',
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    paddingTop: 7,
  },
  participantName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: COLORS.marine,
  },
  participantMeta: {
    fontSize: 9,
    color: COLORS.gray500,
    marginTop: 1,
  },
  offerTable: {
    borderRadius: 6,
    overflow: 'hidden',
    marginTop: 6,
  },
  offerHeaderRow: {
    flexDirection: 'row',
    backgroundColor: COLORS.marine,
    color: COLORS.white,
    padding: 8,
  },
  offerHeaderCell: {
    fontSize: 9,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  offerRow: {
    flexDirection: 'row',
    padding: 8,
    borderBottom: `0.5pt solid ${COLORS.gray200}`,
  },
  offerRowAlt: {
    backgroundColor: COLORS.gray50,
  },
  offerCell: {
    fontSize: 10,
    color: COLORS.gray700,
  },
  offerTotalRow: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: COLORS.blue,
    color: COLORS.white,
  },
  offerTotalCell: {
    fontSize: 11,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    padding: 10,
    borderRadius: 6,
    backgroundColor: COLORS.gray50,
    gap: 10,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: COLORS.blue,
    color: COLORS.white,
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 5,
  },
  actionCheckbox: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: COLORS.yellow,
    color: COLORS.marine,
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'center',
    paddingTop: 2,
    marginRight: 8,
    marginTop: 2,
  },
  chip: {
    fontSize: 8,
    color: COLORS.blue,
    backgroundColor: '#E6F1FA',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginRight: 6,
  },
  contactBox: {
    backgroundColor: COLORS.marine,
    color: COLORS.white,
    padding: 20,
    borderRadius: 8,
    marginTop: 4,
  },
  contactName: {
    fontSize: 14,
    color: COLORS.white,
    fontFamily: 'Helvetica-Bold',
  },
  contactRole: {
    fontSize: 10,
    color: COLORS.blue,
    marginTop: 2,
  },
  contactDetail: {
    fontSize: 9,
    color: COLORS.gray200,
    marginTop: 5,
  },
  bookingBox: {
    marginTop: 14,
    padding: 14,
    borderRadius: 6,
    backgroundColor: '#E9F7F1',
    borderLeft: `3pt solid ${COLORS.green}`,
  },
  bookingTitle: {
    fontSize: 11,
    color: COLORS.marine,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 3,
  },
  bookingBody: {
    fontSize: 9,
    color: COLORS.gray600,
    marginBottom: 4,
  },
  bookingLink: {
    fontSize: 9,
    color: COLORS.blue,
  },
})

function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('')
}

function EooMark({ size = 22 }: { size?: number }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Path
        d="M50 5 A45 45 0 1 1 5 50 L20 50 A30 30 0 1 0 50 20 Z"
        fill={COLORS.blue}
      />
    </Svg>
  )
}

function PageHeader({ title }: { title: string }) {
  return (
    <View fixed style={styles.header}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <EooMark size={14} />
        <Text style={styles.headerBrand}>
          Easy <Text style={styles.headerBrandAccent}>Office</Text> Online
        </Text>
      </View>
      <Text style={styles.headerMeta}>{title}</Text>
    </View>
  )
}

function PageFooter({ clientName }: { clientName: string }) {
  return (
    <View fixed style={styles.footer}>
      <Text>Gespreksverslag · {clientName}</Text>
      <Text
        render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
      />
    </View>
  )
}

interface PDFProps {
  title: string
  clientName: string
  meetingDate: Date | string
  content: ReportContent
  creatorName: string | null
  bookingUrl: string | null
}

export function ReportPDF({
  title,
  clientName,
  meetingDate,
  content,
  creatorName,
  bookingUrl,
}: PDFProps) {
  const dateLong = formatDateNL(meetingDate)

  return (
    <Document
      title={title}
      author={creatorName ?? 'Easy Office Online'}
      subject={`Gespreksverslag – ${clientName}`}
      creator="Easy Office Online Gesprekstool"
    >
      {/* Cover */}
      <Page size="A4" style={styles.coverPage}>
        <View style={styles.coverInner}>
          <View>
            <View style={styles.coverTopBar}>
              <EooMark size={26} />
              <View>
                <Text style={styles.coverBrand}>
                  Easy <Text style={styles.coverBrandAccent}>Office</Text> Online
                </Text>
                <Text style={styles.coverTag}>Gesprekstool</Text>
              </View>
            </View>

            <View style={styles.coverTitleBlock}>
              <Text style={styles.coverLabel}>Gespreksverslag & Voorstel</Text>
              <Text style={styles.coverTitle}>{title}</Text>
              <Text style={styles.coverSubtitle}>{dateLong}</Text>
            </View>
          </View>

          <View style={styles.coverMetaBox}>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>Voor</Text>
              <Text style={styles.coverMetaValue}>{clientName}</Text>
            </View>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>Opgesteld door</Text>
              <Text style={styles.coverMetaValue}>{creatorName ?? 'Easy Office Online'}</Text>
            </View>
            <View style={styles.coverMetaCol}>
              <Text style={styles.coverMetaLabel}>Datum</Text>
              <Text style={styles.coverMetaValue}>{dateLong}</Text>
            </View>
          </View>

          <Text style={styles.coverFooter}>
            Vertrouwelijk · Uitsluitend bestemd voor de geadresseerde · easyofficeonline.nl
          </Text>
        </View>
      </Page>

      {/* Content page */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={`${clientName} · ${dateLong}`} />

        {/* Overview */}
        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>01 Overzicht</Text>
          <Text style={styles.sectionTitle}>Samenvatting van het gesprek</Text>
          <Text style={styles.paragraph}>{content.overview.summary}</Text>

          {content.overview.keyTakeaways.length > 0 && (
            <View style={{ marginTop: 12 }}>
              <Text style={{ ...styles.paragraph, fontFamily: 'Helvetica-Bold', marginBottom: 6, color: COLORS.marine }}>
                Belangrijkste inzichten
              </Text>
              {content.overview.keyTakeaways.map((t, i) => (
                <View key={i} style={styles.bulletRow}>
                  <Text style={styles.bulletMark}>✓</Text>
                  <Text style={styles.bulletText}>{t}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{content.overview.stats.duration || '—'}</Text>
              <Text style={styles.statLabel}>Duur</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{content.overview.stats.participants || 0}</Text>
              <Text style={styles.statLabel}>Deelnemers</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{content.overview.stats.appointmentsPlanned || 0}</Text>
              <Text style={styles.statLabel}>Afspraken</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statValue}>{content.overview.stats.dealValue || '—'}</Text>
              <Text style={styles.statLabel}>Deal</Text>
            </View>
          </View>
        </View>

        {/* Participants */}
        {content.participants.length > 0 && (
          <View style={styles.sectionBlock} wrap={false}>
            <Text style={styles.sectionEyebrow}>02 Deelnemers</Text>
            <Text style={styles.sectionTitle}>Aan tafel</Text>
            {content.participants.map((p, i) => (
              <View key={i} style={styles.participantRow}>
                <Text style={{ ...styles.avatar, backgroundColor: ACCENTS[i % ACCENTS.length] }}>
                  {initials(p.name || '?')}
                </Text>
                <View style={{ flex: 1 }}>
                  <Text style={styles.participantName}>{p.name || '—'}</Text>
                  <Text style={styles.participantMeta}>
                    {[p.role, p.company].filter(Boolean).join(' · ')}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}

        <PageFooter clientName={clientName} />
      </Page>

      {/* Propositie & Highlights */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={`${clientName} · ${dateLong}`} />

        {content.proposition && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionEyebrow}>03 Propositie</Text>
            <Text style={styles.sectionTitle}>Wat Easy Office Online biedt</Text>
            <Text style={styles.paragraph}>{content.proposition}</Text>
          </View>
        )}

        {content.highlights.length > 0 && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionEyebrow}>04 Gesprekshighlights</Text>
            <Text style={styles.sectionTitle}>Wat er is besproken</Text>
            {content.highlights.map((h, i) => (
              <View
                key={i}
                style={{ ...styles.card, borderLeftColor: ACCENTS[i % ACCENTS.length] }}
                wrap={false}
              >
                <Text style={styles.cardTitle}>{h.title}</Text>
                <Text style={styles.cardBody}>{h.content}</Text>
              </View>
            ))}
          </View>
        )}

        {content.collaboration && (
          <View style={styles.sectionBlock} wrap={false}>
            <Text style={styles.sectionEyebrow}>05 Samenwerking</Text>
            <Text style={styles.sectionTitle}>Hoe we samen verder gaan</Text>
            <Text style={styles.paragraph}>{content.collaboration}</Text>
          </View>
        )}

        <PageFooter clientName={clientName} />
      </Page>

      {/* Offer + Next Steps */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={`${clientName} · ${dateLong}`} />

        {content.offer && (content.offer.items?.length > 0 || content.offer.intro || content.offer.total) && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionEyebrow}>06 Offerte</Text>
            <Text style={styles.sectionTitle}>Ons voorstel</Text>
            {content.offer.intro && (
              <Text style={{ ...styles.paragraph, marginBottom: 10 }}>{content.offer.intro}</Text>
            )}

            {content.offer.items && content.offer.items.length > 0 && (
              <View style={styles.offerTable}>
                <View style={styles.offerHeaderRow}>
                  <Text style={{ ...styles.offerHeaderCell, flex: 3 }}>Dienst</Text>
                  <Text style={{ ...styles.offerHeaderCell, flex: 1, textAlign: 'right' }}>Prijs</Text>
                </View>
                {content.offer.items.map((item, i) => (
                  <View
                    key={i}
                    style={{ ...styles.offerRow, ...(i % 2 === 0 ? styles.offerRowAlt : {}) }}
                  >
                    <Text style={{ ...styles.offerCell, flex: 3 }}>{item.description}</Text>
                    <Text style={{ ...styles.offerCell, flex: 1, textAlign: 'right', fontFamily: 'Helvetica-Bold', color: COLORS.marine }}>
                      {item.price}
                    </Text>
                  </View>
                ))}
                {content.offer.total && (
                  <View style={styles.offerTotalRow}>
                    <Text style={{ ...styles.offerTotalCell, flex: 3 }}>Totaal</Text>
                    <Text style={{ ...styles.offerTotalCell, flex: 1, textAlign: 'right' }}>
                      {content.offer.total}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {content.offer.validity && (
              <Text style={{ ...styles.paragraph, marginTop: 10, color: COLORS.gray500, fontSize: 9 }}>
                {content.offer.validity}
              </Text>
            )}
          </View>
        )}

        {(content.nextSteps.length > 0 || content.actionItems.length > 0) && (
          <View style={styles.sectionBlock}>
            <Text style={styles.sectionEyebrow}>07 Volgende stappen</Text>
            <Text style={styles.sectionTitle}>Zo gaan we door</Text>

            {content.nextSteps.map((s, i) => (
              <View key={i} style={styles.stepRow} wrap={false}>
                <Text style={styles.stepNumber}>{i + 1}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 10, color: COLORS.marine, fontFamily: 'Helvetica-Bold' }}>
                    {s.step}
                  </Text>
                  <View style={{ flexDirection: 'row', marginTop: 3 }}>
                    {s.date ? <Text style={styles.chip}>📅 {s.date}</Text> : null}
                    {s.owner ? (
                      <Text style={{ fontSize: 8, color: COLORS.gray500 }}>👤 {s.owner}</Text>
                    ) : null}
                  </View>
                </View>
              </View>
            ))}

            {content.actionItems.length > 0 && (
              <View style={{ marginTop: 12 }}>
                <Text
                  style={{
                    fontSize: 11,
                    color: COLORS.marine,
                    fontFamily: 'Helvetica-Bold',
                    marginBottom: 6,
                  }}
                >
                  Actiepunten
                </Text>
                {content.actionItems.map((a, i) => (
                  <View
                    key={i}
                    style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 5 }}
                    wrap={false}
                  >
                    <Text style={styles.actionCheckbox}>✓</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontSize: 10, color: COLORS.gray700 }}>{a.action}</Text>
                      <Text style={{ fontSize: 8, color: COLORS.gray500, marginTop: 1 }}>
                        {[a.owner && `👤 ${a.owner}`, a.deadline && `📅 ${a.deadline}`]
                          .filter(Boolean)
                          .join('  ·  ')}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {bookingUrl && (
              <View style={styles.bookingBox}>
                <Text style={styles.bookingTitle}>Vervolgafspraak inplannen</Text>
                <Text style={styles.bookingBody}>
                  Direct een tijdslot kiezen via onze online agenda.
                </Text>
                <Text style={styles.bookingLink}>{bookingUrl}</Text>
              </View>
            )}
          </View>
        )}

        <PageFooter clientName={clientName} />
      </Page>

      {/* Contact */}
      <Page size="A4" style={styles.page}>
        <PageHeader title={`${clientName} · ${dateLong}`} />

        <View style={styles.sectionBlock}>
          <Text style={styles.sectionEyebrow}>08 Contact</Text>
          <Text style={styles.sectionTitle}>Vragen? Neem gerust contact op</Text>

          <View style={styles.contactBox}>
            <Text style={styles.contactName}>{content.contact.name || 'Easy Office Online'}</Text>
            {content.contact.role && <Text style={styles.contactRole}>{content.contact.role}</Text>}
            {content.contact.email && (
              <Text style={styles.contactDetail}>📧  {content.contact.email}</Text>
            )}
            {content.contact.phone && (
              <Text style={styles.contactDetail}>📞  {content.contact.phone}</Text>
            )}
            {content.contact.website && (
              <Text style={styles.contactDetail}>🌐  {content.contact.website}</Text>
            )}
          </View>

          <Text
            style={{
              marginTop: 30,
              fontSize: 9,
              color: COLORS.gray500,
              textAlign: 'center',
              lineHeight: 1.6,
            }}
          >
            Dit gespreksverslag is opgesteld naar aanleiding van ons gesprek op {dateLong}.
            Voor vragen of aanpassingen: reageer op de e-mail waarmee je dit rapport hebt ontvangen.
          </Text>
        </View>

        <PageFooter clientName={clientName} />
      </Page>
    </Document>
  )
}

export async function renderReportPDF(props: PDFProps): Promise<Buffer> {
  return renderToBuffer(<ReportPDF {...props} />)
}
