export type ProjectStatus = "Draft" | "In Review" | "Awaiting Client Feedback" | "Revision Requested" | "Approved" | "Final Delivered";

export interface Project {
  id: string;
  clientId: string;
  clientName: string;
  projectTitle: string;
  songTitle: string;
  coverUrl?: string; // Path to image
  audioUrl?: string; // Path to wav
  status: ProjectStatus;
  updatedAt: string;
}

export const MOCK_PROJECTS: Project[] = [
  {
    id: "uuid-1",
    clientId: "client-1",
    clientName: "John Doe",
    projectTitle: "Gospel Devotionals EP",
    songTitle: "ప్రియ యేసు, నా ప్రియ యేసు", // Priya Yesu
    coverUrl: "/media/Priyune Thalampulu.jpg",
    audioUrl: "/media/ప్రియ యేసు, నా ప్రియ యేసు (Remastered).wav",
    status: "In Review",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "uuid-2",
    clientId: "client-1",
    clientName: "John Doe",
    projectTitle: "Morning Worship",
    songTitle: "శ్రీ యేసుని సుప్రభాతం", // Sri Yesuni Suprabhatam
    coverUrl: "/media/Sri Yasu Shuprabatham.jpg",
    audioUrl: "/media/శ్రీ యేసుని సుప్రభాతం.wav",
    status: "Awaiting Client Feedback",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "uuid-3",
    clientId: "client-2",
    clientName: "Jane Smith",
    projectTitle: "Acoustic Sessions",
    songTitle: "Smarinchedha",
    coverUrl: "/media/Nibandhana Varam.jpg",
    audioUrl: "/media/smarinchedha (Remastered).wav",
    status: "Final Delivered",
    updatedAt: new Date().toISOString(),
  }
];

export const MOCK_STATS = {
  totalProjects: 12,
  inReview: 4,
  awaitingFeedback: 3,
  delivered: 5,
};
