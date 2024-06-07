export interface wordDto {
  word: string;
  meaning: string;
  like_amount: number;
  dislike_amount: number;
  isLike: number;
  word_id: number;
  member_id: string;
  nickname: string;
  deletable: string;
}

export interface elementOption {
  attribute?: string | string[];
  textContent?: string;
  value?: string | string[];
  child?: Node | Node[];
  class?: string | string[];
}

export interface dialogOption {
  title: string;
  content: string;
  hasCancel: boolean;
}
