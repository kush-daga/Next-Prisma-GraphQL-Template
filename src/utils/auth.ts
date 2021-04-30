import prisma from "./prisma";
import SecurePassword from "secure-password";

const securePassword = new SecurePassword();

export const hashPassword = async (password: string) => {
  try {
    return await securePassword.hash(Buffer.from(password));
  } catch (err) {
    throw new Error("Error in hash password" + err.message);
  }
};

export const verifyPassword = async (
  hashedPassword: Buffer,
  password: string
) => {
  try {
    return await securePassword.verify(Buffer.from(password), hashedPassword);
  } catch (error) {
    console.log("ERROR IN VERIFY PASS", error);
    return SecurePassword.INVALID;
  }
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await prisma.user.findUnique({
    where: {
      email: email
    }
  });

  if (!user || !user.hashedPassword) {
    throw new Error("Email not found");
  }
  let isVerified;
  try {
    isVerified = await verifyPassword(user.hashedPassword, password);
  } catch (err) {
    console.error("ERROR" + err.message);
  }

  switch (isVerified) {
    case SecurePassword.VALID:
      break;
    case SecurePassword.VALID_NEEDS_REHASH:
      console.log("here");
      const newHash = await hashPassword(password);
      await prisma.user.update({
        where: { id: user.id },
        data: {
          hashedPassword: newHash
        }
      });
      break;
    default:
      throw new Error("Invalid Password");
  }

  return user;
};
