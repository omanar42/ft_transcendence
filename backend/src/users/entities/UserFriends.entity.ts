export class UserFriends {
  constructor(data: any) {
    this.id = 0;
    this.userId = '';
    this.friendId = data.oauthId;
    this.frUser = data.username;
    this.frAvatar = data.avatar;
    this.frStatus = data.status;
    this.status = '';
    this.actions = [];
  }
  id: number;
  userId: string;
  friendId: string;
  frUser: string;
  frAvatar: string;
  frStatus: string;
  status: string;
  actions: string[];
}
