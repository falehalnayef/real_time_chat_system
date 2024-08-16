import { IGroup } from "../interfaces/business_interfaces/IGroup";

export class Group {
    
    private group:IGroup;
    
    constructor(group:IGroup) {
        this.group = group;
    }

    toJSON() {
        return {
            _id: this.group._id,
            groupName: this.group.bio,
            members: this.group.members,
            membersCount: this.group.membersCount,
            photoPath: this.group.photoPath,
            bio: this.group.bio,
            date: this.group.date,
            createdBy: this.group.createdBy,
            isPrivate: this.group,
        }

    }
}