export default interface User {
    id: string;
    username: string;
    email: string;
    firstname: string;
    lastname: string;
    password?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}