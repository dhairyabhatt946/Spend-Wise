import Image from "next/image";
import { prisma } from "./lib/prisma";

export default async function Home() {
  return (
    <h1>Hello World</h1>
  );
}
