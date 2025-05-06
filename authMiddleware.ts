import { getAuth } from "@clerk/tanstack-react-start/server";
import { createMiddleware } from "@tanstack/react-start";
import { getWebRequest } from "vinxi/http";

const authMiddleware = createMiddleware().server(async ({ next }) => {
  const user = await getAuth(getWebRequest());

  if (!user.userId) {
    throw new Error("인증되지 않은 사용자");
  }
  const result = await next({
    context: {
      userId: user.userId,
    },
  });
  return result;
});

export default authMiddleware;
