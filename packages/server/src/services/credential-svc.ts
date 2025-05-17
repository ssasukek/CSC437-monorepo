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
const CredentialModel = model<Credential>("Credential", credentialSchema);

/** create new user credential (throws if username exists) */
function create(username: string, password: string): Promise<Credential> {
  return CredentialModel.find({ username })
    .then(found => {
      if (found.length) throw new Error(`Username exists: ${username}`);
    })
    .then(() => bcrypt.genSalt(10))
    .then(salt => bcrypt.hash(password, salt))
    .then(hash => new CredentialModel({ username, hashedPassword: hash }).save());
}

/** verify username/password, resolve username on success */
function verify(username: string, password: string): Promise<string> {
  return CredentialModel.find({ username })
    .then(found => {
      if (!found || found.length !== 1)
        throw new Error("Invalid username or password");
      return found[0];
    })
    .then(creds =>
      bcrypt.compare(password, creds.hashedPassword)
        .then(ok => {
          if (!ok) throw new Error("Invalid username or password");
          return creds.username;
        })
    );
}

export default { create, verify };