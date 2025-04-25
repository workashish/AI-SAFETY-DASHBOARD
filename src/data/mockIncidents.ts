export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  reported_at: string;
}

export const mockIncidents: Incident[] = [
  {
    id: 1,
    title: "Biased Recommendation Algorithm",
    description: "Algorithm consistently favored certain demographics in product recommendations, leading to unequal exposure and opportunities across user segments.",
    severity: "Medium",
    reported_at: "2025-03-15T10:00:00Z"
  },
  {
    id: 2,
    title: "LLM Hallucination in Critical Info",
    description: "LLM provided incorrect safety procedure information during an emergency response simulation, potentially endangering users in real-world scenarios.",
    severity: "High",
    reported_at: "2025-04-01T14:30:00Z"
  },
  {
    id: 3,
    title: "Minor Data Leak via Chatbot",
    description: "Chatbot inadvertently exposed non-sensitive user metadata in responses, revealing information about user preferences that should have remained private.",
    severity: "Low",
    reported_at: "2025-04-10T09:15:00Z"
  }
];
