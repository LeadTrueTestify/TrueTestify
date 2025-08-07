// mock/reviews.ts
import audio from "./test.mp3"
import video from "./test-video.webm"

export const mockReviews = [
  {
    id: '1',
    type: 'video',
    url: video,
    author: 'Ahsan J.',
    rating: 5,
    createdAt: '2025-08-01',
    status: 'approved',
  },
  {
    id: '2',
    type: 'audio',
    audiourl: audio,
    author: 'Fatima R.',
    rating: 4,
    createdAt: '2025-07-29',
    status: 'approved',
  },
  {
    id: '3',
    type: 'text',
    content: 'Excellent service! Highly recommended.',
    author: 'Mohsin K.',
    rating: 5,
    createdAt: '2025-07-30',
    status: 'approved',
  }
]
