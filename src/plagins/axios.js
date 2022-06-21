import axios from "axios";
import {firebaseUrl} from "@/utils/firebaseUrl";

export default axios.create({
  url: firebaseUrl
})
