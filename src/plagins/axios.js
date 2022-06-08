import axios from "axios";
import dbUrl from "@/utils/dbUrl";

export default axios.create({
  url: dbUrl
})
