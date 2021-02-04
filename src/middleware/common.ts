import axios from "axios";

export const client = axios.create({
  timeout: 3000,
  headers: {"content-type": "application/json"},
})