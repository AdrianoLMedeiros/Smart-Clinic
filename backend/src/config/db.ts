import mongoose from "mongoose";

export async function connectDb(uri?: string) {
  const finalUri = uri ?? process.env.MONGODB_URI;
  if (!finalUri) throw new Error("MONGODB_URI is not set");

  mongoose.set("strictQuery", true);

  // evita múltiplas conexões (útil em testes)
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(finalUri);
  console.log("[db] connected");
}

export async function disconnectDb() {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
}
