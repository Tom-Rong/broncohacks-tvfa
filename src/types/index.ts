export interface UserNote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  description: string;
  content: string;
  uploadedBy: string;
  createdAt: string;
}

export interface GeneratedNote {
  id: string;
  lectureId?: string;
  lectureTitle: string;
  generatedContent: string;
  createdAt: string;
}
