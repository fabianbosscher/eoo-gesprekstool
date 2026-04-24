export interface ReportParticipant {
  name: string
  role: string
  company: string
}

export interface ReportHighlight {
  title: string
  content: string
}

export interface ReportActionItem {
  owner: string
  action: string
  deadline: string
}

export interface ReportNextStep {
  step: string
  date: string
  owner?: string
}

export interface ReportOfferItem {
  description: string
  price: string
}

export interface ReportContent {
  overview: {
    summary: string
    keyTakeaways: string[]
    stats: {
      duration: string
      participants: number
      appointmentsPlanned: number
      dealValue: string
    }
  }
  participants: ReportParticipant[]
  proposition: string
  highlights: ReportHighlight[]
  collaboration: string
  offer: {
    intro: string
    items: ReportOfferItem[]
    total: string
    validity: string
  }
  actionItems: ReportActionItem[]
  nextSteps: ReportNextStep[]
  contact: {
    name: string
    role: string
    email: string
    phone: string
    company: string
    website: string
  }
}
