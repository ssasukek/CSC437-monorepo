import bcrypt from "bcryptjs";
import { Schema, model } from "mongoose";
import { Credential } from "../models/credential";

const credentialSchema = new Schema<Credential>(
  {
    username:      { type: String, required: true, trim: true },
    hashedPassword: { type: String, required: true }
  },
  { collection: "user_credentials" }
);
const credentialModel = model<Credential>("Credential", credentialSchema);

/** create new user credential (throws if username exists) */
function create(username: string, password: string): Promise<Credential> {
  return credentialModel
  .find({ username })
  .then((found: Credential[]) => {
    if (found.length) throw `Username exists: ${username}`
  })
  .then(() =>
    bcrypt
      .genSalt(10)
      .then((salt: string) => bcrypt.hash(password, salt))
      .then((hashedPassword: string) => {
        const creds = new credentialModel({
          username,
          hashedPassword
        });
        return creds.save();
      })
  );
}

/** verify username/password, resolve username on success */
function verify(username: string, password: string) : Promise<string>
{
  return credentialModel
    .find({ username })
    .then((found) => {
      if (!found || found.length !== 1)
        throw "Invalid username or password";
      return found[0];
    })
    .then(
      (credsOnFile : Credential) =>
        bcrypt.compare(
          password,
          credsOnFile.hashedPassword
        )
        .then((result: boolean) => {
          if (!result)
            throw("Invalid username or password");
          return credsOnFile.username;
        })
      );
}

export default { create, verify };