import JourneyTimeline from "../../components/journey/JourneyTimeline";
import { partyEvents } from "../../data/journeyData";
export const metadata = { title: "नंतर पक्ष | Sachin Lavate", description: "The Bharatiya Jana Sangh and Bharatiya Janata Party journey." };
export default function PartyNextPage() { return <JourneyTimeline type="party" events={partyEvents} />; }
