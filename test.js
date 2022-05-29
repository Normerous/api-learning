import http from "k6/http";
import { check } from "k6";
export let options = {
  iterations: 20,
  vus: 10
};

const params = {
  headers: {
    "Content-Type": "application/json",
    "authorization":
    "Bearer XWRHM6hcDRD86Q7YWkwZrcTZJfFlpicc"
  },
}

export default function () {
  // const res = http.get("http://localhost:8001/api/test1");
  // const res2 = http.get("http://localhost:8001/api/genbooking/genbooking");
  const res = http.get("http://localhost:8001/api/genbooking/genbookingV2");
  // const res = http.post("http://localhost:8001/api/v2/booking/order/online/7000000120623", null, params);
  // check(res2, {
  //   "is status 0": (r) => r.status === 0,
  //   "is status 200": (r) => r.status === 200,
  //   "is status 404": (r) => r.status === 404,
  //   "is status 400": (r) => r.status === 400,
  //   "is status 408": (r) => r.status === 408
  // })
  check(res, {
    "is status 0": (r) => r.status === 0,
    "is status 200": (r) => r.status === 200,
    "is status 404": (r) => r.status === 404,
    "is status 400": (r) => r.status === 400,
    "is status 408": (r) => r.status === 408
  })
}