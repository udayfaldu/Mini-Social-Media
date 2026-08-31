export interface PostReactions {
  likes: number;
  dislikes: number;
}

export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: PostReactions | number;
  views?: number;
  userId: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
  skip: number;
  limit: number;
}

export interface CreatePostInput {
  title: string;
  body: string;
  userId: number;
  tags: string[];
}

export interface CreatePostFormData {
  title: string;
  body: string;
  tags: string;
}

export interface PostFilterState {
  searchQuery: string;
  selectedTags: string[];
  sortBy: 'latest' | 'popular' | 'title';
}
