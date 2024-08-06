import { IUser } from "../interfaces/business_interfaces/IUser";

export class User {
    
    private user:IUser;
    
    constructor(user:IUser) {
        this.user = user;
    }

    toJSON() {
        return {
            id: this.user._id,
            name: this.user.userName,
            email: this.user.email,
            pohtoPath: this.user.pohtoPath,
            bio: this.user.bio,
            groups: this.user.groups,
            contacts: this.user.contacts,
            blockedUsers: this.user.blockedUsers,
        }

    }
}