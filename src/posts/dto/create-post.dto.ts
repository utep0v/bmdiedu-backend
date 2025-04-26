export class CreatePostDto {
  title: string;
  content: string;
  coverUrl?: string;
  postType?: string;
  authorId?: string;
}
