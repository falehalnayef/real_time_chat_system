import { compareData, hashData } from "../utils_services/bcrypt.service";
import { UserRepository } from "../../database/repositories/user.repository";
import StatusError from "../../utils/statusError";
import { generateAccessToken } from "../utils_services/jwt.service";

export class UserService{
    
private userRepository: UserRepository;

constructor(userRepository: UserRepository){
    this.userRepository = userRepository;
}
     async register(userName: string, email: string, password: string) {

        const hashedPassword = hashData(password);

        await this.userRepository.addUser(userName, email, await hashedPassword);
      }


      async login(email: string, password: string) {
            
         const user = await this.userRepository.getUserByEmail(email);
          if(!user) throw new StatusError(400, "Invalid credentials.");
          const checkPass = compareData(password, user.password);
          if(!(await checkPass)) throw new StatusError(400, "Invalid credentials.");

          const accessToken = generateAccessToken(user._id);

          return {id: user._id, name: user.userName, accessToken};


        }

} 
