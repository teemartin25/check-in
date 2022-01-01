export class User {
  constructor(
    public name: string,
    public userName: string,
    public emailAddress: string,
    public gender: string,
    public hobbies: string,
    public phoneNumber: number,
    public imagePath: string,
    public status: string,
    public id?: string
  ) {}
}
