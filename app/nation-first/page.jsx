import JourneyTimeline from "../../components/journey/JourneyTimeline";
import { nationEvents } from "../../data/journeyData";
export const metadata = { title: "राष्ट्र प्रथम | Sachin Lavate", description: "National development milestones and the Nation First journey." };
export default function NationFirstPage() { return <JourneyTimeline type="nation" events={nationEvents} />; }
