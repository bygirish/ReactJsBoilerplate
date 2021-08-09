import { all } from "redux-saga/effects";

// import { watchAuth } from "@common/redux/auth/sagas";

export default function* rootSaga(): Generator {
  yield all([
    // watchAuth(),
  ]);
}


