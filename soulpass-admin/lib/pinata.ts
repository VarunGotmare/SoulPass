import { PinataSDK } from "pinata";

export const pinata = new PinataSDK({
  pinataJwt: process.env.PINATA_JWT!,
  pinataGateway: process.env.NEXT_PUBLIC_GATEWAY_URL!, // e.g. https://gateway.pinata.cloud
});

/**
 * Uploads an image file to Pinata
 */
export async function uploadFileToPinata(file: File) {
  const res = await pinata.upload.public.file(file);
  return `ipfs://${res.cid}`; // ✅ use cid not IpfsHash
}

/**
 * Uploads JSON metadata to Pinata
 */
export async function uploadJSONToPinata(metadata: Record<string, any>) {
  const res = await pinata.upload.public.json(metadata);
  return `ipfs://${res.cid}`;
}
