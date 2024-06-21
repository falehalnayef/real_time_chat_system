import { hashData } from "../utils_services/bcrypt.service";
import { UserRepository } from "../../database/repositories/user.repository";

export class UserService{
    
private userRepository: UserRepository;

constructor(userRepository: UserRepository){
    this.userRepository = userRepository;
}
     async register(userName: string, email: string, password: string) {

        const hashedPassword = hashData(password);
        await this.userRepository.addUser(userName, email, await hashedPassword);
      }

}
