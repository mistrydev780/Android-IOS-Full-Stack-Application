
export type Post = {
  id: number;
  userId: number;
  title: string;
  body: string;
};

const API_URL =
  'https://api.jsonplaceholder.dev/posts?userId=1';

// GET API
export const getPosts = async (): Promise<Post[]> => {
  const response = await fetch(API_URL);

  // Check HTTP status
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  const data: Post[] = await response.json();

  return data;
};
