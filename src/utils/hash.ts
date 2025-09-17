import { createHmac, randomBytes } from "node:crypto";

export function hashPasswordWithSalt(
  password: string,
  userSalt?: string,
) {
  try {
    const salt = userSalt ?? randomBytes(256).toString("hex");
    const hashedPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");

    return { salt, hashedPassword };
  } catch (error) {
    console.error(error);
    throw error;
  }
}