import {User} from "./schemas/user.schema";

export class FakeUserModel {
    private static users: Partial<User & { _id: string; password: string }>[] = [];

    constructor(private readonly doc: Partial<User>) {}

    async save() {
        const newUser = {
            ...this.doc,
            _id: (FakeUserModel.users.length + 1).toString(),
        };
        FakeUserModel.users.push(newUser as any);

        return { ...newUser, toObject: () => newUser };
    }

    static findOne(query: any) {
        const user = FakeUserModel.users.find(u => u.username === query.username);
        return {
            exec: async () => {
                return user ? { ...user, toObject: () => user } : null;
            },
        };
    }

    static reset() {
        FakeUserModel.users = [];
    }
}
