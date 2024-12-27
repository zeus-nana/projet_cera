import jwt, { verify } from 'jsonwebtoken';

const signToken = (id: number, email: string) => {
  console.log("secret JWT ==> ",process.env.JWT_SECRET); // Ajoutez cette ligne temporairement

  return jwt.sign({ id, email }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const jwtVerify = async function (token: string, secret: string): Promise<any> {
  return new Promise((resolve, reject) => {
    verify(token, secret, (err, decoded) => {
      if (err) {
        return reject(err);
      }
      resolve(decoded);
    });
  });
};

export { signToken, jwtVerify };
